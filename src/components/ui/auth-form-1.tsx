"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { login as loginService, register as registerService, forgotPassword as forgotPasswordService, verifyEmail as verifyEmailService, loginWithGoogle, verifyMfa } from "@/lib/services/authService";

// --------------------------------
// Types and Enums
// --------------------------------

enum AuthView {
    SIGN_IN = "sign-in",
    SIGN_UP = "sign-up",
    FORGOT_PASSWORD = "forgot-password",
    RESET_SUCCESS = "reset-success",
    EMAIL_CONFIRMATION = "email-confirmation",
    OTP_VERIFICATION = "otp-verification",
}

interface AuthState {
    view: AuthView;
}

interface FormState {
    isLoading: boolean;
    error: string | null;
    showPassword: boolean;
}

// --------------------------------
// Schemas
// --------------------------------

const signInSchema = z.object({
    email: z.string().email("Geçersiz e-posta adresi"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
});

const signUpSchema = z.object({
    name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
    email: z.string().email("Geçersiz e-posta adresi"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
    terms: z.boolean().refine((val) => val === true, { message: "Şartları kabul etmelisiniz" }),
});

const forgotPasswordSchema = z.object({
    email: z.string().email("Geçersiz e-posta adresi"),
});

const emailConfirmationSchema = z.object({
    code: z.string().min(6, "Doğrulama kodu en az 6 karakter olmalıdır"),
});

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type EmailConfirmationFormValues = z.infer<typeof emailConfirmationSchema>;

// --------------------------------
// Main Auth Component
// --------------------------------

function Auth({ className, ...props }: React.ComponentProps<"div">) {
    const [state, setState] = React.useState<AuthState>({ view: AuthView.SIGN_IN });
    const [email, setEmail] = React.useState<string>("");

    const setView = React.useCallback((view: AuthView) => {
        setState((prev) => ({ ...prev, view }));
    }, []);

    const handleOtpRequired = (email: string) => {
        setEmail(email);
        setView(AuthView.OTP_VERIFICATION);
    };

    return (
        <div
            data-slot="auth"
            className={cn("mx-auto w-full max-w-md", className)}
            {...props}
        >
            <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/80 shadow-xl backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                <div className="relative z-10">
                    <AnimatePresence mode="wait">
                        {state.view === AuthView.SIGN_IN && (
                            <AuthSignIn
                                key="sign-in"
                                onForgotPassword={() => setView(AuthView.FORGOT_PASSWORD)}
                                onSignUp={() => setView(AuthView.SIGN_UP)}
                                onOtpRequired={handleOtpRequired}
                            />
                        )}
                        {state.view === AuthView.SIGN_UP && (
                            <AuthSignUp
                                key="sign-up"
                                onSignIn={() => setView(AuthView.SIGN_IN)}
                            />
                        )}
                        {state.view === AuthView.FORGOT_PASSWORD && (
                            <AuthForgotPassword
                                key="forgot-password"
                                onSignIn={() => setView(AuthView.SIGN_IN)}
                                onSuccess={() => setView(AuthView.RESET_SUCCESS)}
                            />
                        )}
                        {state.view === AuthView.RESET_SUCCESS && (
                            <AuthResetSuccess
                                key="reset-success"
                                onSignIn={() => setView(AuthView.SIGN_IN)}
                            />
                        )}
                        {state.view === AuthView.EMAIL_CONFIRMATION && (
                            <AuthEmailConfirmation
                                key="email-confirmation"
                                onSignIn={() => setView(AuthView.SIGN_IN)}
                            />
                        )}
                        {state.view === AuthView.OTP_VERIFICATION && (
                            <AuthOtpVerification
                                key="otp-verification"
                                email={email}
                                onSignIn={() => setView(AuthView.SIGN_IN)}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// --------------------------------
// Shared Components
// --------------------------------

interface AuthFormProps {
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    children: React.ReactNode;
    className?: string;
}

function AuthForm({ onSubmit, children, className }: AuthFormProps) {
    return (
        <form
            onSubmit={onSubmit}
            data-slot="auth-form"
            className={cn("space-y-6", className)}
        >
            {children}
        </form>
    );
}

interface AuthErrorProps {
    message: string | null;
}

function AuthError({ message }: AuthErrorProps) {
    if (!message) return null;
    return (
        <div
            data-slot="auth-error"
            className="mb-6 animate-in rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
        >
            {message}
        </div>
    );
}

interface AuthSocialButtonsProps {
    isLoading: boolean;
}

function AuthSocialButtons({ isLoading }: AuthSocialButtonsProps) {
    const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

    const handleGoogleSuccess = async (credentialResponse: any) => {
        console.log('Google credential response:', credentialResponse);
        setIsGoogleLoading(true);
        try {
            // credentialResponse.credential ID token'ı içerir
            const result = await loginWithGoogle(credentialResponse.credential);

            if (result.error) {
                alert(result.error);
            } else if (result.token) {
                localStorage.setItem('authToken', result.token);
                if (result.refreshToken) localStorage.setItem('refreshToken', result.refreshToken); // 👈
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.error('Google login error:', error);
            alert('Google ile giriş başarısız');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleGoogleError = () => {
        console.log('Google login failed or cancelled');
        alert('Google ile giriş iptal edildi');
    };

    React.useEffect(() => {
        // Google Identity Services script'ini yükle
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleGoogleClick = () => {
        if (typeof window !== 'undefined' && (window as any).google) {
            (window as any).google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                callback: handleGoogleSuccess,
            });
            (window as any).google.accounts.id.prompt();
        } else {
            console.error('Google Identity Services not loaded');
            alert('Google servisi yüklenemedi. Lütfen sayfayı yenileyin.');
        }
    };

    return (
        <div data-slot="auth-social-buttons" className="w-full mt-6">
            <Button
                variant="outline"
                className="w-full h-12 bg-background/50 border-border/50"
                disabled={isLoading || isGoogleLoading}
                onClick={handleGoogleClick}
            >
                {isGoogleLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Google ile giriş yapılıyor...
                    </>
                ) : (
                    <>
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                            <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        Google
                    </>
                )}
            </Button>
        </div>
    );
}

interface AuthSeparatorProps {
    text?: string;
}

function AuthSeparator({ text = "Veya şununla devam edin:" }: AuthSeparatorProps) {
    return (
        <div data-slot="auth-separator" className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
                <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">{text}</span>
            </div>
        </div>
    );
}

// --------------------------------
// Sign In Component
// --------------------------------

interface AuthSignInProps {
    onForgotPassword: () => void;
    onSignUp: () => void;
    onOtpRequired: (email: string) => void;
}

function AuthSignIn({ onForgotPassword, onSignUp, onOtpRequired }: AuthSignInProps) {
    const [formState, setFormState] = React.useState<FormState>({
        isLoading: false,
        error: null,
        showPassword: false,
    });

    const { register, handleSubmit, formState: { errors } } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: { email: "", password: "" },
    });


    const onSubmit = async (data: SignInFormValues) => {
        setFormState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            const result = await loginService({
                email: data.email,
                password: data.password,
            });

            if (result.error) {
                setFormState((prev) => ({ ...prev, error: result.error || "Bilinmeyen bir hata oluştu" }));
            } else {
                // Başarılı giriş
                console.log("Giriş başarılı:", result);

                // Email doğrulanmamışsa verify-email-pending sayfasına yönlendir
                if (result.isEmailVerified === false) {
                    localStorage.setItem("pendingVerificationEmail", result.email || data.email);
                    const expiryTime = new Date(Date.now() + 3 * 60 * 1000); // 3 dakika
                    localStorage.setItem("verificationTokenExpiry", expiryTime.toISOString());
                    window.location.href = '/verify-email-pending';
                    return;
                }

                if (result.token) {
                    // Token'ı localStorage'a kaydet ve kullanıcıyı dashboard'a yönlendir
                    localStorage.setItem('authToken', result.token);
                    if (result.refreshToken) localStorage.setItem('refreshToken', result.refreshToken); // 👈
                    window.location.href = '/dashboard'; // Dashboard'a yönlendir
                } else if (result.requiresOtp) {
                    // OTP gerekiyorsa OTP ekranına yönlendir
                    onOtpRequired(data.email);
                }
            }
        } catch (err) {
            setFormState((prev) => ({ ...prev, error: "Sunucuya bağlanılamadı. Lütfen tekrar deneyin." }));
        } finally {
            setFormState((prev) => ({ ...prev, isLoading: false }));
        }
    };

    return (
        <motion.div
            data-slot="auth-sign-in"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-8"
        >
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-semibold text-foreground">Tekrar hoş geldiniz</h1>
                <p className="mt-2 text-sm text-muted-foreground">Hesabınıza giriş yapın</p>
            </div>

            <AuthError message={formState.error} />

            <AuthForm onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="isim@example.com"
                        autoComplete="email"
                        disabled={formState.isLoading}
                        className={cn(errors.email && "border-destructive")}
                        {...register("email")}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Şifre</Label>
                        <Button
                            type="button"
                            variant="link"
                            className="h-auto p-0 text-xs"
                            onClick={onForgotPassword}
                            disabled={formState.isLoading}
                        >
                            Şifrenizi mi unuttunuz?
                        </Button>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            type={formState.showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            disabled={formState.isLoading}
                            className={cn(errors.password && "border-destructive")}
                            {...register("password")}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full"
                            onClick={() =>
                                setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }))
                            }
                            disabled={formState.isLoading}
                        >
                            {formState.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={formState.isLoading}>
                    {formState.isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Giriş yapılıyor...
                        </>
                    ) : (
                        "Giriş yap"
                    )}
                </Button>
            </AuthForm>

            <AuthSeparator />
            <AuthSocialButtons isLoading={formState.isLoading} />

            <p className="mt-8 text-center text-sm text-muted-foreground">
                Hesabınız yok mu?{" "}
                <Button
                    variant="link"
                    className="h-auto p-0 text-sm"
                    onClick={onSignUp}
                    disabled={formState.isLoading}
                >
                    Kayıt ol
                </Button>
            </p>
        </motion.div>
    );
}

// --------------------------------
// Sign Up Component
// --------------------------------

interface AuthSignUpProps {
    onSignIn: () => void;
}

function AuthSignUp({ onSignIn }: AuthSignUpProps) {
    const [formState, setFormState] = React.useState<FormState>({
        isLoading: false,
        error: null,
        showPassword: false,
    });

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { name: "", email: "", password: "", terms: false },
    });

    const terms = watch("terms");

    const onSubmit = async (data: SignUpFormValues) => {
        setFormState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            const result = await registerService({
                username: data.name,
                email: data.email,
                password: data.password,
            });

            if (result.error) {
                setFormState((prev) => ({ ...prev, error: result.error || "Kayıt sırasında bir hata oluştu" }));
            } else {
                // Başarılı kayıt - localStorage'a email ve expiry time kaydet
                localStorage.setItem("pendingVerificationEmail", data.email);
                const expiryTime = new Date(Date.now() + 3 * 60 * 1000); // 3 dakika
                localStorage.setItem("verificationTokenExpiry", expiryTime.toISOString());

                // verify-email-pending sayfasına yönlendir
                window.location.href = '/verify-email-pending';
            }
        } catch (err) {
            setFormState((prev) => ({ ...prev, error: "Sunucuya bağlanılamadı. Lütfen tekrar deneyin." }));
        } finally {
            setFormState((prev) => ({ ...prev, isLoading: false }));
        }
    };
    return (
        <motion.div
            data-slot="auth-sign-up"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-8"
        >
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-semibold text-foreground">Kayıt Ol</h1>
                <p className="mt-2 text-sm text-muted-foreground">Yeni bir hesap oluşturun</p>
            </div>

            <AuthError message={formState.error} />

            <AuthForm onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                    <Label htmlFor="name">İsim</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        autoComplete="name"
                        disabled={formState.isLoading}
                        className={cn(errors.name && "border-destructive")}
                        {...register("name")}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="isim@example.com"
                        autoComplete="email"
                        disabled={formState.isLoading}
                        className={cn(errors.email && "border-destructive")}
                        {...register("email")}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Şifre</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={formState.showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            disabled={formState.isLoading}
                            className={cn(errors.password && "border-destructive")}
                            {...register("password")}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full"
                            onClick={() =>
                                setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }))
                            }
                            disabled={formState.isLoading}
                        >
                            {formState.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="terms"
                        checked={terms}
                        onCheckedChange={(checked) => setValue("terms", checked === true)}
                        disabled={formState.isLoading}
                    />
                    <div className="space-y-1">
                        <Label htmlFor="terms" className="text-sm">
                            Şartları kabul ediyorum
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Kaydolarak,{" "}
                            <Button variant="link" className="h-auto p-0 text-xs">
                                Şartlarımızı
                            </Button>{" "}
                            ve{" "}
                            <Button variant="link" className="h-auto p-0 text-xs">
                                Gizlilik Politikamızı
                            </Button>
                            kabul etmiş olursunuz.
                        </p>
                    </div>
                </div>
                {errors.terms && <p className="text-xs text-destructive">{errors.terms.message}</p>}

                <Button type="submit" className="w-full" disabled={formState.isLoading}>
                    {formState.isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Kayıt olunuyor...
                        </>
                    ) : (
                        "Kayıt ol"
                    )}
                </Button>
            </AuthForm>

            <AuthSeparator />
            <AuthSocialButtons isLoading={formState.isLoading} />

            <p className="mt-8 text-center text-sm text-muted-foreground">
                Zaten bir hesabınız var mı?{" "}
                <Button
                    variant="link"
                    className="h-auto p-0 text-sm"
                    onClick={onSignIn}
                    disabled={formState.isLoading}
                >
                    Giriş yap
                </Button>
            </p>
        </motion.div>
    );
}

