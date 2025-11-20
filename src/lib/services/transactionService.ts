// Dosya: src/lib/services/transactionService.ts

import { fetchAuth } from '@/lib/api';
import type { Transaction } from '@/lib/types';
import { transactions } from '@/lib/data';

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
}

// Tüm işlemleri getir
export async function getTransactions(): Promise<Transaction[]> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        return Promise.resolve(transactions);
    }
    return fetchAuth('/api/Transactions');
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
    return fetchAuth(`/api/Transactions/${id}`);
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
    return fetchAuth('/api/Transactions', {
        method: 'POST',
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
    return fetchAuth(`/api/Transactions/${id}`, {
        method: 'PUT',
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
    return fetchAuth(`/api/Transactions/${id}`, {
        method: 'DELETE',
    });
}