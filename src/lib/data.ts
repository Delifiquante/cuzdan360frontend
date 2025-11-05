import type { Transaction, Investment, Debt, AssetAllocation, NetWorthDataPoint, UpcomingPayment, NewsArticle, CurrencyRate } from './types';

export const netWorth = 250000;
export const cashFlow = 1500;
export const totalAssets = 300000;
export const totalDebts = 50000;

export const transactions: Transaction[] = [
  { id: '1', date: '2024-07-26', description: 'Süpermarket', category: 'Market', amount: 75.6, type: 'expense' },
  { id: '2', date: '2024-07-25', description: 'Aylık Maaş', category: 'Maaş', amount: 4500, type: 'income' },
  { id: '3', date: '2024-07-24', description: 'Elektrik Faturası', category: 'Faturalar', amount: 120, type: 'expense' },
  { id: '4', date: '2024-07-23', description: 'Sinema Biletleri', category: 'Eğlence', amount: 30, type: 'expense' },
  { id: '5', date: '2024-07-22', description: 'Benzin', category: 'Ulaşım', amount: 50, type: 'expense' },
  { id: '6', date: '2024-07-21', description: 'Serbest Proje', category: 'Maaş', amount: 800, type: 'income' },
  { id: '7', date: '2024-07-20', description: 'Akşam Yemeği', category: 'Eğlence', amount: 85, type: 'expense' },
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
