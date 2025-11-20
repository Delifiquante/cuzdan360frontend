"use client";

import * as React from "react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AuthEmailConfirmation } from "@/components/ui/auth-form-1";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/lib/services/authService";
import { useToast } from "@/hooks/use-toast";
import { Suspense } from "react";

function EmailConfirmationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    const code = searchParams.get('code');

    React.useEffect(() => {
        if (code) {
            const verify = async () => {
                try {
                    const res = await verifyEmail(code);
                    if (!res.error) {
                        toast({
                            title: "Başarılı",
                            description: res.message || "E-posta başarıyla doğrulandı.",
                        });
                        router.push('/login');
                    } else {
                        toast({
                            variant: "destructive",
                            title: "Hata",
                            description: res.error || "Doğrulama başarısız.",
                        });
                    }
                } catch (e) {
                    toast({
                        variant: "destructive",
                        title: "Hata",
                        description: "Bir hata oluştu.",
                    });
                }
            };
            verify();
        }
    }, [code, router, toast]);

    return (
        <div
            data-slot="auth"
            className={cn("mx-auto w-full max-w-md")}
        >
            <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/80 shadow-xl backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                <div className="relative z-10">
                    <AnimatePresence mode="wait">
                        <AuthEmailConfirmation
                            key="email-confirmation"
                            onSignIn={() => window.location.href = '/login'}
                        />
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default function EmailConfirmationPage() {
    return (
        <div className="w-full flex justify-center items-center min-h-screen p-4">
            <Suspense fallback={<div>Yükleniyor...</div>}>
                <EmailConfirmationContent />
            </Suspense>
        </div>
    );
}
