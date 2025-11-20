
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { analyzeRates } from "@/app/dashboard/exchange-rates/actions";
import { Loader2, Newspaper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BackgroundGradient } from "../ui/background-gradient";

const formSchema = z.object({
  marketData: z.string().min(10, "Piyasa verileri gereklidir."),
  newsArticles: z.string().min(10, "Haber makaleleri gereklidir."),
  userPreferences: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type Recommendations = string[];

const defaultMarketData = `USD/EUR: 0.92 (-0.5% 24s), GBP/USD: 1.27 (+0.2% 24s), USD/JPY: 157.10 (-0.1% 24s). Federal Rezerv, 2024'ün 4. çeyreğinde potansiyel faiz indirimlerine işaret ederken, AMB şahin duruşunu koruyor.`;
const defaultNewsArticles = `1. "Alman Sanayi Üretiminin Beklenmedik Düşüşüyle Euro Değer Kaybetti."\n2. "İngiltere Bankası Enflasyon Endişeleri Ortasında Faiz Oranlarını Sabit Tuttu."\n3. "Yen, Dolar Karşısında 157'yi Geçerek Zayıfladı, Müdahale Beklentisi Devam Ediyor."`;

export function RecommendationsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marketData: defaultMarketData,
      newsArticles: defaultNewsArticles,
      userPreferences: "Kısa vadeli forex ticaret fırsatları ve uzun vadeli döviz değeri yatırımlarıyla ilgileniyorum.",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    const result = await analyzeRates(data);

    if (result.success && result.data) {
      setRecommendations(result.data.recommendations);
    } else {
      setError(result.error || "Bilinmeyen bir hata oluştu.");
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="marketData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Piyasa Verileri</FormLabel>
                <FormControl>
                  <Textarea placeholder="Mevcut piyasa verilerini girin..." {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newsArticles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Haber Makaleleri</FormLabel>
                <FormControl>
                  <Textarea placeholder="Son haber makalelerini girin..." {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userPreferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kullanıcı Tercihleri (İsteğe Bağlı)</FormLabel>
                <FormControl>
                  <Textarea placeholder="ör. Gelişmekte olan piyasalarla ilgileniyorum..." {...field} rows={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analiz Ediliyor...
              </>
            ) : (
              "Önerileri Al"
            )}
          </Button>
        </form>
      </Form>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recommendations && (
        <BackgroundGradient className="rounded-lg mt-6" animate={false}>
          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Önerilen Okumalar</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Newspaper className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </BackgroundGradient>
      )}
    </div>
  );
}
