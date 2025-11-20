'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from '@/lib/services/dashboardService';
import { Loader2 } from 'lucide-react';
import { updateProfile } from '@/lib/services/authService';
import { useToast } from "@/hooks/use-toast";

interface ProfileDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: UserProfile | null;
}

export function ProfileDialog({ isOpen, onClose, initialData }: ProfileDialogProps) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '', // Mock field since it's not in UserProfile yet
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                username: initialData.username || '',
                email: initialData.email || '',
                phone: '+90 555 123 45 67', // Mock default phone
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };



    // ...

    const { toast } = useToast();

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const res = await updateProfile({
                username: formData.username,
                email: formData.email
            });

            if (res.error) {
                toast({
                    variant: "destructive",
                    title: "Hata",
                    description: res.error || "Profil güncellenemedi.",
                });
            } else {
                toast({
                    title: "Başarılı",
                    description: res.message || "Profil bilgileri güncellendi.",
                });
                onClose();
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Hata",
                description: "Bir hata oluştu.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Profil Bilgileri</DialogTitle>
                    <DialogDescription>
                        Hesap bilgilerinizi buradan güncelleyebilirsiniz. Değişiklikleri kaydetmeyi unutmayın.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Kullanıcı Adı
                        </Label>
                        <Input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            E-posta
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Telefon
                        </Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        İptal
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Kaydet
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
