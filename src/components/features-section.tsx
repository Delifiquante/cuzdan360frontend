// Dosya Yolu: src/components/features-section.tsx
"use client";

import React from "react";
// Bir önceki adımda düzelttiğimiz bileşeni import ediyoruz
import { GlowingEffect } from "./ui/glowing-effect";
import { cn } from "@/lib/utils";
import {
    AreaChart,
    ArrowLeftRight,

    FileText,
    Landmark, // Yeni eklenen ikon
    LayoutDashboard,
} from "lucide-react";
import BlurText from "./ui/blur-text"; // Zaten mevcut

// blueprint.md dosyasından alınan ve 6'ya çıkarılan özellikler
const features = [
    {
        title: "Akıllı Dashboard",
        description:
            "Tüm net değerinizi, nakit akışınızı, varlıklarınızı ve borçlarınızı tek bir ekranda görün.",
        icon: <LayoutDashboard className="h-8 w-8 text-brand" />, // 'brand' rengini kullan
    },
    {
        title: "Yatırım Takibi",
        description:
            "Hisse senetleri, ETF'ler ve kripto varlıklarınızın performansını anlık olarak izleyin.",
        icon: <AreaChart className="h-8 w-8 text-brand" />,
    },

    {
        title: "Detaylı Raporlama",
        description:
            "Harcamalarınız, gelirleriniz ve varlık dağılımınız hakkında görsel ve anlaşılır raporlar oluşturun.",
        icon: <FileText className="h-8 w-8 text-brand" />,
    },
    {
        title: "İşlem ve Borç Yönetimi",
        description:
            "Tüm işlemlerinizi kolayca kategorize edin ve borçlarınızın vade tarihlerini tek bir yerden yönetin.",
        icon: <ArrowLeftRight className="h-8 w-8 text-brand" />,
    },
    {
        title: "Tüm Hesaplar Tek Yerde", // 6. YENİ KART
        description:
            "Tüm banka hesaplarınızı ve finansal varlıklarınızı güvenli bir şekilde bağlayarak tam bir resim elde edin.",
        icon: <Landmark className="h-8 w-8 text-brand" />,
    },
];

export function FeaturesSection() {
    return (
        <section
            id="features"
            className="relative w-full overflow-hidden bg-background py-20 lg:py-32"
        >
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Başlık ve Alt Başlık */}
                <div className="mx-auto mb-16 max-w-4xl text-center flex flex-col items-center justify-center">
                    <BlurText
                        text="Finansal Yönetimin Yeni Yolu"
                        delay={100}
                        animateBy="words"
                        direction="top"
                        className="text-4xl mx-auto font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-center"
                    />
                    <p className="mt-6 text-xl leading-8 text-neutral-400">
                        Cüzdan360, finansa karmaşık ve dağınık bir sorun olmaktan çıkarıp,
                        basit ve yönetilebilir bir hedef haline getirir.
                    </p>
                </div>

                {/* Özellik Kartları - 6 adet */}
                <div className="relative">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "relative h-full overflow-hidden rounded-2xl border",
                                    "border-border/50 bg-card/80 p-8 shadow-xl backdrop-blur-sm"
                                )}
                            >
                                {/* GlowingEffect'i her kart için uyguluyoruz.
                  Propları (spread, blur vs.) belirtmemize gerek yok,
                  çünkü bir önceki adımda düzelttiğimiz 'glowing-effect.tsx' 
                  dosyasındaki varsayılan değerleri kullanması yeterli.
                */}

                                {/* Kart İçeriği */}
                                <div className="relative z-10 flex h-full flex-col">
                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
                                        {feature.icon}
                                    </div>
                                    <h3 className="mb-2 text-2xl font-semibold text-foreground">
                                        {feature.title}
                                    </h3>
                                    <p className="flex-1 text-base text-neutral-400">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}