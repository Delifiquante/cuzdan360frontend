
export async function fetchAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('authToken');
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${apiBaseUrl}${url}`, {
        ...options,
        headers,
    });

    // Eğer token geçersiz veya süresi dolmuşsa (401 Unauthorized)
    if (response.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try {
                const refreshResponse = await fetch(`${apiBaseUrl}/api/Auth/refresh-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refreshToken }),
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    if (data.token) {
                        localStorage.setItem('authToken', data.token);
                        // Eğer yeni refresh token gelirse onu da güncelle
                        if (data.refreshToken) {
                            localStorage.setItem('refreshToken', data.refreshToken);
                        }

                        // Orijinal isteği yeni token ile tekrarla
                        const newHeaders = new Headers(options.headers || {});
                        newHeaders.set('Authorization', `Bearer ${data.token}`);
                        if (!newHeaders.has('Content-Type') && !(options.body instanceof FormData)) {
                            newHeaders.set('Content-Type', 'application/json');
                        }

                        const retryResponse = await fetch(`${apiBaseUrl}${url}`, {
                            ...options,
                            headers: newHeaders,
                        });

                        if (!retryResponse.ok) {
                            const errorData = await retryResponse.json();
                            throw new Error(errorData.error || errorData.message || 'Bir hata oluştu');
                        }

                        const text = await retryResponse.text();
                        return text ? JSON.parse(text) : {};
                    }
                }
            } catch (error) {
                console.error('Token yenileme hatası:', error);
            }
        }

        // Refresh başarısızsa veya refresh token yoksa çıkış yap
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        // Kullanıcıyı login ekranına yönlendir
        window.location.href = '/login';
        throw new Error('Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.');
    }

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Bir hata oluştu');
    }

    // Bazı API çağrıları (örn. DELETE) boş yanıt dönebilir
    const text = await response.text();
    return text ? JSON.parse(text) : {};
}