// Dosya: src/lib/services/lookupService.ts

import { fetchAuth } from '@/lib/api';
import type { Category, Source, AssetType } from '@/lib/types';
import { categories, sources, assetTypes } from '@/lib/data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
const MOCK_DELAY = 500;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Not: Bu tiplerin 'src/lib/types.ts' dosyanızda backend ile
// uyumlu olarak (bir önceki adımda yaptığımız gibi) tanımlandığını varsayıyoruz.

export async function getCategories(): Promise<Category[]> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        return Promise.resolve(categories);
    }
    // Controller'daki yeni rotayı çağır
    return fetchAuth('/api/Transactions/categories');
}

export async function getSources(): Promise<Source[]> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        return Promise.resolve(sources);
    }
    // Controller'daki yeni rotayı çağır
    return fetchAuth('/api/Transactions/sources');
}

export async function getAssetTypes(): Promise<AssetType[]> {
    if (USE_MOCK) {
        await delay(MOCK_DELAY);
        return Promise.resolve(assetTypes);
    }
    // Controller'daki yeni rotayı çağır
    return fetchAuth('/api/Transactions/asset-types');
}