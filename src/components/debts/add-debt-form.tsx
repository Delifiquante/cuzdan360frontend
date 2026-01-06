'use client';

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, PlusCircle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createTransaction } from '@/lib/services/transactionService';
import { getCategories, getSources, getAssetTypes } from '@/lib/services/lookupService';
import type { Category, Source, AssetType } from "@/lib/types";

const transactionSchema = z.object({
    title: z.string().min(2, "Açıklama zorunludur."),
    amount: z.coerce.number().min(0.01, "Tutar 0'dan büyük olmalıdır."),
    // Transaction Type 1 (Expense) for Adding Debts (Negative Value concept, but stored as positive amount with type 1)
    transactionType: z.literal(1),
    categoryId: z.coerce.number({ required_error: "Kategori seçmelisiniz." }),
    // sourceId can be optional for Debts depending on logic, but usually we assign it to a 'Debt Account' or similar
    // For now let's keep it required as 'Associated Account/Wallet'
    sourceId: z.coerce.number({ required_error: "Kaynak seçmelisiniz." }),
    assetTypeId: z.coerce.number({ required_error: "Borç Tipi seçmelisiniz." }),
    transactionDate: z.string().min(10, "Tarih zorunludur."),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface AddDebtFormProps {
    onDebtAdded?: () => void;
}

export function AddDebtForm({ onDebtAdded }: AddDebtFormProps) {
    const { toast } = useToast();

    const [categories, setCategories] = useState<Category[]>([]);
    const [sources, setSources] = useState<Source[]>([]);
    const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Tab state for filtering Debt Types
    const [activeTab, setActiveTab] = useState("nakit");

    // New states for calculation
    const [quantity, setQuantity] = useState<string>("");
    const [unitPrice, setUnitPrice] = useState<string>("");

    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            title: "",
            amount: undefined,
            transactionType: 1, // Default to Expense (Debt)
            categoryId: undefined,
            sourceId: undefined,
            assetTypeId: undefined,
            transactionDate: new Date().toISOString().split('T')[0],
        },
    });

    // Auto-calculate total amount
    useEffect(() => {
        if (["altin", "doviz"].includes(activeTab)) {
            const q = parseFloat(quantity.replace(',', '.'));
            const p = parseFloat(unitPrice.replace(',', '.'));
            if (!isNaN(q) && !isNaN(p)) {
                form.setValue("amount", Number((q * p).toFixed(2)));
            }
        }
    }, [quantity, unitPrice, activeTab, form]);

    useEffect(() => {
        async function loadData() {
            try {
                setIsLoading(true);
                const [categoriesData, sourcesData, assetTypesData] = await Promise.all([
                    getCategories(),
                    getSources(),
                    getAssetTypes()
                ]);
                setCategories(categoriesData);
                setSources(sourcesData);
                setAssetTypes(assetTypesData);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Hata",
                    description: "Veriler yüklenirken bir hata oluştu.",
                });
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [toast]);

    const onSubmit: SubmitHandler<TransactionFormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            let finalTitle = data.title;
            // Append quantity info to title if applicable
            if (["altin", "doviz"].includes(activeTab) && quantity) {
                const unit = activeTab === "altin" ? "Gram" : "Birim";
                finalTitle = `${data.title} (${quantity} ${unit})`;
            }

            await createTransaction({
                ...data,
                title: finalTitle,
                transactionType: 1, // Ensure it is Expense
            });

            toast({
                title: "Başarılı",
                description: "Borç başarıyla eklendi.",
            });

            // Reset form
            form.reset({
                title: "",
                amount: undefined,
                transactionType: 1,
                categoryId: undefined,
                sourceId: undefined,
                assetTypeId: undefined,
                transactionDate: new Date().toISOString().split('T')[0],
            });
            setQuantity("");
            setUnitPrice("");

            // Notify parent to refresh list
            if (onDebtAdded) {
                onDebtAdded();
            }

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Hata",
                description: error.message || "Borç eklenirken hata oluştu.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFilteredAssetTypes = () => {
        if (!assetTypes.length) return [];

        const lowerIncludes = (text: string, search: string) => text.toLowerCase().includes(search);

        switch (activeTab) {
            case "nakit":
                // For Cash Debt, we just need basic currency (TRY) or generic.
                // Using 'TL' or 'Nakit' asset if checking existence, or return all 'Currency' types but mainly TRY.
                // For simplicity, let's filter related to 'TL', 'Lira', 'TRY' or catch-all
                return assetTypes.filter(a => a.code === 'TRY' || lowerIncludes(a.name, "lira") || lowerIncludes(a.name, "nakit"));
            case "altin":
                return assetTypes.filter(a => lowerIncludes(a.name, "altın") || lowerIncludes(a.name, "gold") || lowerIncludes(a.name, "gram") || lowerIncludes(a.name, "çeyrek") || a.code.includes("XAU"));
            case "doviz":
                return assetTypes.filter(a => (lowerIncludes(a.name, "dolar") || lowerIncludes(a.name, "euro") || lowerIncludes(a.name, "usd") || lowerIncludes(a.name, "eur") || lowerIncludes(a.name, "gbp")) && a.code !== 'TRY');
            default:
                return assetTypes;
        }
    };

    const filteredAssets = getFilteredAssetTypes();
    // Fallback: If filter returns empty, show all (so user isn't stuck)
    const displayAssets = filteredAssets.length > 0 ? filteredAssets : assetTypes;

    // Filter Categories: Show only "Expense" categories since we forced transactionType=1
    // Ideally we want specific 'Debt' categories, but Expense is close enough for structure.
    const expenseCategories = categories.filter(c => c.transactionType === 1);

    // Labels based on active tab
    const quantityLabel = activeTab === "altin" ? "Miktar (Gram)" : "Miktar (Birim)";
    const priceLabel = activeTab === "altin" ? "Birim Fiyat (TL/Gr)" : "Kur / Birim Fiyat (TL)";
    const showCalculator = ["altin", "doviz"].includes(activeTab);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Borç Ekle</CardTitle>
                <CardDescription>Yeni bir borç kaydı oluşturun.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="nakit" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="nakit">Nakit Borç (TL)</TabsTrigger>
                        <TabsTrigger value="doviz">Döviz Borcu</TabsTrigger>
                        <TabsTrigger value="altin">Altın Borcu</TabsTrigger>
                    </TabsList>
                </Tabs>

                {isLoading ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="animate-spin h-6 w-6 text-primary" />
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Borç Tanımı / Alacaklı</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Örn: Kredi Kartı, Ahmet'e Borç" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {showCalculator ? (
                                    <>
                                        <div className="space-y-2">
                                            <FormLabel>{quantityLabel}</FormLabel>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <FormLabel>{priceLabel}</FormLabel>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={unitPrice}
                                                onChange={(e) => setUnitPrice(e.target.value)}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="amount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Toplam Borç Tutarı (TL)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" step="0.01" placeholder="0.00" {...field} readOnly className="bg-muted" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                ) : (
                                    <FormField
                                        control={form.control}
                                        name="amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Borç Tutarı (TL)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <FormField
                                    control={form.control}
                                    name="assetTypeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Para Birimi / Cins ({displayAssets.length})</FormLabel>
                                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seçiniz" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {displayAssets.map((asset) => (
                                                        <SelectItem key={asset.assetTypeId} value={asset.assetTypeId.toString()}>
                                                            {asset.name} ({asset.code})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kategori</FormLabel>
                                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Kategori seçin" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {expenseCategories.map((cat) => (
                                                        <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="sourceId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>İlgili Hesap / Ödenecek Yer</FormLabel>
                                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Hesap seçin" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {sources.map((src) => (
                                                        <SelectItem key={src.sourceId} value={src.sourceId.toString()}>
                                                            {src.sourceName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="transactionDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Borç Tarihi</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                )}
                                {isSubmitting ? "Ekleniyor..." : "Borcu Kaydet"}
                            </Button>
                        </form>
                    </Form>
                )}
            </CardContent>
        </Card>
    );
}
