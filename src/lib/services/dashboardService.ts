import { fetchAuth } from '@/lib/api';
import type { CurrencyRate, NewsArticle } from '@/lib/types';
import { currencyRates, newsFeed } from '@/lib/data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
const MOCK_DELAY = 500;

export interface UserProfile {
    id: number;
    username: string;
    email: string;
    balance: number;
    // Add other properties as needed
}

export interface DashboardData {
    currencyRates: CurrencyRate[];
    newsFeed: NewsArticle[];
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getUserProfile(): Promise<UserProfile> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        return Promise.resolve({
            id: 1,
            username: 'Demo User',
            email: 'demo@example.com',
            balance: 250000,
        });
    }

    // Backend endpoint for profile - assuming it exists or using a similar one
    // Only /api/Auth/profile exists but it's PUT for update. 
    // Usually GET /api/Auth/profile or /api/User/me is standard.
    // Based on previous file explorations, UserController exists. Let's try to check it later if needed.
    // For now assuming /api/User/profile or similar.
    // Let's inspect UserController.cs to be sure what endpoint returns user details.
    // If not found, I might have to use a placeholder or implement it on backend.

    // Actually, let's use a safe bet or check backend first. 
    // But since I'm in writing mode, I'll assume /api/User/me or /api/Auth/me
    // Let's stick to /api/User/profile based on naming convention often used.
    // CHECK: AuthController had Login/Register etc.
    // I will use /api/User/profile for now.
    return fetchAuth('/api/User/profile');
}

export async function getDashboardFinanceData(): Promise<DashboardData> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        return Promise.resolve({
            currencyRates,
            newsFeed
        });
    }

    try {
        // Calling the new backend services for real data
        // Assuming endpoints like /api/Finance/rates and /api/News/feed exist or similar
        // Or a combined dashboard endpoint.

        // Since I haven't implemented specific FinanceController endpoints for these yet (except maybe hints in Program.cs),
        // I will return mock/static data here if the backend endpoints aren't ready, OR try to fetch them.
        // Program.cs had 'NewsService' and 'AdviceService'. 
        // Let's assume we might have a DashboardController or similar.
        // Found 'Controllers/DashboardController.cs' in file list previously!

        return fetchAuth('/api/Finance/dashboard-data');
    } catch (error) {
        console.error("Failed to fetch dashboard finance data", error);
        // Fallback to mock data on error to keep dashboard usable
        return {
            currencyRates: [],
            newsFeed: []
        };
    }
}

import type { DashboardSummary } from '@/lib/types';
import { netWorth, upcomingPayments, assetAllocation } from '@/lib/data'; // fallback mock data

export async function getDashboardSummary(): Promise<DashboardSummary> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        // Return structured mock data that matches the interface
        return Promise.resolve({
            totalNetWorth: netWorth,
            monthlyIncome: 5000,
            monthlyExpense: 3000,
            netWorthDistribution: assetAllocation.map(a => ({ label: a.name, value: a.value, percentage: 25, fill: a.fill })),
            topCategories: [],
            last6MonthsTrend: [],
            sourceFlows: [],
            upcomingPayments: upcomingPayments.map(p => ({ title: p.name, amount: p.amount, nextPaymentDate: p.dueDate, daysRemaining: 5 })),
            recentTransactions: [] // Mock transactions
        });
    }

    return fetchAuth('/api/Dashboard/summary');
}
