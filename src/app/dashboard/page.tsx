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

import type { CurrencyRate, NewsArticle, DashboardSummary } from "@/lib/types";
import { getUserProfile, getDashboardFinanceData, getDashboardSummary, type UserProfile, type DashboardData } from "@/lib/services/dashboardService";

export default function DashboardPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- FİNANS VERİLERİ ---
    const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([]);
    const [newsFeed, setNewsFeed] = useState<NewsArticle[]>([]);
    const [summary, setSummary] = useState<DashboardSummary | null>(null);

    const router = useRouter();

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                router.push('/login');
                return;
            }

            setIsLoading(true);

            try {
                const [profileData, financeData, summaryData] = await Promise.all([
                    getUserProfile(),
                    getDashboardFinanceData(),
                    getDashboardSummary()
                ]);

                // Verileri ayarla
                setProfile(profileData);

                const fData = financeData as DashboardData;
                setCurrencyRates(fData.currencyRates || []);
                setNewsFeed(fData.newsFeed || []);

                setSummary(summaryData);

            } catch (err: any) {
                console.error("Dashboard yüklenirken hata:", err);
                setError(err.message || "Veriler yüklenirken bir hata oluştu.");
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthAndFetchData();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen w-full items-center justify-center text-destructive">
                {error}
                <br />
                <button onClick={() => window.location.reload()} className="ml-4 underline">Yeniden Dene</button>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Hoş geldin, {profile ? profile.username : '...'}!
                </h2>
            </div>

            {/* 1. Kur Bilgisi */}
            <CurrencyTicker
                initialData={currencyRates}
                isLoading={isLoading}
            />

            {/* 2. Genel Bakış Kartları */}
            <OverviewCards summary={summary} />

            {/* --- 2x2 Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">

                {/* KART 1: Varlık Dağılımı */}
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle>Varlık Dağılımı</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center">
                        <AssetAllocationChart data={summary?.netWorthDistribution || []} />
                    </CardContent>
                </Card>

                {/* KART 2: Finans Haberleri */}
                <Card className="h-full flex flex-col max-h-[500px]">
                    <CardHeader>
                        <CardTitle>Finans Haberleri</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto">
                        <NewsFeed
                            initialData={newsFeed}
                            isLoading={isLoading}
                        />
                    </CardContent>
                </Card>

                {/* KART 3: Son İşlemler */}
                <Card className="h-full flex flex-col max-h-[500px]">
                    <CardHeader>
                        <CardTitle>Son İşlemler</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto">
                        <RecentTransactions transactions={summary?.recentTransactions || []} />
                    </CardContent>
                </Card>

                {/* KART 4: Yaklaşan Ödemeler */}
                <Card className="h-full flex flex-col max-h-[500px]">
                    <CardHeader>
                        <CardTitle>Yaklaşan Ödemeler</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto">
                        <UpcomingPayments payments={summary?.upcomingPayments || []} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}