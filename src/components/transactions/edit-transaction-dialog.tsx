'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Transaction, Category, Source, AssetType } from "@/lib/types";
import { CreateTransactionData } from '@/lib/services/transactionService';

// Form şeması - Create form ile aynı kurallar
const transactionSchema = z.object({
    title: z.string().min(2, "Açıklama zorunludur."),
    amount: z.coerce.number().min(0.01, "Tutar 0'dan büyük olmalıdır."),
    transactionType: z.enum(["0", "1"], { required_error: "Tür seçimi zorunludur." }),
    categoryId: z.coerce.number({ required_error: "Kategori zorunludur.", invalid_type_error: "Kategori seçmelisiniz." }),
    sourceId: z.coerce.number({ required_error: "Kaynak zorunludur.", invalid_type_error: "Kaynak seçmelisiniz." }),
    assetTypeId: z.coerce.number({ required_error: "Varlık Tipi zorunludur.", invalid_type_error: "Varlık Tipi seçmelisiniz." }),
    transactionDate: z.string().min(10, "Tarih zorunludur."),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface EditTransactionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: Transaction | null;
    onSubmit: (id: number, data: CreateTransactionData) => Promise<void>;
    categories: Category[];
    sources: Source[];
    assetTypes: AssetType[];
}

export function EditTransactionDialog({
    open,
    onOpenChange,
    transaction,
    onSubmit,
    categories,
    sources,
    assetTypes
}: EditTransactionDialogProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            title: "",
            amount: 0,
            transactionType: "1",
            categoryId: 0,
            sourceId: 0,
            assetTypeId: 0,
            transactionDate: new Date().toISOString().split('T')[0],
        },
    });

    // Dialog açıldığında veya transaction değiştiğinde formu doldur
    useEffect(() => {
        if (transaction && open) {
            form.reset({
                title: transaction.title || "",
                amount: transaction.amount,
                transactionType: transaction.transactionType.toString() as "0" | "1",
                categoryId: transaction.categoryId || (transaction.category?.categoryId),
                sourceId: transaction.sourceId || (transaction.source?.sourceId),
                assetTypeId: transaction.assetTypeId || (transaction.assetType?.assetTypeId),
                // ISO string'den YYYY-MM-DD al
                transactionDate: transaction.transactionDate ? new Date(transaction.transactionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            });
        }
    }, [transaction, open, form]);

    const handleSubmit: SubmitHandler<TransactionFormValues> = async (data) => {
        if (!transaction) return;

        setIsSubmitting(true);
        try {
            const updateData: CreateTransactionData = {
                ...data,
                transactionType: parseInt(data.transactionType, 10) as (0 | 1),
                amount: data.amount,
            };

            await onSubmit(transaction.transactionId, updateData);
            onOpenChange(false);
        } catch (error) {
            // Hata handling parent componentte yapılabilir veya burada toast gösterilebilir
            console.error("Update failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>İşlemi Düzenle</DialogTitle>
                    <DialogDescription>
                        İşlem detaylarını aşağıdan güncelleyebilirsiniz.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Açıklama</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
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
                                        <Input type="number" step="0.01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="transactionType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>İşlem Türü</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seçiniz" />
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
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kategori</FormLabel>
                                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seçiniz" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories
                                                .filter(c => c.transactionType === Number(form.watch("transactionType")))
                                                .map((c) => (
                                                    <SelectItem key={c.categoryId} value={c.categoryId.toString()}>
                                                        {c.name}
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
                                    <FormLabel>Kaynak</FormLabel>
                                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seçiniz" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sources.map((s) => (
                                                <SelectItem key={s.sourceId} value={s.sourceId.toString()}>
                                                    {s.sourceName}
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
                            name="assetTypeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Varlık Tipi</FormLabel>
                                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seçiniz" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {assetTypes.map((a) => (
                                                <SelectItem key={a.assetTypeId} value={a.assetTypeId.toString()}>
                                                    {a.name} ({a.code})
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
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                İptal
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Kaydet
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
