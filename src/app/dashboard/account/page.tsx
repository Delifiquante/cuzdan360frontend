// Dosya: src/app/dashboard/account/page.tsx
'use client';

import React, { useEffect, useState } from 'react'; // 👈 useEffect ve useState eklendi
import { useRouter } from 'next/navigation'; // 👈 Yönlendirme için eklendi
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; // 👈 CardContent eklendi
import { PageHeader } from "@/components/layout/page-header";
import { User, Shield, Bell, Paintbrush, LogOut, Loader2 } from 'lucide-react'; // 👈 LogOut ve Loader2 eklendi
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Button } from '@/components/ui/button'; // 👈 Button eklendi

const settingsOptions = [
    {
        title: "Profil Bilgileri",
        description: "Kişisel bilgilerinizi ve profil resminizi güncelleyin.",
        icon: <User className="w-6 h-6 text-primary" />,
        action: () => console.log("Profil Bilgileri tıklandı"),
    },
    {
        title: "Güvenlik Ayarları",
        description: "Parolanızı değiştirin ve iki faktörlü kimlik doğrulamayı yönetin.",
        icon: <Shield className="w-6 h-6 text-primary" />,
        action: () => console.log("Güvenlik Ayarları tıklandı"),
    },
    {
        title: "Bildirim Tercihleri",
        description: "Hangi konularda bildirim almak istediğinizi seçin.",
        icon: <Bell className="w-6 h-6 text-primary" />,
        action: () => console.log("Bildirim Tercihleri tıklandı"),
    },
    {
        title: "Görünüm ve Tema",
        description: "Uygulama temasını (koyu/açık) ve renk paletini özelleştirin.",
        icon: <Paintbrush className="w-6 h-6 text-primary" />,
        action: () => console.log("Görünüm ve Tema tıklandı"),
    },
];


export default function AccountPage() {
    // --- YENİ EKLENDİ: Yetkilendirme Kontrolü ---
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            router.push('/login');
        } else {
            // Token var, sayfayı yükle
            setIsLoading(false);
        }
    }, [router]);

    // Çıkış yap fonksiyonu
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        router.push('/login');
    };
    // --- YENİ EKLENDİ BİTİŞ ---

    // Yüklenme durumu (token kontrol edilirken)
    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    // Sayfa içeriği
    return (
        <>
            <PageHeader title="Hesap Ayarları" />
            <main className="p-4 md:p-6">
                <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
                    {/* Ayar Kartları */}
                    {settingsOptions.map((option) => (
                        <BackgroundGradient key={option.title} className="rounded-lg" animate={false}>
                            <Card
                                className="cursor-pointer h-full"
                                onClick={option.action}
                            >
                                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10">
                                        {option.icon}
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle>{option.title}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {option.description}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                        </BackgroundGradient>
                    ))}

                    {/* YENİ EKLENDİ: Çıkış Yap Kartı */}
                    <Card>
                        <CardContent className="pt-6">
                            <Button variant="destructive" className="w-full" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Çıkış Yap
                            </Button>
                        </CardContent>
                    </Card>
                    {/* YENİ EKLENDİ BİTİŞ */}

                </div>
            </main>
        </>
    );
}