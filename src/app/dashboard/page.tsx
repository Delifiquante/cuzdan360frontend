"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";

import { OverviewCards } from "@/components/dashboard/overview-cards";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { UpcomingPayments } from "@/components/dashboard/upcoming-payments";
import { AssetAllocationChart } from "@/components/dashboard/asset-allocation-chart";
import { NewsFeed } from "@/components/dashboard/news-feed";
import { CurrencyTicker } from "@/components/dashboard/currency-ticker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserProfile, getDashboardFinanceData, type UserProfile, type DashboardData } from "@/lib/services/dashboardService";
import type { CurrencyRate, NewsArticle } from "@/lib/types";

export default function DashboardPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // 👈 Ana profil yükleme durumu
    const router = useRouter();

    // --- FİNANS VERİLERİ İÇİN YENİ STATE'LER ---
    const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([]);
    const [newsFeed, setNewsFeed] = useState<NewsArticle[]>([]);
    const [isFinanceLoading, setIsFinanceLoading] = useState(true); // 👈 Finans yükleme durumu
    // --- BİTİŞ ---

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                router.push('/login');
                return;
            }

            // --- 1. Paralel İstekler ---
            setIsLoading(true);
            setIsFinanceLoading(true);

            try {
                const [profileData, financeData] = await Promise.all([
                    getUserProfile(), // Profil isteği
                    getDashboardFinanceData() // .NET Finans isteği
                ]);

                // Profil verisini ayarla
                setProfile(profileData);

                // Finans verisini ayarla
                const data = financeData as DashboardData; // Gelen veriyi tipine cast et
                setCurrencyRates(data.currencyRates || []);
                setNewsFeed(data.newsFeed || []);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
                setIsFinanceLoading(false);
            }
        };

        checkAuthAndFetchData();
    }, [router]);

    // --- YÜKLENİYOR EKRANI ---
    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    // --- HATA EKRANI ---
    if (error) {
        return (
            <div className="flex h-screen w-full items-center justify-center text-destructive">
                {error}
            </div>
        );
    }

    // --- BAŞARILI DURUM (Dashboard) ---
    const netWorth = profile ? profile.balance : 0;

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Hoş geldin, {profile ? profile.username : '...'}!
                </h2>
            </div>

            {/* 1. Kur Bilgisi (Dinamik Veri) */}
            <CurrencyTicker
                initialData={currencyRates}
                isLoading={isFinanceLoading}
            />

            {/* 2. Genel Bakış Kartları (Dinamik Net Değer) */}
            <OverviewCards netWorth={netWorth} />

            {/* --- YENİ YERLEŞİM: 2x2 Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">

                {/* KART 1: Varlık Dağılımı (Sol Üst) */}
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle>Varlık Dağılımı</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center">
                        <AssetAllocationChart />
                    </CardContent>
                </Card>

                {/* KART 2: Finans Haberleri (Sağ Üst) */}
                {/* Kartların eşit yüksekliği için h-full ve flex-col */}
                <Card className="h-full flex flex-col max-h-[500px]"> {/* Max yükseklik ekledik */}
                    <CardHeader>
                        <CardTitle>Finans Haberleri</CardTitle>
                    </CardHeader>
                    {/* İçeriğin taşması durumunda scroll ekliyoruz */}
                    <CardContent className="flex-1 overflow-y-auto">
                        <NewsFeed
                            initialData={newsFeed}
                            isLoading={isFinanceLoading}
                        />
                    </CardContent>
                </Card>

                {/* KART 3: Son İşlemler (Sol Alt) */}
                <Card className="h-full flex flex-col max-h-[500px]">
                    <CardHeader>
                        <CardTitle>Son İşlemler</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto">
                        <RecentTransactions />
                    </CardContent>
                </Card>

                {/* KART 4: Yaklaşan Ödemeler (Sağ Alt) */}
                <Card className="h-full flex flex-col max-h-[500px]">
                    <CardHeader>
                        <CardTitle>Yaklaşan Ödemeler</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto">
                        <UpcomingPayments />
                    </CardContent>
                </Card>
            </div>
            {/* --- YENİ YERLEŞİM BİTİŞİ --- */}
        </div>
    );
}