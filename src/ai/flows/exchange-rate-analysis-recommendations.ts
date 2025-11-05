'use server';
/**
 * @fileOverview Provides personalized recommendations for financial news related to exchange rate opportunities.
 *
 * - getExchangeRateRecommendations - A function that returns financial news recommendations based on market analysis.
 * - ExchangeRateRecommendationsInput - The input type for the getExchangeRateRecommendations function.
 * - ExchangeRateRecommendationsOutput - The return type for the getExchangeRateRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExchangeRateRecommendationsInputSchema = z.object({
  marketData: z.string().describe('Current market data related to exchange rates.'),
  newsArticles: z.string().describe('Recent news articles about financial markets.'),
  userPreferences: z.string().optional().describe('Optional user preferences for financial news.'),
});
export type ExchangeRateRecommendationsInput = z.infer<typeof ExchangeRateRecommendationsInputSchema>;

const ExchangeRateRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.string().describe('A list of personalized news article recommendations.')
  ).describe('List of financial news recommendations'),
});
export type ExchangeRateRecommendationsOutput = z.infer<typeof ExchangeRateRecommendationsOutputSchema>;

export async function getExchangeRateRecommendations(
  input: ExchangeRateRecommendationsInput
): Promise<ExchangeRateRecommendationsOutput> {
  return exchangeRateRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'exchangeRateRecommendationsPrompt',
  input: {schema: ExchangeRateRecommendationsInputSchema},
  output: {schema: ExchangeRateRecommendationsOutputSchema},
  prompt: `You are an AI assistant specializing in providing financial news recommendations based on exchange rate opportunities.

  Analyze the provided market data and recent news articles to identify potential opportunities.
  Consider the user preferences, if provided, to tailor the recommendations.

  Market Data: {{{marketData}}}
  News Articles: {{{newsArticles}}}
  User Preferences: {{{userPreferences}}}

  Based on this information, provide a list of personalized news article recommendations related to exchange rate opportunities.
  Format the output as a JSON array of strings.`,
});

const exchangeRateRecommendationsFlow = ai.defineFlow(
  {
    name: 'exchangeRateRecommendationsFlow',
    inputSchema: ExchangeRateRecommendationsInputSchema,
    outputSchema: ExchangeRateRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
