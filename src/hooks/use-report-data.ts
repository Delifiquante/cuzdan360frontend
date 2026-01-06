import { useState, useEffect, useCallback } from 'react';
import { getTransactions } from '@/lib/services/transactionService';
import type { Transaction } from '@/lib/types';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, min as minDate, max as maxDate } from 'date-fns';
import { tr } from 'date-fns/locale';

export interface MonthlyReportData {
    month: string; // "Oca", "Şub" etc.
    rawDate: Date; // For sorting
    income: number;
    expenses: number;
    savings: number;
}

export interface NetWorthDataPoint {
    date: string;
    netWorth: number;
}

export function useReportData() {
    const [isLoading, setIsLoading] = useState(true);
    const [monthlyData, setMonthlyData] = useState<MonthlyReportData[]>([]);
    const [netWorthHistory, setNetWorthHistory] = useState<NetWorthDataPoint[]>([]);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const allTransactions = await getTransactions();

            if (allTransactions.length === 0) {
                setMonthlyData([]);
                setNetWorthHistory([]);
                return;
            }

            // 1. Prepare Date Range (from first transaction to today)
            // Sort transactions by date asc
            const sortedTransactions = [...allTransactions].sort((a, b) =>
                new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime()
            );

            const firstDate = new Date(sortedTransactions[0].transactionDate);
            const lastDate = new Date();

            // Generate all months in interval
            const months = eachMonthOfInterval({
                start: startOfMonth(firstDate),
                end: endOfMonth(lastDate)
            });

            // 2. Calculate Monthly Income/Expense/Savings
            const monthlyStats = months.map(monthDate => {
                // Filter transactions for this month
                const monthlyTrans = allTransactions.filter(t => {
                    const tDate = new Date(t.transactionDate);
                    return tDate.getMonth() === monthDate.getMonth() &&
                        tDate.getFullYear() === monthDate.getFullYear();
                });

                const income = monthlyTrans
                    .filter(t => t.transactionType === 0) // Income / Asset Addition
                    .reduce((sum, t) => sum + t.amount, 0);

                const expenses = monthlyTrans
                    .filter(t => t.transactionType === 1) // Expense / Debt
                    .reduce((sum, t) => sum + t.amount, 0);

                return {
                    month: format(monthDate, 'MMM', { locale: tr }),
                    rawDate: monthDate,
                    income,
                    expenses,
                    savings: income - expenses
                };
            });

            setMonthlyData(monthlyStats);

            // 3. Calculate Cumulative Net Worth History (End of each month)
            // Net Worth = Assets (Positive) - Debts (Negative)

            let runningTotal = 0;

            // We calculate running total up to the end of each month
            const history = months.map(monthDate => {
                const monthEnd = endOfMonth(monthDate);

                // Get all transactions up to end of this month
                const upToDateTrans = allTransactions.filter(t =>
                    new Date(t.transactionDate) <= monthEnd
                );

                const totalAssets = upToDateTrans
                    .filter(t => t.transactionType === 0)
                    .reduce((sum, t) => sum + t.amount, 0);

                const totalDebts = upToDateTrans
                    .filter(t => t.transactionType === 1)
                    .reduce((sum, t) => sum + t.amount, 0);

                // Net Worth assumption logic:
                // If "Debt" creates a liability, it subtacts from Net Worth.
                // If "Asset" creates value, it adds.
                const currentNetWorth = totalAssets - totalDebts;

                return {
                    date: format(monthDate, 'MMM yy', { locale: tr }),
                    netWorth: currentNetWorth
                };
            });

            setNetWorthHistory(history);

        } catch (error) {
            console.error("Error fetching report data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { isLoading, monthlyData, netWorthHistory, refresh: fetchData };
}
