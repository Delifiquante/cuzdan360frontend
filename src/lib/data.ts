import type { Transaction, Investment, Debt, AssetAllocation, NetWorthDataPoint, UpcomingPayment, NewsArticle, CurrencyRate, Category, Source, AssetType } from './types';
import { TransactionType } from './types';

export const netWorth = 250000;
export const cashFlow = 1500;
export const totalAssets = 300000;
export const totalDebts = 50000;

export const categories: Category[] = [
  { categoryId: 1, name: 'Market' },
  { categoryId: 2, name: 'Maaş' },
  { categoryId: 3, name: 'Faturalar' },
  { categoryId: 4, name: 'Eğlence' },
  { categoryId: 5, name: 'Ulaşım' },
];

export const sources: Source[] = [
  { sourceId: 1, sourceName: 'Nakit' },
  { sourceId: 2, sourceName: 'Kredi Kartı' },
  { sourceId: 3, sourceName: 'Banka Hesabı' },
];

export const assetTypes: AssetType[] = [
  { assetTypeId: 1, name: 'TL', code: 'TRY' },
  { assetTypeId: 2, name: 'Dolar', code: 'USD' },
  { assetTypeId: 3, name: 'Euro', code: 'EUR' },
];

export const transactions: Transaction[] = [
  {
    transactionId: 1,
    userId: 1,
    assetTypeId: 1,
    categoryId: 1,
    sourceId: 2,
    transactionType: TransactionType.Expense,
    amount: 75.6,
    title: 'Süpermarket',
    transactionDate: '2024-07-26T10:00:00Z',
    user: { id: 1, name: 'Demo User' },
    assetType: assetTypes[0],
    category: categories[0],
    source: sources[1]
  },
  {
    transactionId: 2,
    userId: 1,
    assetTypeId: 1,
    categoryId: 2,
    sourceId: 3,
    transactionType: TransactionType.Income,
    amount: 4500,
    title: 'Aylık Maaş',
    transactionDate: '2024-07-25T09:00:00Z',
    user: { id: 1, name: 'Demo User' },
    assetType: assetTypes[0],
    category: categories[1],
    source: sources[2]
  },
  {
    transactionId: 3,
    userId: 1,
    assetTypeId: 1,
    categoryId: 3,
    sourceId: 3,
    transactionType: TransactionType.Expense,
    amount: 120,
    title: 'Elektrik Faturası',
    transactionDate: '2024-07-24T14:30:00Z',
    user: { id: 1, name: 'Demo User' },
    assetType: assetTypes[0],
    category: categories[2],
    source: sources[2]
  },
  {
    transactionId: 4,
    userId: 1,
    assetTypeId: 1,
    categoryId: 4,
    sourceId: 2,
    transactionType: TransactionType.Expense,
    amount: 30,
    title: 'Sinema Biletleri',
    transactionDate: '2024-07-23T20:00:00Z',
    user: { id: 1, name: 'Demo User' },
    assetType: assetTypes[0],
    category: categories[3],
    source: sources[1]
  },
  {
    transactionId: 5,
    userId: 1,
    assetTypeId: 1,
    categoryId: 5,
    sourceId: 2,
    transactionType: TransactionType.Expense,
    amount: 50,
    title: 'Benzin',
    transactionDate: '2024-07-22T18:15:00Z',
    user: { id: 1, name: 'Demo User' },
    assetType: assetTypes[0],
    category: categories[4],
    source: sources[1]
  },
  {
    transactionId: 6,
    userId: 1,
    assetTypeId: 1,
    categoryId: 2,
    sourceId: 3,
    transactionType: TransactionType.Income,
    amount: 800,
    title: 'Serbest Proje',
    transactionDate: '2024-07-21T11:00:00Z',
    user: { id: 1, name: 'Demo User' },
    assetType: assetTypes[0],
    category: categories[1],
    source: sources[2]
  },
  {
    transactionId: 7,
    userId: 1,
    assetTypeId: 1,
    categoryId: 4,
    sourceId: 1,
    transactionType: TransactionType.Expense,
    amount: 85,
    title: 'Akşam Yemeği',
    transactionDate: '2024-07-20T19:30:00Z',
    user: { id: 1, name: 'Demo User' },
    assetType: assetTypes[0],
    category: categories[3],
    source: sources[0]
  },
];

export const investments: Investment[] = [
  { id: '1', name: 'Apple Inc.', ticker: 'AAPL', value: 25000, change: 1.5 },
  { id: '2', name: 'Vanguard S&P 500 ETF', ticker: 'VOO', value: 120000, change: -0.2 },
  { id: '3', name: 'Tesla Inc.', ticker: 'TSLA', value: 45000, change: 3.1 },
  { id: '4', name: 'Bitcoin', ticker: 'BTC', value: 60000, change: -2.5 },
];

