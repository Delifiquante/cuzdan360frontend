import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIRecommendation } from "@/lib/ai-data";
import { Skeleton } from "@/components/ui/skeleton";

interface RecommendationHistoryProps {
    recommendations: AIRecommendation[];
    isLoading: boolean;
}

export function RecommendationHistory({ recommendations, isLoading }: RecommendationHistoryProps) {
    if (isLoading) {
        return <Skeleton className="h-[300px] w-full rounded-xl" />;
    }

    const categories = ["all", "saving", "investment", "debt"];

    const getFiltered = (cat: string) => {
        if (cat === "all") return recommendations;
        return recommendations.filter(r => r.type === cat);
    };

    return (
        <div className="h-full flex flex-col">
            <Tabs defaultValue="all" className="w-full flex-1 flex flex-col">
                <div className="pb-4">
                    <TabsList className="w-full justify-start h-9 p-1 bg-muted/50">
                        <TabsTrigger value="all" className="flex-1 text-xs">Tümü</TabsTrigger>
                        <TabsTrigger value="investment" className="flex-1 text-xs">Yatırım</TabsTrigger>
                        <TabsTrigger value="saving" className="flex-1 text-xs">Tasarruf</TabsTrigger>
                        <TabsTrigger value="debt" className="flex-1 text-xs">Borç</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 relative min-h-[300px]">
                    {categories.map(cat => (
                        <TabsContent key={cat} value={cat} className="absolute inset-0 m-0">
                            <ScrollArea className="h-full pr-4">
                                <div className="flex flex-col gap-2">
                                    {getFiltered(cat).length === 0 ? (
                                        <div className="p-8 text-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                                            <p>Bu kategoride geçmiş tavsiye bulunamadı.</p>
                                        </div>
                                    ) : (
                                        getFiltered(cat).map((rec, i) => (
                                            <div
                                                key={rec.id}
                                                className="p-4 rounded-lg border bg-card hover:bg-muted/40 transition-colors group cursor-default"
                                            >
                                                <div className="flex items-start justify-between mb-1.5">
                                                    <span className="font-medium text-sm group-hover:text-primary transition-colors">{rec.title}</span>
                                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2 bg-muted px-1.5 py-0.5 rounded">{rec.date}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{rec.content}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </div>
    );
}
