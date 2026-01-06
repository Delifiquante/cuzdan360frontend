"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Sparkles, ArrowLeft } from "lucide-react";
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { useAIRecommendations } from "@/hooks/use-ai-recommendations";
import { LatestRecommendation } from "./latest-recommendation";
import { RecommendationHistory } from "./recommendation-history";
import { AnimatePresence, motion } from "framer-motion";

export function AiRecommendationsSection() {
    const { latestRecommendation, history, isLoading } = useAIRecommendations();
    const [view, setView] = useState<'latest' | 'history'>('latest');

    const toggleView = () => {
        setView(prev => prev === 'latest' ? 'history' : 'latest');
    };

    return (
        <div className="h-full">
            <BackgroundGradient className="rounded-xl h-full" animate={false}>
                <Card className="h-full flex flex-col relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b/40">
                        <div className="space-y-1">
                            <CardTitle className="text-xl flex items-center gap-2">
                                {view === 'latest' ? (
                                    <>
                                        <Sparkles className="w-5 h-5 text-primary" />
                                        Yapay Zeka Analizleri
                                    </>
                                ) : (
                                    <>
                                        <History className="w-5 h-5 text-primary" />
                                        Tavsiye Geçmişi
                                    </>
                                )}
                            </CardTitle>
                            <CardDescription>
                                {view === 'latest'
                                    ? "Finansal durumunuza özel en güncel öneri."
                                    : "Geçmişte size sunulan tüm finansal tavsiyeler."
                                }
                            </CardDescription>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleView}
                            className="gap-2"
                        >
                            {view === 'latest' ? (
                                <>
                                    <History className="w-4 h-4" />
                                    Geçmiş Tavsiyeler
                                </>
                            ) : (
                                <>
                                    <ArrowLeft className="w-4 h-4" />
                                    Son Tavsiye
                                </>
                            )}
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 relative">
                        <div className="p-4 h-full">
                            {view === 'latest' ? (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="h-full"
                                >
                                    {/* Pass isLoading explicitly to handle skeleton */}
                                    <LatestRecommendation
                                        recommendation={latestRecommendation}
                                        isLoading={isLoading}
                                    // We might want to remove the Card wrapper inside LatestRecommendation to avoid double cards,
                                    // but for now let's keep it as a content block.
                                    // Actually, LatestRecommendation renders a CARD. nesting cards is okay but maybe redundant borders.
                                    // Ideally we refactor LatestRecommendation to be content-only or strip styling.
                                    // For speed, let's keep it, it will look like a "Card within a Dashboard Panel".
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="h-full"
                                >
                                    <RecommendationHistory
                                        recommendations={history}
                                        isLoading={isLoading}
                                    />
                                </motion.div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </BackgroundGradient>
        </div>
    );
}
