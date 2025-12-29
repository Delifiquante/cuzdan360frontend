// Dosya: src/app/dashboard/transactions/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Download, Loader2, PlusCircle } from "lucide-react"; // 👈 Icon eklendi
import { useToast } from "@/hooks/use-toast";

// Bileşenler
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { EditTransactionDialog } from "@/components/transactions/edit-transaction-dialog"; // 👈 YENİ
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileUpload } from "@/components/upload/file-upload";
import { Checkbox } from "@/components/ui/checkbox"; // 👈 YENİ

// === 1. DEĞİŞİKLİK: STATİK VERİ SİLİNDİ, SERVİSLER EKLENDİ ===
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, exportTransactions, CreateTransactionData } from '@/lib/services/transactionService'; // 👈 YENİ METODLAR EKLENDİ
import { getCategories, getSources, getAssetTypes } from '@/lib/services/lookupService';
import type { Transaction, Category, Source, AssetType } from "@/lib/types";
// === DEĞİŞİKLİK SONU ===


// === 2. DEĞİŞİKLİK: FORM ŞEMASI BACKEND DTO'SU İLE UYUMLU HALE GETİRİLDİ ===
const transactionSchema = z.object({
    title: z.string().min(2, "Açıklama zorunludur."),
    amount: z.coerce.number().min(0.01, "Tutar 0'dan büyük olmalıdır."),
    transactionType: z.enum(["0", "1"], { required_error: "Tür seçimi zorunludur." }),
    categoryId: z.coerce.number({ required_error: "Kategori zorunludur.", invalid_type_error: "Kategori seçmelisiniz." }),
    sourceId: z.coerce.number({ required_error: "Kaynak zorunludur.", invalid_type_error: "Kaynak seçmelisiniz." }),
    assetTypeId: z.coerce.number({ required_error: "Varlık Tipi zorunludur.", invalid_type_error: "Varlık Tipi seçmelisiniz." }),
    transactionDate: z.string().min(10, "Tarih zorunludur."),
    isRecurring: z.boolean().default(false).optional(),
    frequency: z.coerce.number().optional(), // 0=Monthly, 1=Weekly
    recurringDay: z.coerce.number().optional(),
});
// === DEĞİŞİKLİK SONU ===

type TransactionFormValues = z.infer<typeof transactionSchema>;

// Sayfa Yüklenirken Gösterilecek İskelet Yapısı (Form için)
function FormSkeleton() {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
        </div>
    );
}

