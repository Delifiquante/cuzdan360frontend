import { fetchAuth } from '@/lib/api';
import { currencyRates, newsFeed, netWorth } from '@/lib/data';
import type { CurrencyRate, NewsArticle } from '@/lib/types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
const MOCK_DELAY = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface UserProfile {
    username: string;
    email: string;
    balance: number;
}

export interface DashboardData {
    currencyRates: CurrencyRate[];
    newsFeed: NewsArticle[];
}

export async function getUserProfile(): Promise<UserProfile> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        return Promise.resolve({
            username: 'Demo User',
            email: 'demo@example.com',
            balance: netWorth, // Using netWorth from data.ts as balance
        });
    }
    return fetchAuth('/api/User/profile');
}

export async function getDashboardFinanceData(): Promise<DashboardData> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        return Promise.resolve({
            currencyRates: currencyRates,
            newsFeed: newsFeed,
        });
    }
    return fetchAuth('/api/Finance/dashboard-data');
}
