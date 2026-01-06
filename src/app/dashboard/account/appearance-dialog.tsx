'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Sun, Moon, Monitor } from 'lucide-react'; // Palette removed
import { Separator } from "@/components/ui/separator";
import { useTheme } from 'next-themes';

interface AppearanceDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AppearanceDialog({ isOpen, onClose }: AppearanceDialogProps) {
    const { theme, setTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log('Appearance settings saved:', { theme });

        setIsLoading(false);
        alert('Görünüm ayarları başarıyla kaydedildi!');
        onClose();
    };

    const themeModes = [
        {
            value: 'light',
            label: 'Açık Tema',
            description: 'Aydınlık renk şeması',
            icon: <Sun className="w-5 h-5" />,
        },
        {
            value: 'dark',
            label: 'Koyu Tema',
            description: 'Karanlık renk şeması',
            icon: <Moon className="w-5 h-5" />,
        },
        {
            value: 'system',
            label: 'Sistem Ayarı',
            description: 'Cihazınızın ayarını kullan',
            icon: <Monitor className="w-5 h-5" />,
        },
    ];


    if (!mounted) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Görünüm ve Tema</DialogTitle>
                    <DialogDescription>
                        Uygulama temasını ve renk paletini özelleştirin.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Tema Modu Seçimi */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Tema Modu</Label>
                        <RadioGroup value={theme} onValueChange={setTheme}>
                            {themeModes.map((mode) => (
                                <div
                                    key={mode.value}
                                    className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors ${theme === mode.value ? 'border-primary bg-accent/50' : ''}`}
                                    onClick={() => setTheme(mode.value)}
                                >
                                    <RadioGroupItem value={mode.value} id={mode.value} />
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            {mode.icon}
                                        </div>
                                        <div className="flex-1">
                                            <Label htmlFor={mode.value} className="text-sm font-medium cursor-pointer">
                                                {mode.label}
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                {mode.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </RadioGroup>
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
            </DialogContent >
        </Dialog >
    );
}
