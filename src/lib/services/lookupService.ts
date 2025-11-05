// Dosya: src/lib/services/lookupService.ts

import { fetchAuth } from '@/lib/api';
import type { Category, Source, AssetType } from '@/lib/types';

// Not: Bu tiplerin 'src/lib/types.ts' dosyanızda backend ile
// uyumlu olarak (bir önceki adımda yaptığımız gibi) tanımlandığını varsayıyoruz.

export async function getCategories(): Promise<Category[]> {
    // Controller'daki yeni rotayı çağır
    return fetchAuth('/api/Transactions/categories');
}

export async function getSources(): Promise<Source[]> {
    // Controller'daki yeni rotayı çağır
    return fetchAuth('/api/Transactions/sources');
}

export async function getAssetTypes(): Promise<AssetType[]> {
    // Controller'daki yeni rotayı çağır
    return fetchAuth('/api/Transactions/asset-types');
}