export const debts: Debt[] = [
  { id: '1', creditor: 'Şehir Bankası', amount: 25000, dueDate: '2030-01-15', interestRate: 3.5 },
  { id: '2', creditor: 'Oto Kredi A.Ş.', amount: 15000, dueDate: '2027-05-20', interestRate: 4.2 },
  { id: '3', creditor: 'Devlet Öğrenim Kredileri', amount: 10000, dueDate: '2035-08-01', interestRate: 5.0 },
];

export const assetAllocation: AssetAllocation[] = [
  { name: 'Hisse Senetleri', value: 190000, fill: 'hsl(var(--chart-1))' },
  { name: 'ETFler', value: 120000, fill: 'hsl(var(--chart-2))' },
  { name: 'Kripto', value: 60000, fill: 'hsl(var(--chart-3))' },
  { name: 'Nakit', value: 30000, fill: 'hsl(var(--chart-4))' },
];

export const netWorthHistory: NetWorthDataPoint[] = [
  { date: 'Oca 24', netWorth: 220000 },
  { date: 'Şub 24', netWorth: 225000 },
  { date: 'Mar 24', netWorth: 235000 },
  { date: 'Nis 24', netWorth: 230000 },
  { date: 'May 24', netWorth: 242000 },
  { date: 'Haz 24', netWorth: 248000 },
  { date: 'Tem 24', netWorth: 250000 },
  { date: 'Ağu 24', netWorth: 255000 },
  { date: 'Eyl 24', netWorth: 258000 },
  { date: 'Eki 24', netWorth: 262000 },
  { date: 'Kas 24', netWorth: 268000 },
  { date: 'Ara 24', netWorth: 275000 },
];

export const incomeVsExpenses = [
  { month: 'Oca', income: 5200, expenses: 4800 },
  { month: 'Şub', income: 5300, expenses: 5100 },
  { month: 'Mar', income: 6500, expenses: 4800 },
  { month: 'Nis', income: 5200, expenses: 5800 },
  { month: 'May', income: 6800, expenses: 5200 },
  { month: 'Haz', income: 5400, expenses: 4900 },
];

export const monthlySavings = [
  { month: 'Oca', savings: 400 },
  { month: 'Şub', savings: 200 },
  { month: 'Mar', savings: 1700 },
  { month: 'Nis', savings: -600 },
  { month: 'May', savings: 1600 },
  { month: 'Haz', savings: 500 },
];

export const upcomingPayments: UpcomingPayment[] = [
  { id: '1', name: 'Netflix Aboneliği', dueDate: '2024-08-01', amount: 15.99 },
  { id: '2', name: 'İnternet Faturası', dueDate: '2024-08-05', amount: 60 },
  { id: '3', name: 'Kredi Kartı Ödemesi', dueDate: '2024-08-10', amount: 500 },
  { id: '4', name: 'Kira', dueDate: '2024-08-01', amount: 1200 },
];

export const newsFeed: NewsArticle[] = [
  { id: '1', source: 'Bloomberg', headline: 'Merkez Bankası faiz oranlarını sabit tuttu, piyasalar tepkisiz.', time: '2 saat önce' },
  { id: '2', source: 'Reuters', headline: 'Teknoloji hisseleri, yapay zeka patlamasıyla yeni zirvelere ulaştı.', time: '3 saat önce' },
  { id: '3', source: 'Wall Street Journal', headline: 'Enflasyon verileri beklentilerin altında kalarak Fed\'in faiz indirimi umutlarını artırdı.', time: '5 saat önce' },
  { id: '4', source: 'Financial Times', headline: 'Gelişmekte olan piyasalar, güçlü dolar karşısında zorlanmaya devam ediyor.', time: '8 saat önce' },
];

export const currencyRates: CurrencyRate[] = [
  { pair: 'USD/TRY', rate: 32.85, change: 0.12 },
  { pair: 'EUR/TRY', rate: 35.21, change: -0.05 },
  { pair: 'GBP/TRY', rate: 41.67, change: 0.25 },
  { pair: 'Altın (GR)', rate: 2450.70, change: 0.8 },
  { pair: 'BTC/USD', rate: 61543.21, change: -1.2 },
  { pair: 'EUR/USD', rate: 1.07, change: -0.3 },
  { pair: 'BIST 100', rate: 10771.36, change: 1.5 },
];
