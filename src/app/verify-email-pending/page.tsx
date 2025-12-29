"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail, Clock, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmailPendingPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [timeLeft, setTimeLeft] = useState(3 * 60); // 3 dakika (saniye)
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        // LocalStorage'dan email ve expiry time al
        const storedEmail = localStorage.getItem("pendingVerificationEmail");
        const expiryTime = localStorage.getItem("verificationTokenExpiry");

        if (!storedEmail) {
            router.push("/signup");
            return;
        }

        setEmail(storedEmail);

        if (expiryTime) {
            const expiry = new Date(expiryTime).getTime();
            const now = Date.now();
            const diff = Math.floor((expiry - now) / 1000);
            setTimeLeft(diff > 0 ? diff : 0);
        }
    }, [router]);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleResendEmail = async () => {
        setIsResending(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Auth/resend-verification-email`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            if (response.ok) {
                // Yeni expiry time kaydet
                const newExpiry = new Date(Date.now() + 3 * 60 * 1000);
                localStorage.setItem("verificationTokenExpiry", newExpiry.toISOString());
                setTimeLeft(3 * 60);

                toast({
                    title: "Başarılı",
                    description: "Doğrulama email'i tekrar gönderildi",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Hata",
                    description: "Email gönderilemedi",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Hata",
                description: "Bir hata oluştu",
            });
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="w-full flex justify-center items-center min-h-screen p-4">
            <div className="mx-auto w-full max-w-md">
                <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/80 shadow-xl backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                    <div className="relative z-10 p-8">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                                <Mail className="h-10 w-10 text-primary" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold mb-2">Email Doğrulama Bekleniyor</h1>
                                <p className="text-muted-foreground mb-4">
                                    <strong>{email}</strong> adresine bir doğrulama email'i gönderdik.
                                    Lütfen gelen kutunuzu kontrol edin.
                                </p>
                            </div>

                            {timeLeft > 0 ? (
                                <div className="w-full p-4 rounded-lg bg-muted/50 border border-border">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            Link geçerlilik süresi
                                        </span>
                                    </div>
                                    <div className="text-3xl font-mono font-bold text-center">
                                        {formatTime(timeLeft)}
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full p-4 rounded-lg bg-destructive/10 border border-destructive">
                                    <p className="text-sm text-destructive text-center">
                                        Doğrulama linki süresi doldu. Lütfen yeni bir link isteyin.
                                    </p>
                                </div>
                            )}

                            <div className="w-full space-y-2">
                                <Button
                                    onClick={handleResendEmail}
                                    disabled={isResending}
                                    variant="outline"
                                    className="w-full"
                                >
                                    {isResending ? (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                            Gönderiliyor...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Email'i Tekrar Gönder
                                        </>
                                    )}
                                </Button>

                                <Button
                                    onClick={() => router.push("/login")}
                                    variant="ghost"
                                    className="w-full"
                                >
                                    Giriş Sayfasına Dön
                                </Button>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Email gelmedi mi? Spam klasörünü kontrol edin.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
