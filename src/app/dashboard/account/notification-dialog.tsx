'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

interface NotificationDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NotificationPreferences {
    emailNotifications: boolean;
    pushNotifications: boolean;
    transactionAlerts: boolean;
    paymentReminders: boolean;
    newsUpdates: boolean;
    marketingEmails: boolean;
}

export function NotificationDialog({ isOpen, onClose }: NotificationDialogProps) {
    const [preferences, setPreferences] = useState<NotificationPreferences>({
        emailNotifications: true,
        pushNotifications: true,
        transactionAlerts: true,
        paymentReminders: true,
        newsUpdates: false,
        marketingEmails: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = (key: keyof NotificationPreferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Notification preferences saved:', preferences);

        setIsLoading(false);
        alert('Bildirim tercihleri başarıyla kaydedildi!');
        onClose();
    };

    const notificationSettings = [
        {
            key: 'emailNotifications' as keyof NotificationPreferences,
            title: 'E-posta Bildirimleri',
            description: 'Önemli güncellemeler için e-posta alın.',
        },
        {
            key: 'pushNotifications' as keyof NotificationPreferences,
            title: 'Push Bildirimleri',
            description: 'Tarayıcı üzerinden anlık bildirimler alın.',
        },
        {
            key: 'transactionAlerts' as keyof NotificationPreferences,
            title: 'İşlem Uyarıları',
            description: 'Her işlemde bildirim alın.',
        },
        {
            key: 'paymentReminders' as keyof NotificationPreferences,
            title: 'Ödeme Hatırlatıcıları',
            description: 'Yaklaşan ödemeler için hatırlatma alın.',
        },
        {
            key: 'newsUpdates' as keyof NotificationPreferences,
            title: 'Finans Haberleri',
            description: 'Güncel finans haberlerinden haberdar olun.',
        },
        {
            key: 'marketingEmails' as keyof NotificationPreferences,
            title: 'Pazarlama E-postaları',
            description: 'Özel teklifler ve kampanyalar hakkında bilgi alın.',
        },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Bildirim Tercihleri</DialogTitle>
                    <DialogDescription>
                        Hangi konularda bildirim almak istediğinizi seçin.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {notificationSettings.map((setting, index) => (
                        <React.Fragment key={setting.key}>
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex-1">
                                    <Label htmlFor={setting.key} className="text-sm font-medium">
                                        {setting.title}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        {setting.description}
                                    </p>
                                </div>
                                <Switch
                                    id={setting.key}
                                    checked={preferences[setting.key]}
                                    onCheckedChange={() => handleToggle(setting.key)}
                                    disabled={isLoading}
                                />
                            </div>
                            {index < notificationSettings.length - 1 && <Separator />}
                        </React.Fragment>
                    ))}
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
