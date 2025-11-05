// Dosya: src/lib/services/transactionService.ts

import { fetchAuth } from '@/lib/api';
import type { Transaction } from '@/lib/types';

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
    return fetchAuth('/api/Transactions');
}

// Tek bir işlemi getir
export async function getTransactionById(id: number): Promise<Transaction> {
    return fetchAuth(`/api/Transactions/${id}`);
}

// Yeni işlem oluştur
export async function createTransaction(data: CreateTransactionData): Promise<Transaction> {
    return fetchAuth('/api/Transactions', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// İşlemi güncelle
export async function updateTransaction(id: number, data: CreateTransactionData): Promise<void> {
    return fetchAuth(`/api/Transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

// İşlemi sil
export async function deleteTransaction(id: number): Promise<void> {
    return fetchAuth(`/api/Transactions/${id}`, {
        method: 'DELETE',
    });
}