// --------------------------------
// Forgot Password Component
// --------------------------------

interface AuthForgotPasswordProps {
    onSignIn: () => void;
    onSuccess: () => void;
}

function AuthForgotPassword({ onSignIn, onSuccess }: AuthForgotPasswordProps) {
    const [formState, setFormState] = React.useState<FormState>({
        isLoading: false,
        error: null,
        showPassword: false,
    });

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setFormState((prev) => ({ ...prev, isLoading: true, error: null }));
        try {
            const result = await forgotPasswordService(data.email);
            if (result.error) {
                setFormState((prev) => ({ ...prev, error: result.error || "Beklenmeyen bir hata oluştu" }));
            } else {
                onSuccess();
            }
        } catch {
            setFormState((prev) => ({ ...prev, error: "Beklenmeyen bir hata oluştu" }));
        } finally {
            setFormState((prev) => ({ ...prev, isLoading: false }));
        }
    };

    return (
        <motion.div
            data-slot="auth-forgot-password"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-8"
        >
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-4"
                onClick={onSignIn}
                disabled={formState.isLoading}
            >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Geri</span>
            </Button>

            <div className="mb-8 text-center">
                <h1 className="text-3xl font-semibold text-foreground">Şifreyi sıfırla</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Sıfırlama bağlantısı almak için e-postanızı girin
                </p>
            </div>

            <AuthError message={formState.error} />

            <AuthForm onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="isim@example.com"
                        autoComplete="email"
                        disabled={formState.isLoading}
                        className={cn(errors.email && "border-destructive")}
                        {...register("email")}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={formState.isLoading}>
                    {formState.isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Gönderiliyor...
                        </>
                    ) : (
                        "Sıfırlama bağlantısı gönder"
                    )}
                </Button>
            </AuthForm>

            <p className="mt-8 text-center text-sm text-muted-foreground">
                Şifrenizi hatırlıyor musunuz?{" "}
                <Button
                    variant="link"
                    className="h-auto p-0 text-sm"
                    onClick={onSignIn}
                    disabled={formState.isLoading}
                >
                    Giriş yap
                </Button>
            </p>
        </motion.div>
    );
}

