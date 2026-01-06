// Dosya Yolu: src/components/hero-section.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Silk from "@/components/Silk";
import BlurText from "@/components/ui/blur-text";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Varsayılan (server-side) veya dark mode rengi: #528435
    // Light mode rengi: Limoni yeşil (#84cc16 - Lime 500)
    const silkColor = mounted && theme === 'light' ? '#84cc16' : '#528435';
    // Overlay: Light modda daha şeffaf/aydınlık, Dark modda karartılmış
    const overlayClass = mounted && theme === 'light' ? 'bg-white/10' : 'bg-black/50';

    return (
        <section
            id="home"
            className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background theme-transition"
        >
            {/* 1. Arka Plan: Silk Bileşeni */}
            <div className="absolute inset-0 z-0">
                <Silk
                    speed={5}
                    scale={1}
                    color={silkColor}
                    noiseIntensity={1.5}
                    rotation={0}
                />
                {/* Silk üzerine katman */}
                <div className={cn("absolute inset-0 z-1 transition-colors duration-500", overlayClass)}></div>
            </div>

            {/* 2. Ön Plan: Preditech'ten ilham alan içerik */}
            <div className="relative z-10 mt-20 grid w-full max-w-7xl grid-cols-1 items-start gap-8 px-4 sm:px-8 md:mt-40 md:grid-cols-2 md:items-center md:gap-4 md:px-20">
                {/* Sol Taraf: Başlıklar */}
                <div className="flex flex-col justify-center">
                    <BlurText
                        text="Finansal Geleceğinizi"
                        delay={150}
                        animateBy="words"
                        direction="top"
                        className="relative max-w-5xl text-left text-4xl font-bold text-white sm:text-5xl lg:text-7xl"
                    />
                    <BlurText
                        text="Kontrol Altına Alın."
                        delay={150}
                        animateBy="words"
                        direction="top"
                        className="relative max-w-4xl text-left text-4xl font-bold text-brand sm:text-5xl lg:text-7xl [-webkit-text-stroke:1px_black]"
                    />
                </div>

                {/* Sağ Taraf: Açıklama ve Butonlar */}
                <div className="flex flex-col items-start justify-center space-y-4">
                    <p className="relative text-left text-lg text-neutral-100 dark:text-neutral-300 sm:text-xl md:text-2xl font-medium">
                        Cüzdan360, tüm varlıklarınızı, borçlarınızı ve harcamalarınızı tek
                        bir yerde birleştirir.
                    </p>
                    <p className="relative max-w-xl text-left text-lg text-neutral-100 dark:text-neutral-300 sm:text-xl md:text-2xl font-medium">
                        Yapay zeka destekli analizlerle finansal hedeflerinize ulaşın.
                    </p>
                    <div className="flex flex-col items-start space-y-4 pt-4 md:flex-row md:space-y-0 md:space-x-4">
                        <HoverBorderGradient
                            containerClassName="rounded-full"
                            as="button"
                            className="dark:bg-white bg-white text-black dark:text-black flex items-center space-x-2 px-6 py-3" // Butonu daha görünür yap
                            onClick={() => (window.location.href = "/login")}
                        >
                            <span>Giriş Yap</span>
                        </HoverBorderGradient>
                        <HoverBorderGradient
                            containerClassName="rounded-full"
                            as="button"
                            className="dark:bg-black bg-black text-white dark:text-white flex items-center space-x-2 px-6 py-3"
                            onClick={() => (window.location.hash = "#features")}
                        >
                            <span>Daha Fazla Bilgi</span>
                        </HoverBorderGradient>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce cursor-pointer opacity-80 hover:opacity-100 transition-opacity" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                <ChevronDown className="h-10 w-10 text-neutral-900 dark:text-white" />
            </div>
        </section>
    );
}