export default function TransactionsPage() {
    const router = useRouter();
    const { toast } = useToast();

    // === 3. DEĞİŞİKLİK: STATE'LER BOŞ BAŞLATILDI ===
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [sources, setSources] = useState<Source[]>([]);
    const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // === DEĞİŞİKLİK SONU ===


    // === 4. DEĞİŞİKLİK: FORMUN VARSAYILAN DEĞERLERİ DTO İLE UYUMLU HALE GETİRİLDİ ===
    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            title: "",
            amount: undefined,
            transactionType: "1", // 1 = Gider (Expense)
            categoryId: undefined,
            sourceId: undefined,
            assetTypeId: undefined,
            transactionDate: new Date().toISOString().split('T')[0],
            isRecurring: false,
            frequency: 0, // Default Monthly
            recurringDay: new Date().getDate(), // Default Today
        },
    });
    // === DEĞİŞİKLİK SONU ===

    // === 5. DEĞİŞİKLİK: useEffect CANLI VERİ ÇEKECEK ŞEKİLDE GÜNCELLENDİ ===
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            router.push('/login');
            return;
        }

        async function loadPageData() {
            try {
                setIsLoading(true);
                setError(null);

                const [transactionsData, categoriesData, sourcesData, assetTypesData] = await Promise.all([
                    getTransactions(),
                    getCategories(),
                    getSources(),
                    getAssetTypes()
                ]);

                setTransactions(transactionsData);
                setCategories(categoriesData);
                setSources(sourcesData);
                setAssetTypes(assetTypesData);

            } catch (err: any) {
                setError(err.message || "Veriler yüklenirken bir hata oluştu.");
                toast({
                    variant: "destructive",
                    title: "Hata",
                    description: err.message,
                });
            } finally {
                setIsLoading(false);
            }
        }

        loadPageData();
    }, [router, toast]);
    // === DEĞİŞİKLİK SONU ===


    // === 6. DEĞİŞİKLİK: onSubmit FONKSİYONU API'Yİ ÇAĞIRACAK ŞEKİLDE GÜNCELLENDİ ===
    const onSubmit: SubmitHandler<TransactionFormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            const newTransactionData = {
                ...data,
                transactionType: parseInt(data.transactionType, 10) as (0 | 1),
                amount: data.amount,
            };

            // API'yi çağır
            const newTransaction = await createTransaction(newTransactionData);

            // State'i güncelle (Backend'den dönen TAMAMLANMIŞ veri ile)
            // Bu, "yenilenmedi" sorununu çözer.
            setTransactions([newTransaction, ...transactions]);

            form.reset({
                title: "",
                amount: undefined,
                transactionType: "1",
                categoryId: undefined,
                sourceId: undefined,
                assetTypeId: undefined,
                transactionDate: new Date().toISOString().split('T')[0],
            });

            toast({
                title: "Başarılı!",
                description: "Yeni işleminiz başarıyla eklendi.",
            });

        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "İşlem Eklenemedi",
                description: err.message || "İşlem eklenirken bir hata oluştu.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    // === DEĞİŞİKLİK SONU ===

    // === YENİ: Edit ve Delete İşlemleri ===
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const handleEditClick = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = async (id: number) => {
        if (!confirm("Bu işlemi silmek istediğinize emin misiniz?")) return;

        try {
            await deleteTransaction(id);
            // Listeden çıkar
            setTransactions(prev => prev.filter(t => t.transactionId !== id));
            toast({
                title: "Silindi",
                description: "İşlem başarıyla silindi.",
            });
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Hata",
                description: "Silme işlemi başarısız.",
            });
        }
    };

    const handleUpdateTransaction = async (id: number, data: CreateTransactionData) => {
        try {
            await updateTransaction(id, data);

            // Listeyi yerel olarak güncelle (Tekrar fetch etmek yerine)
            // Ancak ilişkisel verileri (Category name vb.) tekrar eşleştirmemiz gerekecek.
            // En temizi listeyi tekrar çekmek veya manuel güncellemek.
            // Manuel güncelleme yapalım:
            setTransactions(prev => prev.map(t => {
                if (t.transactionId === id) {
                    const category = categories.find(c => c.categoryId === data.categoryId);
                    const source = sources.find(s => s.sourceId === data.sourceId);
                    const assetType = assetTypes.find(a => a.assetTypeId === data.assetTypeId);

                    return {
                        ...t,
                        ...data,
                        amount: data.amount,
                        transactionType: data.transactionType, // Enum uyumu
                        category: category || t.category,
                        source: source || t.source,
                        assetType: assetType || t.assetType,
                    };
                }
                return t;
            }));

            toast({
                title: "Güncellendi",
                description: "İşlem başarıyla güncellendi.",
            });

        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Hata",
                description: "Güncelleme işlemi başarısız.",
            });
            throw err; // Dialog kapatılmasın diye throw ediyoruz (veya handle ediyoruz)
        }
    };

    // Yüklenme, Hata veya İçerik durumuna göre tabloyu render et
    const renderTableContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            );
        }

        // Bu, yenileme sonrası hatayı (image_6e5243.png) gösterir
        if (error) {
            return (
                <Alert variant="destructive">
                    <AlertTitle>Veri Yükleme Hatası</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            );
        }

        return (
            <TransactionsTable
                transactions={transactions}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />
        );
    };

    // Ana yüklenme (token kontrolü vs.)
    if (isLoading && !error) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <PageHeader title="İşlemler" />
            <main className="p-4 md:p-6 space-y-6">

                {/* Üst Satır: Yeni İşlem Ekle ve Dosya Yükleme Yan Yana */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Sol: Yeni İşlem Formu */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Yeni İşlem Ekle</CardTitle>
                                <CardDescription>Gelir veya giderlerinizi kaydedin.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Form verisi yükleniyorsa iskelet göster */}
                                {isLoading ? (
                                    <FormSkeleton />
                                ) : (
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                                            <FormField
                                                control={form.control}
                                                name="title" // 👈 DTO ile uyumlu
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Açıklama</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Market alışverişi" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="amount"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Tutar</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="transactionType" // 👈 DTO ile uyumlu
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>İşlem Türü</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Bir tür seçin" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="1">Gider (-)</SelectItem>
                                                                <SelectItem value="0">Gelir (+)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="categoryId" // 👈 DTO ile uyumlu
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Kategori</FormLabel>
                                                        {/* 👈 Veriyi 'categories' state'inden DİNAMİK al */}
                                                        <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Bir kategori seçin" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {categories
                                                                    .filter(cat => cat.transactionType === Number(form.watch("transactionType")))
                                                                    .map((cat) => (
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

                                            {/* 👈 YENİ FORM ALANI: KAYNAK (SOURCE) */}
                                            <FormField
                                                control={form.control}
                                                name="sourceId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Kaynak</FormLabel>
                                                        <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Bir kaynak seçin" />
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

                                            {/* 👈 YENİ FORM ALANI: VARLIK TİPİ (ASSET TYPE) */}
                                            <FormField
                                                control={form.control}
                                                name="assetTypeId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Varlık Tipi</FormLabel>
                                                        <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Bir varlık tipi seçin" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {assetTypes.map((asset) => (
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
                                                name="transactionDate" // 👈 DTO ile uyumlu
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

                                            {/* 👈 YENİ: TEKRARLAYAN İŞLEM AYARLARI */}
                                            <FormField
                                                control={form.control}
                                                name="isRecurring"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel>
                                                                Bu işlem tekrarlansın mı?
                                                            </FormLabel>
                                                            <p className="text-sm text-muted-foreground">
                                                                Her ay veya hafta otomatik olarak oluşturulur.
                                                            </p>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />

                                            {form.watch("isRecurring") && (
                                                <div className="flex gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="frequency"
                                                        render={({ field }) => (
                                                            <FormItem className="w-1/2">
                                                                <FormLabel>Sıklık</FormLabel>
                                                                <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value?.toString()}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Sıklık Seç" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        <SelectItem value="0">Aylık</SelectItem>
                                                                        <SelectItem value="1">Haftalık</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="recurringDay"
                                                        render={({ field }) => (
                                                            <FormItem className="w-1/2">
                                                                <FormLabel>
                                                                    {form.watch("frequency") === 1 ? "Gün (Pzt=1, Paz=7)" : "Ayın Günü (1-31)"}
                                                                </FormLabel>
                                                                <FormControl>
                                                                    {form.watch("frequency") === 1 ? (
                                                                        <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value?.toString()}>
                                                                            <FormControl>
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder="Gün Seç" />
                                                                                </SelectTrigger>
                                                                            </FormControl>
                                                                            <SelectContent>
                                                                                <SelectItem value="1">Pazartesi</SelectItem>
                                                                                <SelectItem value="2">Salı</SelectItem>
                                                                                <SelectItem value="3">Çarşamba</SelectItem>
                                                                                <SelectItem value="4">Perşembe</SelectItem>
                                                                                <SelectItem value="5">Cuma</SelectItem>
                                                                                <SelectItem value="6">Cumartesi</SelectItem>
                                                                                <SelectItem value="7">Pazar</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    ) : (
                                                                        <Input type="number" min={1} max={31} {...field} />
                                                                    )}
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            )}

                                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                                {isSubmitting ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <PlusCircle className="mr-2 h-4 w-4" />
                                                )}
                                                {isSubmitting ? "Ekleniyor..." : "İşlemi Ekle"}
                                            </Button>
                                        </form>
                                    </Form>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sağ: Dosya Yükleme */}
                    <div>
                        <FileUpload />
                    </div>
                </div>

                {/* Alt Satır: Tüm İşlemler - Tam Genişlik */}
                <div>
                    <BackgroundGradient className="rounded-lg" animate={false}>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Tüm İşlemler</CardTitle>
                                <Button variant="outline" size="sm" onClick={() => exportTransactions()}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Dışa Aktar
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {renderTableContent()}
                            </CardContent>
                        </Card>
                    </BackgroundGradient>
                </div>
            </main>

            <EditTransactionDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                transaction={editingTransaction}
                onSubmit={handleUpdateTransaction}
                categories={categories}
                sources={sources}
                assetTypes={assetTypes}
            />
        </>
    );
}