// --------------------------------
// Reset Success Component
// --------------------------------

interface AuthResetSuccessProps {
    onSignIn: () => void;
}

function AuthResetSuccess({ onSignIn }: AuthResetSuccessProps) {
    return (
        <motion.div
            data-slot="auth-reset-success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col items-center p-8 text-center"
        >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <MailCheck className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-2xl font-semibold text-foreground">E-postanızı kontrol edin</h1>
            <p className="mt-2 text-sm text-muted-foreground">
                E-postanıza bir şifre sıfırlama bağlantısı gönderdik.
            </p>

            <Button
                variant="outline"
                className="mt-6 w-full max-w-xs"
                onClick={onSignIn}
            >
                Giriş yapmaya geri dön
            </Button>

            <p className="mt-6 text-xs text-muted-foreground">
                E-posta almadınız mı? Spam'ı kontrol edin veya{" "}
                <Button variant="link" className="h-auto p-0 text-xs">
                    başka bir e-posta deneyin
                </Button>
            </p>
        </motion.div>
    );
}

// --------------------------------
// Email Confirmation Component
// --------------------------------
interface AuthEmailConfirmationProps {
    onSignIn: () => void;
}

function AuthEmailConfirmation({ onSignIn }: AuthEmailConfirmationProps) {
    const [isVerified, setIsVerified] = React.useState(false);
    const [formState, setFormState] = React.useState<FormState>({
        isLoading: false,
        error: null,
        showPassword: false,
    });

    const { register, handleSubmit, formState: { errors } } = useForm<EmailConfirmationFormValues>({
        resolver: zodResolver(emailConfirmationSchema),
        defaultValues: { code: "" },
    });

    const onSubmit = async (data: EmailConfirmationFormValues) => {
        setFormState((prev) => ({ ...prev, isLoading: true, error: null }));
        try {
            const result = await verifyEmailService(data.code);
            if (result.error) {
                setFormState((prev) => ({ ...prev, error: result.error || "Doğrulama başarısız" }));
            } else {
                setIsVerified(true);
            }
        } catch (err) {
            setFormState((prev) => ({ ...prev, error: "Sunucuya bağlanılamadı." }));
        } finally {
            setFormState((prev) => ({ ...prev, isLoading: false }));
        }
    };

    if (isVerified) {
        return (
            <motion.div
                data-slot="auth-email-confirmation-success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col items-center p-8 text-center"
            >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <MailCheck className="h-8 w-8 text-primary" />
                </div>

                <h1 className="text-2xl font-semibold text-foreground">E-posta Doğrulandı</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    E-posta adresiniz başarıyla doğrulandı. Artık hesabınıza giriş yapabilirsiniz.
                </p>

                <Button
                    className="mt-6 w-full"
                    onClick={onSignIn}
                >
                    Giriş Yap
                </Button>
            </motion.div>
        );
    }

    return (
        <motion.div
            data-slot="auth-email-confirmation-input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-8"
        >
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-semibold text-foreground">E-postanızı Doğrulayın</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Lütfen e-postanıza gönderilen 6 haneli doğrulama kodunu girin.
                </p>
            </div>

            <AuthError message={formState.error} />

            <AuthForm onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                    <Label htmlFor="code">Doğrulama Kodu</Label>
                    <Input
                        id="code"
                        type="text"
                        placeholder="123456"
                        autoComplete="one-time-code"
                        disabled={formState.isLoading}
                        className={cn(errors.code && "border-destructive", "text-center text-lg tracking-widest")}
                        maxLength={6}
                        {...register("code")}
                    />
                    {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={formState.isLoading}>
                    {formState.isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Doğrulanıyor...
                        </>
                    ) : (
                        "Doğrula"
                    )}
                </Button>
            </AuthForm>

            <p className="mt-8 text-center text-sm text-muted-foreground">
                Kod gelmedi mi?{" "}
                <Button
                    variant="link"
                    className="h-auto p-0 text-sm"
                    onClick={() => alert("Kod tekrar gönderildi!")}
                    disabled={formState.isLoading}
                >
                    Tekrar Gönder
                </Button>
            </p>
        </motion.div>
    );
}

