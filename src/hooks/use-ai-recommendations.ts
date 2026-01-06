import { useState, useEffect } from 'react';
import { AIRecommendation, getAIRecommendations } from '@/lib/ai-data';

export function useAIRecommendations() {
    const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchRecs() {
            try {
                setIsLoading(true);
                const data = await getAIRecommendations();
                // Sort by date descending (Newest first)
                const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setRecommendations(sorted);
            } catch (error) {
                console.error("Failed to fetch AI recommendations", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchRecs();
    }, []);

    return {
        latestRecommendation: recommendations[0], // The first one
        history: recommendations.slice(1), // All except the first one
        allRecommendations: recommendations,
        isLoading
    };
}
