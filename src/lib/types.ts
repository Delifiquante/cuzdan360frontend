export enum TransactionType {
    Income = 0,
    Expense = 1,
}

export interface Category {
    categoryId: number;
    name: string;
    transactionType: number; // 0=Income, 1=Expense
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

// --- Dashboard Summary Types (Matching Backend DTOs) ---
export interface ChartDataPoint {
    label: string;
    value: number;
    percentage: number;
    fill?: string; // Optional for frontend charting
}

export interface CategoryExpense {
    categoryName: string;
    amount: number;
}

export interface MonthlyTrend {
    month: string;
    year: number;
    totalIncome: number;
    totalExpense: number;
}

export interface SourceFlow {
    sourceName: string;
    netFlow: number;
}

export interface UpcomingPaymentDto {
    title: string;
    amount: number;
    nextPaymentDate: string; // DateTime ISO string
    daysRemaining: number;
}

export interface DashboardSummary {
    totalNetWorth: number;
    monthlyIncome: number;
    monthlyExpense: number;
    netWorthDistribution: ChartDataPoint[];
    topCategories: CategoryExpense[];
    last6MonthsTrend: MonthlyTrend[];
    sourceFlows: SourceFlow[];
    upcomingPayments: UpcomingPaymentDto[];
    recentTransactions: Transaction[]; // Re-using existing Transaction interface
}