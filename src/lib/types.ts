export interface Transaction {
    id: string;
    date: string;
    description: string;
    category: 'Market' | 'Maaş' | 'Faturalar' | 'Eğlence' | 'Ulaşım';
    amount: number;
    type: 'income' | 'expense';
}

export interface Investment {
    id: string;
    name: string;
    ticker: string;
    value: number;
    change: number;
}

export interface Debt {
    id: string;
    creditor: string;
    amount: number;
    dueDate: string;
    interestRate: number;
}

export interface AssetAllocation {
    name: string;
    value: number;
    fill: string;
}

export interface NetWorthDataPoint {
    date: string;
    netWorth: number;
}

export interface UpcomingPayment {
    id: string;
    name: string;
    dueDate: string;
    amount: number;
}

export interface NewsArticle {
    id: string;
    source: string;
    headline: string;
    time: string;
    imageUrl?: string | null; // 👈 YENİ EKLENDİ (RSS'ten gelen resim)
    url?: string;             // 👈 YENİ EKLENDİ (Haberin linki)
}

export interface CurrencyRate {
    pair: string;
    rate: number;
    change: number;
}