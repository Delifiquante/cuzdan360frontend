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

export async function forgotPassword(email: string): Promise<void> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        return Promise.resolve();
    }

    // Implement real forgot password if needed, or leave as TODO since it wasn't fully implemented in the UI either (simulated).
    // The UI had: await new Promise((resolve) => setTimeout(resolve, 1500));
    // So we just keep it mock-like or implement if we knew the endpoint.
    // Assuming no endpoint known yet, we'll just simulate it for now to match UI behavior.
    await delay(1500);
}

export async function verifyEmail(code: string): Promise<AuthResponse> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        if (code === '123456') {
            return Promise.resolve({
                message: 'E-posta başarıyla doğrulandı.',
            });
        }
        return Promise.resolve({
            error: 'Geçersiz doğrulama kodu.',
        });
    }

    // Implement real verification logic here
    await delay(1500);
    return Promise.resolve({ error: 'Sunucu yapılandırılmadı.' });
}
