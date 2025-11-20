"use client";

import * as React from "react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AuthForgotPassword, AuthResetSuccess } from "@/components/ui/auth-form-1";

enum View {
    FORGOT_PASSWORD = "forgot-password",
    RESET_SUCCESS = "reset-success",
}

export default function ForgotPasswordPage() {
    const [view, setView] = React.useState<View>(View.FORGOT_PASSWORD);

    return (
        <div className="w-full flex justify-center items-center min-h-screen p-4">
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
        </div>
    );
}
