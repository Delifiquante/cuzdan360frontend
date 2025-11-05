// Dosya Yolu: src/components/ui/pricing-cards.tsx
"use client";

import React from "react";
import { ArrowRight, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription, // CardDescription'ı import ediyoruz
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { BackgroundGradient } from "./background-gradient"; // Vurgu için
import { HoverBorderGradient } from "./hover-border-gradient"; // Butonlar için

// Özellik listesi için tip tanımı
interface PricingFeature {
    text: string;
}

// Planların yapısını tanımlayan tip
interface PricingPlan {
    id: string;
    name: string;
    description: string;
    monthlyPrice: string;
    features: PricingFeature[];
    button: {
        text: string;
        url: string; // url yerine href kullanalım veya onClick için bir fonksiyon
        variant: "default" | "gradient";
    };
}

// Cüzdan360 için özel olarak güncellenmiş planlar
const Cüzdan360Plans: PricingPlan[] = [
    {
        id: "temel",
        name: "Temel",
        description: "Finansal takibinize ücretsiz başlayın.",
        monthlyPrice: "0₺",
        features: [
            { text: "Genel Bakış Dashboard'u" },
            { text: "Sınırsız İşlem Takibi" },
            { text: "Borç Yönetimi" },
            { text: "Standart Raporlar" },
            { text: "E-posta Desteği" },
        ],
        button: {
            text: "Ücretsiz Başlayın",
            url: "/login", // Kayıt/Login sayfasına yönlendir
            variant: "gradient",
        },
    },
    {
        id: "pro",
        name: "Pro",
        description: "Yatırımlar ve yapay zeka ile tam kontrol.",
        monthlyPrice: "149.99₺",
        features: [
            { text: "Tüm Temel özellikler" },
            { text: "Yatırım Portföy Takibi" },
            { text: "Detaylı Finansal Raporlar" },
            { text: "Varlık Dağılımı Grafiği" },
            { text: "AI Destekli Döviz Analizi" },
            { text: "Öncelikli Destek" },
        ],
        button: {
            text: "Pro'ya Geçin",
            url: "/login",
            variant: "default", // Vurgulu buton
        },
    },
    {
        id: "kurumsal",
        name: "Kurumsal",
        description: "İşletmeler ve özel ihtiyaçlar için.",
        monthlyPrice: "Özel",
        features: [
            { text: "Tüm Pro özellikleri" },
            { text: "Çoklu Kullanıcı Desteği" },
            { text: "Özel Entegrasyonlar" },
            { text: "API Erişimi" },
            { text: "Özel Hesap Yöneticisi" },
        ],
        button: {
            text: "İletişime Geçin",
            url: "#contact", // İletişim bölümüne yönlendir
            variant: "gradient",
        },
    },
];

// Bileşenin adını Pricing2 olarak tutuyoruz ki projenin diğer yerlerinde uyumlu kalsın
export function Pricing2() {
    // Orijinal dosyadaki particle canvas'ı kaldırıp daha temiz,
    // bg-background ile uyumlu bir bölüm oluşturuyoruz.
    return (
        <section
            id="pricing" // ID'yi #pricing olarak güncelledik
            className="relative w-full py-24 md:py-32 bg-background text-zinc-50 overflow-hidden"
        >
            {/* İnce bir arkaplan deseni veya efekti eklenebilir, şimdilik temiz tutuyoruz */}
            <div className="absolute inset-0 z-0 opacity-20">
                {/* <Silk color="#1a1a1a" speed={2} scale={2} noiseIntensity={0.5} /> */}
            </div>

            {/* İçerik */}
            <div className="relative container z-10">
                <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
                    <h2 className="text-pretty text-4xl font-bold lg:text-6xl">
                        Finansal Kontrol Sizin Elinizde
                    </h2>
                    <p className="text-zinc-400 lg:text-xl">
                        Basit takipten, yapay zeka destekli analizlere kadar ihtiyacınız olan
                        her şey.
                    </p>

                    <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
                        {Cüzdan360Plans.map((plan) => {
                            // Pro planı için BackgroundGradient sarmalayıcı kullan
                            const CardWrapper =
                                plan.id === "pro" ? BackgroundGradient : "div";
                            const wrapperProps =
                                plan.id === "pro"
                                    ? {
                                        className: "rounded-xl", // BackgroundGradient'in köşelerini ayarla
                                        animate: true,
                                    }
                                    : { className: "h-full" }; // Normal div için

                            return (
                                <CardWrapper
                                    key={plan.id}
                                    {...wrapperProps}
                                    // Pro planına hafif bir Y ekseni kaydırması ekleyerek öne çıkar
                                    className={cn(
                                        plan.id === "pro"
                                            ? "rounded-xl md:-translate-y-4"
                                            : "h-full"
                                    )}
                                >
                                    <Card
                                        className={cn(
                                            "flex h-full w-full flex-col justify-between text-left",
                                            // Pro kartını daha koyu ve belirgin yap
                                            plan.id === "pro"
                                                ? "border-primary/50 bg-card"
                                                : "border-border/50 bg-card/80 backdrop-blur-sm"
                                        )}
                                    >
                                        <CardHeader>
                                            <CardTitle
                                                className={cn(
                                                    "text-2xl font-bold",
                                                    plan.id === "pro" ? "text-primary" : "text-white"
                                                )}
                                            >
                                                {plan.name}
                                            </CardTitle>
                                            <CardDescription className="text-sm text-zinc-400">
                                                {plan.description}
                                            </CardDescription>
                                            <span className="text-4xl font-bold text-white">
                        {plan.monthlyPrice}
                      </span>
                                            <p className="text-zinc-500">
                                                {plan.id !== "kurumsal" ? "Aylık" : "Teklif Alın"}
                                            </p>
                                        </CardHeader>

                                        <CardContent>
                                            <Separator className="mb-6 bg-border/50" />
                                            {plan.id === "pro" && (
                                                <p className="mb-3 font-semibold text-zinc-200">
                                                    Tüm Temel özellikler ve:
                                                </p>
                                            )}
                                            {plan.id === "kurumsal" && (
                                                <p className="mb-3 font-semibold text-zinc-200">
                                                    Tüm Pro özellikler ve:
                                                </p>
                                            )}
                                            <ul className="space-y-4">
                                                {plan.features.map((feature, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-center gap-2 text-zinc-200"
                                                    >
                                                        <CircleCheck className="size-4 text-primary" />
                                                        <span>{feature.text}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>

                                        <CardFooter className="mt-auto pt-6">
                                            {plan.button.variant === "default" ? (
                                                <Button
                                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                                    asChild
                                                >
                                                    <a href={plan.button.url}>
                                                        {plan.button.text}
                                                        <ArrowRight className="ml-2 size-4" />
                                                    </a>
                                                </Button>
                                            ) : (
                                                <HoverBorderGradient
                                                    containerClassName="rounded-md w-full"
                                                    as="button"
                                                    className="w-full dark:bg-black bg-black text-white dark:text-white flex items-center justify-center space-x-2"
                                                    onClick={() => (window.location.href = plan.button.url)}
                                                >
                                                    <span>{plan.button.text}</span>
                                                    <ArrowRight className="ml-2 size-4" />
                                                </HoverBorderGradient>
                                            )}
                                        </CardFooter>
                                    </Card>
                                </CardWrapper>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}