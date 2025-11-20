"use server";

import {
  getExchangeRateRecommendations,
  type ExchangeRateRecommendationsInput,
} from "@/ai/flows/exchange-rate-analysis-recommendations";

export async function analyzeRates(input: ExchangeRateRecommendationsInput) {
  try {
    const result = await getExchangeRateRecommendations(input);
    if (!result || !result.recommendations) {
      return { success: false, error: "AI failed to generate recommendations." };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error("Error getting exchange rate recommendations:", error);
    return { success: false, error: "An unexpected error occurred while analyzing data." };
  }
}
