"use client";

import * as React from "react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AuthForgotPassword, AuthResetSuccess } from "@/components/ui/auth-form-1";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Suspense } from "react";

enum View {
    FORGOT_PASSWORD = "forgot-password",
    RESET_SUCCESS = "reset-success",
}

function ForgotPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    const token = searchParams.get("token");

    const [view, setView] = React.useState<View>(View.FORGOT_PASSWORD);
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    // Token varsa şifre sıfırlama formu göster
    if (token) {
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            if (password !== confirmPassword) {
                toast({
                    variant: "destructive",
                    title: "Hata",
                    description: "Şifreler eşleşmiyor",
                });
                return;
            }

            if (password.length < 8) {
                toast({
                    variant: "destructive",
                    title: "Hata",
                    description: "Şifre en az 8 karakter olmalıdır",
                });
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Auth/reset-password`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token, newPassword: password }),
                });

                const result = await response.json();

                if (response.ok) {
                    toast({
                        title: "Başarılı",
                        description: "Şifreniz başarıyla sıfırlandı",
                    });
                    router.push("/login");
                } else {
                    toast({
                        variant: "destructive",
                        title: "Hata",
                        description: result.message || "Şifre sıfırlama başarısız",
                    });
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Hata",
                    description: "Bir hata oluştu",
                });
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="mx-auto w-full max-w-md">
                <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/80 shadow-xl backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                    <div className="relative z-10 p-8">
                        <h1 className="text-2xl font-bold mb-6">Yeni Şifre Oluştur</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="password">Yeni Şifre</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    placeholder="En az 8 karakter"
                                />
                            </div>
                            <div>
                                <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="Şifrenizi tekrar girin"
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Sıfırlanıyor..." : "Şifreyi Sıfırla"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // Token yoksa normal forgot password akışı
    return (
        <div
            data-slot="auth"
            className={cn("mx-auto w-full max-w-md")}
        >
            <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/80 shadow-xl backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                <div className="relative z-10">
                    <AnimatePresence mode="wait">
                        {view === View.FORGOT_PASSWORD && (
                            <AuthForgotPassword
                                key="forgot-password"
                                onSignIn={() => window.location.href = '/login'}
                                onSuccess={() => setView(View.RESET_SUCCESS)}
                            />
                        )}
                        {view === View.RESET_SUCCESS && (
                            <AuthResetSuccess
                                key="reset-success"
                                onSignIn={() => window.location.href = '/login'}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default function ForgotPasswordPage() {
    return (
        <div className="w-full flex justify-center items-center min-h-screen p-4">
            <Suspense fallback={<div>Yükleniyor...</div>}>
                <ForgotPasswordContent />
            </Suspense>
        </div>
    );
}
