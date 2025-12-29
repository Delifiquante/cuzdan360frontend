// Dosya: src/app/dashboard/account/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { User, Shield, Bell, Paintbrush, LogOut, Loader2 } from 'lucide-react';
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Button } from '@/components/ui/button';
import { getUserProfile, type UserProfile } from '@/lib/services/dashboardService';
import { ProfileDialog } from './profile-dialog';
import { SecurityDialog } from './security-dialog';
import { NotificationDialog } from './notification-dialog';
import { AppearanceDialog } from './appearance-dialog';


export default function AccountPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const [isSecurityDialogOpen, setIsSecurityDialogOpen] = useState(false);
    const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
    const [isAppearanceDialogOpen, setIsAppearanceDialogOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuthAndFetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const profileData = await getUserProfile();
                setProfile(profileData);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthAndFetchProfile();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        router.push('/login');
    };

    const settingsOptions = [
        {
            title: "Profil Bilgileri",
            description: "Kişisel bilgilerinizi ve profil resminizi güncelleyin.",
            icon: <User className="w-6 h-6 text-primary" />,
            action: () => setIsProfileDialogOpen(true),
        },
        {
            title: "Güvenlik Ayarları",
            description: "Parolanızı değiştirin ve iki faktörlü kimlik doğrulamayı yönetin.",
            icon: <Shield className="w-6 h-6 text-primary" />,
            action: () => setIsSecurityDialogOpen(true),
        },
        {
            title: "Bildirim Tercihleri",
            description: "Hangi konularda bildirim almak istediğinizi seçin.",
            icon: <Bell className="w-6 h-6 text-primary" />,
            action: () => setIsNotificationDialogOpen(true),
        },
        {
            title: "Görünüm ve Tema",
            description: "Uygulama temasını (koyu/açık) ve renk paletini özelleştirin.",
            icon: <Paintbrush className="w-6 h-6 text-primary" />,
            action: () => setIsAppearanceDialogOpen(true),
        },
    ];

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

                    {/* Çıkış Yap Kartı */}
                    <Card>
                        <CardContent className="pt-6">
                            <Button variant="destructive" className="w-full" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Çıkış Yap
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Profile Dialog */}
                    <ProfileDialog
                        isOpen={isProfileDialogOpen}
                        onClose={() => setIsProfileDialogOpen(false)}
                        initialData={profile}
                    />

                    {/* Security Dialog */}
                    <SecurityDialog
                        isOpen={isSecurityDialogOpen}
                        onClose={() => setIsSecurityDialogOpen(false)}
                        initialData={profile}
                    />

                    {/* Notification Dialog */}
                    <NotificationDialog
                        isOpen={isNotificationDialogOpen}
                        onClose={() => setIsNotificationDialogOpen(false)}
                    />

                    {/* Appearance Dialog */}
                    <AppearanceDialog
                        isOpen={isAppearanceDialogOpen}
                        onClose={() => setIsAppearanceDialogOpen(false)}
                    />

                </div>
            </main>
        </>
    );
}