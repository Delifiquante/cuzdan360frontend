"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/lib/services/authService";
import { useToast } from "@/hooks/use-toast";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { motion } from "framer-motion";

function EmailConfirmationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    const token = searchParams.get('token');

    const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = React.useState('');

    React.useEffect(() => {
        if (token) {
            console.log('Email verification token:', token);
            const verify = async () => {
                try {
                    console.log('Sending verification request to backend...');
                    const res = await verifyEmail(token);
                    console.log('Verification response:', res);
                    if (!res.error) {
                        setStatus('success');
                        setTimeout(() => {
                            router.push('/login');
                        }, 2000);
                    } else {
                        setStatus('error');
                        setErrorMessage(res.error || 'Doğrulama başarısız');
                    }
                } catch (e) {
                    console.error('Verification error:', e);
                    setStatus('error');
                    setErrorMessage('Bir hata oluştu');
                }
            };
            verify();
        } else {
            console.error('No token found in URL');
            setStatus('error');
            setErrorMessage('Doğrulama token\'ı bulunamadı');
        }
    }, [token, router]);

    return (
        <div className="w-full flex justify-center items-center min-h-screen p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="mx-auto w-full max-w-md"
            >
                <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/80 shadow-xl backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                    <div className="relative z-10 p-8">
                        {status === 'loading' && (
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="relative">
                                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold mb-2">E-posta Doğrulanıyor</h1>
                                    <p className="text-muted-foreground">
                                        Lütfen bekleyin, e-posta adresiniz doğrulanıyor...
                                    </p>
                                </div>
                            </div>
                        )}

                        {status === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center text-center space-y-6"
                            >
                                <div className="relative">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                        className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center"
                                    >
                                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                                    </motion.div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold mb-2">E-posta Doğrulandı!</h1>
                                    <p className="text-muted-foreground mb-4">
                                        E-posta adresiniz başarıyla doğrulandı. Giriş sayfasına yönlendiriliyorsunuz...
                                    </p>
                                    <Button
                                        onClick={() => router.push('/login')}
                                        className="w-full"
                                    >
                                        Giriş Yap
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {status === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center text-center space-y-6"
                            >
                                <div className="relative">
                                    <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
                                        <XCircle className="h-10 w-10 text-destructive" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold mb-2">Doğrulama Başarısız</h1>
                                    <p className="text-muted-foreground mb-4">
                                        {errorMessage}
                                    </p>
                                    <div className="space-y-2">
                                        <Button
                                            onClick={() => router.push('/signup')}
                                            className="w-full"
                                        >
                                            Tekrar Kaydol
                                        </Button>
                                        <Button
                                            onClick={() => router.push('/login')}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Giriş Yap
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function EmailConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="w-full flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <EmailConfirmationContent />
        </Suspense>
    );
}
