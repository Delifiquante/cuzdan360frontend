"use client";

import * as React from "react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AuthEmailConfirmation } from "@/components/ui/auth-form-1";

export default function EmailConfirmationPage() {
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
                            <AuthEmailConfirmation
                                key="email-confirmation"
                                onSignIn={() => window.location.href = '/login'}
                            />
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
