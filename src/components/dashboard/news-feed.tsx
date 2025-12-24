import { NewsArticle } from '@/lib/types'; // 👈 Tip import edildi
import { Skeleton } from '@/components/ui/skeleton'; // 👈 Skeleton import edildi
import Image from 'next/image'; // 👈 Resimler için

export function NewsFeed({
    initialData,
    isLoading
}: {
    initialData: NewsArticle[],
    isLoading: boolean
}) {

    // 1. Yükleniyorsa iskelet göster
    if (isLoading) {
        return (
            <div className="flex flex-col h-full justify-start space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-md" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // 2. Veri yüklendi ama boşsa
    if (initialData.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Gösterilecek haber bulunamadı.</p>
            </div>
        );
    }

    // 3. Veri başarıyla yüklendi
    return (
        <div className="flex flex-col h-full justify-start space-y-2">
            {initialData.map((item) => (
                <a
                    key={item.id}
                    href={item.url} // 👈 Habere link eklendi
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:bg-muted/50 p-2 rounded-lg transition-colors"
                >
                    <div className="flex items-start gap-4">
                        {/* Varsa resmi göster */}
                        {item.imageUrl ? (
                            <Image
                                src={item.imageUrl}
                                alt={item.headline}
                                width={64}
                                height={64}
                                className="rounded-md object-cover h-16 w-16"
                                // Hata durumunda (örn: 403) resmi gizle
                                onError={(e) => e.currentTarget.style.display = 'none'}
                            />
                        ) : (
                            // Resim yoksa placeholder göster
                            <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                                <span className="text-xs text-center">Resim Yok</span>
                            </div>
                        )}

                        <div className="flex-1">
                            <p className="text-sm font-medium leading-normal line-clamp-2">{item.headline}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                {item.source} - {item.time}
                            </p>
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
}