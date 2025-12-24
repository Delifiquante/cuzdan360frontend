import { fetchAuth } from '@/lib/api';
import type { Transaction, Category, Source, AssetType } from '@/lib/types';
import { transactions } from '@/lib/data';
import { getAssetTypes, getCategories, getSources } from './lookupService';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
const MOCK_DELAY = 500;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Backend'deki CreateTransactionRequest DTO'su ile eşleşen bir tip
// (Backend'de TransactionType enum, Amount decimal idi, burada number oluyor)
export interface CreateTransactionData {
    assetTypeId: number;
    categoryId: number;
    sourceId: number;
    transactionType: 0 | 1; // Income veya Expense
    amount: number;
    title: string | null;
    transactionDate: string; // ISO 8601 formatında (örn: new Date().toISOString())
    isRecurring?: boolean;
    recurringDay?: number;
    frequency?: number; // 0=Monthly, 1=Weekly
}

// Tüm işlemleri getir
export async function getTransactions(): Promise<Transaction[]> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        return Promise.resolve(transactions);
    }

    // Backend ilişkisel verileri (Category, Source vb.) dönmediği için
    // onları ayrıca çekip burada birleştiriyoruz (Client-side mapping).
    try {
        const [transactionsData, categoriesData, sourcesData, assetTypesData] = await Promise.all([
            fetchAuth('/api/Transaction'),
            getCategories(),
            getSources(),
            getAssetTypes(),
        ]);

        if (!Array.isArray(transactionsData)) {
            return [];
        }

        return transactionsData.map((t: any): Transaction => {
            return {
                ...t,
                category: categoriesData.find((c: Category) => c.categoryId === t.categoryId) || { categoryId: t.categoryId, name: 'Bilinmiyor' },
                source: sourcesData.find((s: Source) => s.sourceId === t.sourceId) || { sourceId: t.sourceId, sourceName: 'Bilinmiyor' },
                assetType: assetTypesData.find((a: AssetType) => a.assetTypeId === t.assetTypeId) || { assetTypeId: t.assetTypeId, name: 'Bilinmiyor', code: '' },
            };
        });
    } catch (error) {
        console.error("Error fetching transactions or lookups:", error);
        throw error;
    }
}

// Tek bir işlemi getir
export async function getTransactionById(id: number): Promise<Transaction> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        const transaction = transactions.find(t => t.transactionId === id);
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        return Promise.resolve(transaction);
    }
    return fetchAuth(`/api/Transaction/${id}`);
}

// Yeni işlem oluştur
export async function createTransaction(data: CreateTransactionData): Promise<Transaction> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        // Mock implementation: create a new transaction object
        // Note: In a real app, we would need to look up category/source/assetType details
        // For now, we'll just cast the IDs or use placeholders to satisfy the type
        const newId = Math.max(...transactions.map(t => t.transactionId), 0) + 1;

        // We need to find the related objects to populate the full Transaction object
        // Importing them here to avoid circular dependencies if possible, or just use what we have
        // For simplicity in this mock, we might need to import categories/sources/assetTypes from data too
        // But let's just do a basic push if we can, or return a mocked object.
        // Since we are inside the service, let's try to do it right.

        // However, we didn't import categories/sources/assetTypes in this file yet.
        // Let's just return a mock object that looks correct enough for the UI to update if it uses the return value.
        // If the UI re-fetches the list, we should push to the array.

        const newTransaction: any = {
            transactionId: newId,
            userId: 1,
            ...data,
            user: { id: 1, name: 'Demo User' },
            // These would ideally be looked up
            assetType: { assetTypeId: data.assetTypeId, name: 'Mock Asset', code: 'MCK' },
            category: { categoryId: data.categoryId, name: 'Mock Category' },
            source: { sourceId: data.sourceId, sourceName: 'Mock Source' },
        };

        transactions.push(newTransaction);
        return Promise.resolve(newTransaction);
    }
    return fetchAuth('/api/Transaction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

// İşlemi güncelle
export async function updateTransaction(id: number, data: CreateTransactionData): Promise<void> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        const index = transactions.findIndex(t => t.transactionId === id);
        if (index !== -1) {
            transactions[index] = {
                ...transactions[index],
                ...data,
            };
        }
        return Promise.resolve();
    }
    return fetchAuth(`/api/Transaction/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

// İşlemi sil
export async function deleteTransaction(id: number): Promise<void> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        const index = transactions.findIndex(t => t.transactionId === id);
        if (index !== -1) {
            transactions.splice(index, 1);
        }
        return Promise.resolve();
    }
    return fetchAuth(`/api/Transaction/${id}`, {
        method: 'DELETE',
    });
}

// Toplu işlem oluştur
export async function bulkCreateTransactions(transactions: CreateTransactionData[]): Promise<void> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        // Mock implementation
        transactions.forEach(data => {
            const newId = Math.max(...(transactions as any[]).map(t => t.transactionId || 0), 0) + 1;
            // ... push to mock data
        });
        return Promise.resolve();
    }

    return fetchAuth('/api/Transaction/bulk-create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactions }),
    });
}

// Fiş analizi yap
export async function analyzeReceipt(file: File): Promise<CreateTransactionData[]> {
    if (USE_MOCK) {
        await delay(3000); // 3 saniye bekle (loading bar'ı görmek için)
        // Mock data döndür
        return Promise.resolve([
            {
                assetTypeId: 1,
                categoryId: 1,
                sourceId: 1,
                transactionType: 1,
                amount: 150.0,
                title: 'Mock Fiş Testi',
                transactionDate: new Date().toISOString()
            },
            {
                assetTypeId: 1,
                categoryId: 3,
                sourceId: 1,
                transactionType: 1,
                amount: 45.90,
                title: 'Mock Kahve',
                transactionDate: new Date().toISOString()
            }
        ]);
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetchAuth("/api/Transaction/analyze-receipt", {
        method: "POST",
        body: formData,
    });

    // Response wrapper kontrolü
    if (response && response.transactions) {
        return response.transactions;
    }
    if (Array.isArray(response)) {
        return response;
    }

    throw new Error("Beklenmeyen analiz sonucu formatı.");
}

// İşlemleri excel olarak dışa aktar
export async function exportTransactions(): Promise<void> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        alert("Mock modunda dışa aktarma simüle edildi. Konsola bakınız.");
        console.log("Mock Export: Transactions exported.");
        return Promise.resolve();
    }

    // GÜVENLİ YÖNTEM: Token'ı alıp manuel fetch yapalım.
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    const res = await fetch(`${apiBaseUrl}/api/Transaction/export`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error("Dışa aktarma başarısız oldu.");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.xlsx`; // Varsayılan isim
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}