import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { AIRecommendation } from "@/lib/ai-data";
import { Skeleton } from "@/components/ui/skeleton";

interface LatestRecommendationProps {
    recommendation?: AIRecommendation;
    isLoading: boolean;
}

export function LatestRecommendation({ recommendation, isLoading }: LatestRecommendationProps) {
    if (isLoading) {
        return <Skeleton className="h-[300px] w-full rounded-xl" />;
    }

    if (!recommendation) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-12 border-2 border-dashed rounded-xl">
                <Sparkles className="w-12 h-12 mb-4 opacity-50" />
                <p>Henüz bir tavsiye bulunmuyor.</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col justify-center p-6 md:p-10 bg-gradient-to-br from-primary/5 via-card to-card rounded-xl border border-primary/10 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Sparkles className="w-48 h-48" />
            </div>

            <div className="flex flex-col gap-6 relative z-10">
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1 px-3 py-1 text-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        En Son Tavsiye
                    </Badge>
                    <span className="text-sm text-muted-foreground font-medium">{recommendation.date}</span>
                </div>

                <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl text-primary font-bold tracking-tight leading-tight">
                        {recommendation.title}
                    </h3>

                    <div className="text-base md:text-lg leading-relaxed text-foreground/80">
                        {recommendation.content}
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-2">
                    <Badge variant="secondary" className="capitalize px-3 py-1">
                        {recommendation.type}
                    </Badge>
                    {recommendation.impact === 'high' && (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-500/10 px-3 py-1 rounded-full text-xs font-medium border border-red-500/20">
                            <span>⚠️</span>
                            <span>Yüksek Etki</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
