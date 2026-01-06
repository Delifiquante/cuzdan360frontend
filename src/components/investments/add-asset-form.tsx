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
    // Transaction Type 0 (Income) for Adding Assets (Positive Value)
    // We can treat 'Varlık Ekle' as adding value to net worth.
    transactionType: z.literal(0),
    categoryId: z.coerce.number({ required_error: "Kategori seçmelisiniz." }),
    sourceId: z.coerce.number({ required_error: "Kaynak seçmelisiniz." }),
    assetTypeId: z.coerce.number({ required_error: "Varlık Tipi seçmelisiniz." }),
    transactionDate: z.string().min(10, "Tarih zorunludur."),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface AddAssetFormProps {
    onAssetAdded?: () => void;
}

export function AddAssetForm({ onAssetAdded }: AddAssetFormProps) {
    const { toast } = useToast();

    const [categories, setCategories] = useState<Category[]>([]);
    const [sources, setSources] = useState<Source[]>([]);
    const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Tab state for filtering Asset Types
    const [activeTab, setActiveTab] = useState("altin");

    // New states for calculation
    const [quantity, setQuantity] = useState<string>("");
    const [unitPrice, setUnitPrice] = useState<string>("");

    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            title: "",
            amount: undefined,
            transactionType: 0, // Default to Income
            categoryId: undefined,
            sourceId: undefined,
            assetTypeId: undefined,
            transactionDate: new Date().toISOString().split('T')[0],
        },
    });

    // Auto-calculate total amount
    useEffect(() => {
        if (["altin", "hisse", "doviz"].includes(activeTab)) {
            const q = parseFloat(quantity.replace(',', '.')); // Handle comma decimals if user inputs them
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
            if (["altin", "hisse", "doviz"].includes(activeTab) && quantity) {
                const unit = activeTab === "altin" ? "Gram" : activeTab === "hisse" ? "Lot" : "Birim";
                finalTitle = `${data.title} (${quantity} ${unit})`;
            }

            await createTransaction({
                ...data,
                title: finalTitle,
                transactionType: 0, // Ensure it is Income
            });

            toast({
                title: "Başarılı",
                description: "Varlık başarıyla eklendi.",
            });

            // Reset form
            form.reset({
                title: "",
                amount: undefined,
                transactionType: 0,
                categoryId: undefined,
                sourceId: undefined,
                assetTypeId: undefined,
                transactionDate: new Date().toISOString().split('T')[0],
            });
            setQuantity("");
            setUnitPrice("");

            // Notify parent to refresh list
            if (onAssetAdded) {
                onAssetAdded();
            }

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Hata",
                description: error.message || "Varlık eklenirken hata oluştu.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFilteredAssetTypes = () => {
        if (!assetTypes.length) return [];

        const lowerIncludes = (text: string, search: string) => text.toLowerCase().includes(search);

        switch (activeTab) {
            case "altin":
                return assetTypes.filter(a => lowerIncludes(a.name, "altın") || lowerIncludes(a.name, "gold") || lowerIncludes(a.name, "gram") || lowerIncludes(a.name, "çeyrek") || a.code.includes("XAU"));
            case "hisse":
                return assetTypes.filter(a => lowerIncludes(a.name, "hisse") || lowerIncludes(a.name, "stock") || lowerIncludes(a.name, "bist") || a.code.startsWith("TR"));
            case "doviz":
                return assetTypes.filter(a => lowerIncludes(a.name, "dolar") || lowerIncludes(a.name, "euro") || lowerIncludes(a.name, "usd") || lowerIncludes(a.name, "eur") || lowerIncludes(a.name, "gbp"));
            case "diger":
            default:
                return assetTypes;
        }
    };

    const filteredAssets = getFilteredAssetTypes();
    // Fallback: If filter returns empty, show all (so user isn't stuck)
    const displayAssets = filteredAssets.length > 0 ? filteredAssets : assetTypes;

    // Filter Categories: Show only "Income" categories since we forced transactionType=0
    const incomeCategories = categories.filter(c => c.transactionType === 0);

    // Labels based on active tab
    const quantityLabel = activeTab === "altin" ? "Miktar (Gram)" : activeTab === "hisse" ? "Miktar (Lot)" : "Miktar (Birim)";
    const priceLabel = activeTab === "altin" ? "Birim Fiyat (TL/Gr)" : activeTab === "hisse" ? "Birim Fiyat (TL/Lot)" : "Kur / Birim Fiyat (TL)";
    const showCalculator = ["altin", "hisse", "doviz"].includes(activeTab);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Varlık Ekle</CardTitle>
                <CardDescription>Portföyünüze yeni bir varlık ekleyin.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="altin" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="altin">Gram Altın / Kıymetli Maden</TabsTrigger>
                        <TabsTrigger value="hisse">Hisse Senetleri</TabsTrigger>
                        <TabsTrigger value="doviz">Döviz (Dolar/Euro)</TabsTrigger>
                        <TabsTrigger value="diger">Diğer</TabsTrigger>
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
                                            <FormLabel>Açıklama</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Örn: 2024 Birikim" {...field} />
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
                                                    <FormLabel>Toplam Değer (TL)</FormLabel>
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
                                                <FormLabel>Miktar / Değer (TL)</FormLabel>
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
                                            <FormLabel>Varlık Tipi ({displayAssets.length})</FormLabel>
                                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Varlık seçin" />
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
                                                    {incomeCategories.map((cat) => (
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
                                            <FormLabel>Hesap / Cüzdan</FormLabel>
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
                                            <FormLabel>Tarih</FormLabel>
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
                                {isSubmitting ? "Ekleniyor..." : "Varlığı Ekle"}
                            </Button>
                        </form>
                    </Form>
                )}
            </CardContent>
        </Card>
    );
}
