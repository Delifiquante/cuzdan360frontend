export enum TransactionType {
    Income = 0,
    Expense = 1,
}

export interface Category {
    categoryId: number;
    name: string;
}

export interface Source {
    sourceId: number;
    sourceName: string;
}

export interface AssetType {
    assetTypeId: number;
    name: string;
    code: string;
}


export interface Transaction {
    transactionId: number;
    userId: number;
    assetTypeId: number;
    categoryId: number;
    sourceId: number;
    transactionType: TransactionType;
    amount: number;
    title: string | null; // Backend'de 'Title' (string?) olarak tanımlı
    transactionDate: string; // (JSON'da string olarak gelir, örn: "2025-11-05T10:30:00Z")

    // Backend'den gelen nested (iç içe) veriler
    user: any; // (Şimdilik any olabilir veya User tipini tanımlayabilirsiniz)
    assetType: AssetType;
    category: Category;
    source: Source;
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