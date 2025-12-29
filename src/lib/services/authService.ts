import { fetchAuth } from '@/lib/api';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
const MOCK_DELAY = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface LoginRequest {
    email: string;
    password?: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password?: string;
}

export interface AuthResponse {
    token?: string;
    requiresOtp?: boolean;
    message?: string;
    error?: string;
    isEmailVerified?: boolean;
    email?: string;
    refreshToken?: string; // 👈 Eklendi
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface UpdateProfileRequest {
    username: string;
    email: string;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        // Mock login logic
        if (data.email === 'fail@example.com') {
            return Promise.resolve({ error: 'Kullanıcı bulunamadı veya şifre hatalı.' });
        }

        return Promise.resolve({
            token: 'mock-jwt-token-123456789',
            message: 'Giriş başarılı',
        });
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    // Note: fetchAuth handles headers and base URL internally, but here we might need raw fetch 
    // if fetchAuth assumes a token exists (which it doesn't for login).
    // However, fetchAuth appends base URL to the path.
    // Let's check fetchAuth implementation again. 
    // fetchAuth takes a relative URL.

    // Wait, fetchAuth throws on 401. Login might return 401?
    // Usually login returns 200 OK or 400/401.
    // Let's use raw fetch here to be safe and match the original component logic exactly, 
    // or better yet, adapt it to use a helper if possible.
    // The original component used `fetch(\`\${apiBaseUrl}/api/Auth/login-email\`, ...)`.

    try {
        const response = await fetch(`${apiBaseUrl}/api/Auth/login-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            return { error: result.error || result.message || 'Bir hata oluştu' };
        }

        return result;
    } catch (error) {
        return { error: 'Sunucuya bağlanılamadı.' };
    }
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        return Promise.resolve({
            message: 'Kayıt başarılı! Lütfen e-posta adresinize gönderilen doğrulama linkine tıklayın.',
        });
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
        const response = await fetch(`${apiBaseUrl}/api/Auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            return { error: result.error || result.message || 'Kayıt sırasında bir hata oluştu' };
        }

        return result;
    } catch (error) {
        return { error: 'Sunucuya bağlanılamadı.' };
    }
}

export async function forgotPassword(email: string): Promise<AuthResponse> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        return Promise.resolve({
            message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.',
        });
    }

    return fetchAuth('/api/Auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
}

export async function verifyEmail(token: string): Promise<AuthResponse> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        if (token === '123456') {
            return Promise.resolve({
                message: 'E-posta başarıyla doğrulandı.',
            });
        }
        return Promise.resolve({
            error: 'Geçersiz doğrulama kodu.',
        });
    }

    return fetchAuth('/api/Auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
    });
}

export async function updateProfile(data: UpdateProfileRequest): Promise<AuthResponse> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        return Promise.resolve({
            message: 'Profil bilgileri başarıyla güncellendi.',
        });
    }

    return fetchAuth('/api/Auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function changePassword(data: ChangePasswordRequest): Promise<AuthResponse> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        return Promise.resolve({
            message: 'Şifreniz başarıyla değiştirildi.',
        });
    }

    return fetchAuth('/api/Auth/change-password', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function loginWithGoogle(idToken: string): Promise<AuthResponse> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        return Promise.resolve({
            token: 'mock-jwt-token-google-123456789',
            message: 'Google ile giriş başarılı',
        });
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
        const response = await fetch(`${apiBaseUrl}/api/Auth/google-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
        });

        const result = await response.json();

        if (!response.ok) {
            return { error: result.error || result.message || 'Google ile giriş başarısız' };
        }

        return result;
    } catch (error) {
        return { error: 'Sunucuya bağlanılamadı.' };
    }
}


// ==================== TOTP 2FA Functions ====================

export interface TotpSetupResponse {
    secret: string;
    qrCodeImage: string;
}

export async function enableTotp(): Promise<TotpSetupResponse> {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/api/Auth/totp/enable`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Basit token alma, daha iyisi fetchAuth kullanmak ama burada fetchAuth import edilmiş zaten
        }
    });

    // fetchAuth kullanmak daha doğru olurdu, yukarıdaki import fetchAuth'u getiriyor.
    // Ancak enableTotp içinde fetchAuth kullanırsak daha temiz olur.

    // DÜZELTME: fetchAuth kullanarak tekrar yazıyorum
    return fetchAuth('/api/Auth/totp/enable', { method: 'POST' });
}

export async function verifyAndActivateTotp(code: string): Promise<{ message: string }> {
    return fetchAuth('/api/Auth/totp/verify-and-activate', {
        method: 'POST',
        body: JSON.stringify({ code })
    });
}

export async function disableTotp(): Promise<{ message: string }> {
    return fetchAuth('/api/Auth/totp/disable', { method: 'POST' });
}

export async function verifyMfa(email: string, otp: string): Promise<AuthResponse> {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
        const response = await fetch(`${apiBaseUrl}/api/Auth/verify-mfa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        });

        const result = await response.json();

        if (!response.ok) {
            return { error: result.error || result.message || 'Doğrulama başarısız' };
        }

        return result;
    } catch (error) {
        return { error: 'Sunucuya bağlanılamadı.' };
    }
}
