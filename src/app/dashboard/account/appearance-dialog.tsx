'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Sun, Moon, Monitor, Palette } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { useTheme } from 'next-themes';

interface AppearanceDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

type ColorScheme = 'default' | 'blue' | 'green' | 'purple' | 'orange';

export function AppearanceDialog({ isOpen, onClose }: AppearanceDialogProps) {
    const { theme, setTheme } = useTheme();
    const [colorScheme, setColorScheme] = useState<ColorScheme>('default');
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

        console.log('Appearance settings saved:', { theme, colorScheme });

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

    const colorSchemes = [
        {
            value: 'default' as ColorScheme,
            label: 'Varsayılan',
            color: 'hsl(var(--primary))',
        },
        {
            value: 'blue' as ColorScheme,
            label: 'Mavi',
            color: 'hsl(221, 83%, 53%)',
        },
        {
            value: 'green' as ColorScheme,
            label: 'Yeşil',
            color: 'hsl(142, 71%, 45%)',
        },
        {
            value: 'purple' as ColorScheme,
            label: 'Mor',
            color: 'hsl(262, 83%, 58%)',
        },
        {
            value: 'orange' as ColorScheme,
            label: 'Turuncu',
            color: 'hsl(25, 95%, 53%)',
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
                                <div key={mode.value} className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors">
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

                    <Separator />

                    {/* Renk Şeması Seçimi */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Palette className="w-4 h-4" />
                            <Label className="text-base font-semibold">Renk Şeması</Label>
                        </div>
                        <RadioGroup value={colorScheme} onValueChange={(value) => setColorScheme(value as ColorScheme)}>
                            <div className="grid grid-cols-2 gap-3">
                                {colorSchemes.map((scheme) => (
                                    <div
                                        key={scheme.value}
                                        className="flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-accent transition-colors"
                                    >
                                        <RadioGroupItem value={scheme.value} id={scheme.value} />
                                        <div className="flex items-center gap-2 flex-1">
                                            <div
                                                className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                                                style={{ backgroundColor: scheme.color }}
                                            />
                                            <Label htmlFor={scheme.value} className="text-sm font-medium cursor-pointer">
                                                {scheme.label}
                                            </Label>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
            </DialogContent>
        </Dialog>
    );
}
