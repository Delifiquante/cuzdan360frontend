'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { changePassword, disableTotp } from '@/lib/services/authService';
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from '@/lib/services/dashboardService';
import { TotpSetupDialog } from "@/components/ui/totp-setup-dialog";

interface SecurityDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: UserProfile | null;
}

export function SecurityDialog({ isOpen, onClose, initialData }: SecurityDialogProps) {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [isTotpOpen, setIsTotpOpen] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    React.useEffect(() => {
        if (initialData) {
            setTwoFactorEnabled(initialData.isOtpEnabled || false);
        }
    }, [initialData]);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        setPasswordError('');
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };



    // ...

    const { toast } = useToast();

    const handleSavePassword = async () => {
        // Validation
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setPasswordError('Lütfen tüm alanları doldurun.');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Yeni şifreler eşleşmiyor.');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('Yeni şifre en az 6 karakter olmalıdır.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword
            });

            if (res.error) {
                toast({
                    variant: "destructive",
                    title: "Hata",
                    description: res.error || "Şifre değiştirilemedi.",
                });
            } else {
                toast({
                    title: "Başarılı",
                    description: res.message || "Şifreniz başarıyla değiştirildi.",
                });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                // onClose(); // Optional: close dialog on success
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

    const handleToggle2FA = async (enable: boolean) => {
        if (enable) {
            // Açmak istiyorsa direkt dialogu aç
            setIsTotpOpen(true);
        } else {
            // Kapatmak istiyorsa onay al ve servisi çağır
            if (!confirm("2FA'yı devre dışı bırakmak istediğinize emin misiniz?")) return;

            setIsLoading(true);
            try {
                await disableTotp();
                setTwoFactorEnabled(false);
                toast({
                    title: "Başarılı",
                    description: "İki faktörlü kimlik doğrulama devre dışı bırakıldı.",
                });
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Hata",
                    description: error.message || "İşlem başarısız.",
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <TotpSetupDialog
                isOpen={isTotpOpen}
                onClose={() => setIsTotpOpen(false)}
                onSuccess={() => setTwoFactorEnabled(true)}
            />
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Güvenlik Ayarları</DialogTitle>
                    <DialogDescription>
                        Şifrenizi değiştirin ve hesap güvenliğinizi yönetin.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Password Change Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Şifre Değiştir</h3>

                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type={showPasswords.current ? "text" : "password"}
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('current')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Yeni Şifre</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showPasswords.new ? "text" : "password"}
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPasswords.confirm ? "text" : "password"}
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {passwordError && (
                            <p className="text-sm text-destructive">{passwordError}</p>
                        )}

                        <Button
                            onClick={handleSavePassword}
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Şifreyi Değiştir
                        </Button>
                    </div>

                    <Separator />

                    {/* Two-Factor Authentication Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">İki Faktörlü Kimlik Doğrulama</h3>
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex-1">
                                <Label htmlFor="2fa" className="text-sm font-normal">
                                    2FA Etkinleştir
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Hesabınıza ekstra bir güvenlik katmanı ekleyin.
                                </p>
                            </div>
                            <Switch
                                id="2fa"
                                checked={twoFactorEnabled}
                                onCheckedChange={handleToggle2FA}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Kapat
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
