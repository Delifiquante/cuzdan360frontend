import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { MainNavbar } from "@/components/layout/main-navbar";
import Silk from "../components/Silk";
import Demo from "../components/ui/demo"; // Assuming demo.tsx is in components/ui
import { Pricing2 } from "@/components/ui/pricing-cards";
import { HeroSection } from "@/components/Herosection";
import { FeaturesSection } from "@/components/features-section";
// test deneme
export default function Home() {
    return (
        <>
            {/* Sayfa İçeriği */}
            <div className="font-sans text-foreground">
                <MainNavbar />

                {/* Hero Section (DÜZELTİLDİ)
          ÇÖZÜM: 'w-screen left-1/2 -translate-x-1/2' sınıfları eklendi.
          Bu, bölümün 'layout.tsx' içindeki olası bir 'max-w' kısıtlamasından
          "kurtulmasını" ve tüm ekran genişliğini kaplamasını sağlar.
          Orijinal 'min-w-[calc(100vh)]' hatası da kaldırılmıştır.
        */}
                <HeroSection />
                {/* Features Section */}

                <FeaturesSection />

                <section id="pricing" className="py-20 sm:py-32">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <Pricing2 />
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="py-20 sm:py-32">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                                Sıkça Sorulan Sorular
                            </h2>
                        </div>
                        <div className="mt-12 mx-auto max-w-3xl">
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-foreground">
                                        Cüzdan360 nedir?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        Cüzdan360, kişisel ve kurumsal finanslarınızı tek bir
                                        platformdan yönetmenizi sağlayan, bütçe planlaması, harcama
                                        takibi ve finansal analizler sunan bir web uygulamasıdır.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-foreground">
                                        Verilerim güvende mi?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        Evet, verilerinizin güvenliği bizim için en önemli
                                        önceliktir. Tüm verileriniz endüstri standardı şifreleme
                                        yöntemleriyle korunmaktadır.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-foreground">
                                        Hangi planı seçmeliyim?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        Başlangıç için "Ücretsiz" planımızı deneyebilirsiniz. Daha
                                        kapsamlı özellikler için "Bireysel" planımız en popüler
                                        seçenektir. İşletmeler için ise "KOBİ" planımız tüm
                                        ihtiyaçlarınızı karşılayacaktır.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger className="text-foreground">
                                        Mobil uygulamanız var mı?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        Şu an için sadece web uygulaması olarak hizmet veriyoruz.
                                        Ancak mobil uygulamamız geliştirme aşamasındadır ve yakında
                                        kullanıma sunulacaktır.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section id="cta" className="py-20 sm:py-32">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                                    Finansal Özgürlüğe Adım Atın
                                </h2>
                                <p className="mt-6 text-lg text-muted-foreground">
                                    Cüzdan360 ile paranızın kontrolünü elinize alın ve hedeflerinize
                                    daha hızlı ulaşın.
                                </p>
                                <div className="mt-8">
                                    <Link href="/login">
                                        <Button size="lg">Ücretsiz Başlayın</Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <Image
                                    // 'next/image' hatası için 'src' URL'i düzeltildi.
                                    src="https://images.unsplash.com/photo-1559526324-c1f275fbfa32?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="Finansal Özgürlük"
                                    width={500}
                                    height={300}
                                    className="rounded-lg shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-20 sm:py-32">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <Demo />
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-700">
                    <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} Cüzdan360. Tüm hakları saklıdır.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href="#"
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                Gizlilik Politikası
                            </Link>
                            <Link
                                href="#"
                                className="text-sm text-neutral-400 hover:text-white"
                            >
                                Kullanım Şartları
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}