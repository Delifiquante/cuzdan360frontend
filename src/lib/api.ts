
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
        localStorage.removeItem('authToken');
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