// import { newsFeed } from "@/lib/data"; // Bu satırı kaldırıyoruz
import { NewsArticle } from '@/lib/types'; // Veri tipini import ediyoruz

// Bileşenin artık 'initialData' prop'u almasını sağlıyoruz
export function NewsFeed({ initialData }: { initialData: NewsArticle[] }) {
    return (
        <div className="flex flex-col h-full justify-between space-y-12">
            {/* Statik 'newsFeed' yerine 'initialData' prop'unu kullanıyoruz */}
            {initialData.map((item) => (
                <div key={item.id}>
                    <p className="text-sm font-medium leading-none">{item.headline}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {item.source} - {item.time}
                    </p>
                </div>
            ))}
        </div>
    );
}