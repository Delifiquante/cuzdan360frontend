'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { enableTotp, verifyAndActivateTotp } from '@/lib/services/authService';
import { useToast } from "@/hooks/use-toast";

interface TotpSetupDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function TotpSetupDialog({ isOpen, onClose, onSuccess }: TotpSetupDialogProps) {
    const [step, setStep] = useState<'qr' | 'verify'>('qr');
    const [qrCodeImage, setQrCodeImage] = useState<string>('');
    const [secret, setSecret] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    React.useEffect(() => {
        if (isOpen && step === 'qr') {
            handleEnable();
        }
    }, [isOpen]);

    const handleEnable = async () => {
        setIsLoading(true);
        try {
            const result = await enableTotp();
            setQrCodeImage(result.qrCodeImage);
            setSecret(result.secret);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Hata",
                description: error.message || "TOTP kurulumu başarısız",
            });
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!code || code.length !== 6) {
            toast({
                variant: "destructive",
                title: "Hata",
                description: "Lütfen 6 haneli kodu girin",
            });
            return;
        }

        setIsLoading(true);
        try {
            await verifyAndActivateTotp(code);
            toast({
                title: "Başarılı",
                description: "TOTP başarıyla aktif edildi!",
            });
            onSuccess();
            onClose();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Hata",
                description: error.message || "Kod doğrulanamadı",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {step === 'qr' ? 'Google Authenticator ile Tarayın' : 'Kodu Girin'}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 'qr'
                            ? 'QR kodu Google Authenticator veya benzeri bir uygulama ile tarayın'
                            : 'Authenticator uygulamanızdan 6 haneli kodu girin'}
                    </DialogDescription>
                </DialogHeader>

                {step === 'qr' && (
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-center p-4 bg-white rounded-lg">
                                    <img
                                        src={qrCodeImage}
                                        alt="QR Code"
                                        className="w-64 h-64"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Manuel Giriş Kodu</Label>
                                    <Input
                                        value={secret}
                                        readOnly
                                        className="font-mono text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        QR kodu tarayamıyorsanız bu kodu manuel olarak girebilirsiniz
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {step === 'verify' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Doğrulama Kodu</Label>
                            <Input
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                className="text-center text-2xl font-mono tracking-widest"
                                maxLength={6}
                            />
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        İptal
                    </Button>
                    {step === 'qr' && (
                        <Button onClick={() => setStep('verify')} disabled={isLoading || !qrCodeImage}>
                            İleri
                        </Button>
                    )}
                    {step === 'verify' && (
                        <Button onClick={handleVerify} disabled={isLoading || code.length !== 6}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Aktif Et
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