// --------------------------------
// OTP Verification Component
// --------------------------------

interface AuthOtpVerificationProps {
    email: string;
    onSignIn: () => void;
}

function AuthOtpVerification({ email, onSignIn }: AuthOtpVerificationProps) {
    const [formState, setFormState] = React.useState<FormState>({
        isLoading: false,
        error: null,
        showPassword: false,
    });

    const { register, handleSubmit, formState: { errors } } = useForm<EmailConfirmationFormValues>({
        resolver: zodResolver(emailConfirmationSchema),
        defaultValues: { code: "" },
    });

    const onSubmit = async (data: EmailConfirmationFormValues) => {
        setFormState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            const result = await verifyMfa(email, data.code);

            if (result.error) {
                setFormState((prev) => ({ ...prev, error: result.error || "Doğrulama başarısız" }));
            } else if (result.token) {
                localStorage.setItem('authToken', result.token);
                if (result.refreshToken) localStorage.setItem('refreshToken', result.refreshToken); // 👈
                window.location.href = '/dashboard';
            }
        } catch (err) {
            setFormState((prev) => ({ ...prev, error: "Sunucuya bağlanılamadı." }));
        } finally {
            setFormState((prev) => ({ ...prev, isLoading: false }));
        }
    };

    return (
        <motion.div
            data-slot="auth-otp-verification"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-8"
        >
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Loader2 className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-semibold text-foreground">2FA Doğrulama</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Authenticator uygulamanızdaki 6 haneli kodu girin.
                </p>
            </div>

            <AuthError message={formState.error} />

            <AuthForm onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                    <Label htmlFor="code">Doğrulama Kodu</Label>
                    <Input
                        id="code"
                        placeholder="000000"
                        className={cn("text-center text-2xl tracking-widest font-mono", errors.code && "border-destructive")}
                        maxLength={6}
                        disabled={formState.isLoading}
                        {...register("code")}
                        onChange={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
                            register("code").onChange(e);
                        }}
                    />
                    {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={formState.isLoading}>
                    {formState.isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Doğrulanıyor...
                        </>
                    ) : (
                        "Doğrula"
                    )}
                </Button>
            </AuthForm>

            <p className="mt-8 text-center text-sm text-muted-foreground">
                <Button
                    variant="link"
                    className="h-auto p-0 text-sm"
                    onClick={onSignIn}
                    disabled={formState.isLoading}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Giriş ekranına dön
                </Button>
            </p>
        </motion.div>
    );
}

// --------------------------------
// Exports
// --------------------------------

export {
    Auth,
    AuthSignIn,
    AuthSignUp,
    AuthForgotPassword,
    AuthResetSuccess,
    AuthEmailConfirmation,
    AuthOtpVerification,
    AuthForm,
    AuthError,
    AuthSocialButtons,
    AuthSeparator,
};