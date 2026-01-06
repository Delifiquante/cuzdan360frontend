export interface AIRecommendation {
    id: string;
    date: string; // ISO Date string YYYY-MM-DD
    title: string;
    content: string;
    type: 'saving' | 'investment' | 'debt' | 'general';
    impact?: 'high' | 'medium' | 'low';
}

export const mockRecommendations: AIRecommendation[] = [
    {
        id: '1',
        date: '2024-06-01',
        title: 'Döviz Pozisyonu Uyarısı',
        content: 'Döviz varlıklarınızın toplam portföydeki oranı %60 seviyesini aştı. Kur riskini dengelemek adına portföyünüzün %10\'luk kısmını TL mevduat veya BIST 30 hisse senedi fonlarına kaydırmanız, volatilitenin yüksek olduğu dönemlerde riski azaltmanıza yardımcı olabilir.',
        type: 'investment',
        impact: 'high'
    },
    {
        id: '2',
        date: '2024-05-15',
        title: 'Yüksek Faizli Borç Yapılandırması',
        content: 'Mevcut kredi kartı borcunuzun faiz oranı %4.25 iken, bankanızın sunduğu özel ihtiyaç kredisi faiz oranı %3.50. Mevcut borcu kredi ile kapatarak aylık ödemelerinizde yaklaşık 450 TL avantaj sağlayabilirsiniz.',
        type: 'debt',
        impact: 'medium'
    },
    {
        id: '3',
        date: '2024-05-01',
        title: 'Tasarruf Hedefi Başarısı',
        content: 'Geçen ay belirlediğiniz tasarruf hedefini %15 oranında aştınız! Bu başarıyı sürdürmek ve bileşik getiriden faydalanmak için artan tutarı otomatik olarak "Acil Durum Fonu" hesabınıza aktarmanızı öneririm.',
        type: 'saving',
        impact: 'low'
    },
    {
        id: '4',
        date: '2024-04-20',
        title: 'Gereksiz Abonelik Tespiti',
        content: 'Son 3 aydır Netflix ve Disney+ aboneliklerinizin ikisi de aktif görünmesine rağmen, Disney+ kullanımınız oldukça düşük. İki platform yerine birini aktif tutarak aylık 150 TL tasarruf edebilirsiniz.',
        type: 'saving',
        impact: 'low'
    },
    {
        id: '5',
        date: '2024-04-05',
        title: 'Altın Alım Fırsatı',
        content: 'Altın fiyatlarında son haftadaki %2\'lik geri çekilme, portföy çeşitlendirmesi için bir alım fırsatı oluşturabilir. Varlık dağılımınızda altın oranını %15 seviyesine çıkarmayı düşünebilirsiniz.',
        type: 'investment',
        impact: 'medium'
    }
];

export async function getAIRecommendations(): Promise<AIRecommendation[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockRecommendations;
}
