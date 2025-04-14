"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Rocket, Target, Smile, Lightbulb, HelpCircle, NotebookPen, UserPen } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

const steps = [
  {
    title: "1. Giriş Yap veya Kayıt Ol",
    description: "Platformu kullanmaya başlamak için Google ile giriş yap veya yeni bir hesap oluştur. Kolay ve hızlı bir şekilde başla!",
    icon: <Rocket className="w-8 h-8 text-sky-500" />,
  },
  {
    title: "2. Yeni Mission Oluştur",
    description: "Hedeflerini belirle, gün sayısını gir ve kişisel görevini oluştur. Planlamaya buradan başla!",
    icon: <Target className="w-8 h-8 text-green-500" />,
  },
  {
    title: "3. Günlük İlerlemeni Kaydet",
    description: "Her gün görevini tamamladıkça durumu 'tamamlandı', 'atlandı' ya da 'beklemede' olarak işaretle. Progress bar ile motivasyonunu koru!",
    icon: <CheckCircle className="w-8 h-8 text-yellow-500" />,
  },
  {
    title: "4. AIShark'tan Destek Al",
    description: "Yapay zekadan motivasyon ve kişisel geri bildirim alarak gelişimini analiz et! İkinci bir gözden gelişimini yorumlat.🦈",
    icon: <Smile className="w-8 h-8 text-purple-500" />,
  },
  {
    title: "5. Toplulukla Paylaşım Yap",
    description: "Blog sistemini kullanarak deneyimlerini, fikirlerini veya ilerlemeni paylaş. Diğer kullanıcılarla etkileşim kur!",
    icon: <NotebookPen className="w-8 h-8 text-orange-500" />,
  },
  {
    title: "6. Profilini Görüntüle ve İstatistiklerini Takip et",
    description: "Kendi profil sayfandan oluşturduğun görevleri, yazdığın blogları ve toplam beğeni sayını takip et. Gelişimini görselleştir, daha fazlası için motive ol!",
    icon: <UserPen className="w-8 h-8 text-pink-500" />,
  }
];

const tips = [
  "Her gün tamamladığın görevi işaretlemeyi unutma!",
  "AIShark’ı belirli aralıklarla kullanarak gelişimini analiz et.",
  "Mission günlerini fazla uzun tutma, 7-21 gün idealdir.",
  "Kısa vadeli hedefler koy, başarı hissini erken tat.",
  "Hedeflerini görünür bir yerde tut, motivasyonun artsın.",
  "Progress bar'ı haftada en az bir kere % artırmak hedefin olsun.",
  "Görevlerine renkli etiketler koyarak öncelik sırasına al.",
  "Blog sistemine katkıda bulun, yazdıkça gelişirsin!",
  "Yorum yaparak topluluğun bir parçası ol. 🤝",
  "Blog başlıklarını etkileyici seç, daha çok okunur!",
];

const faqs = [
  {
    q: "AIShark ne işe yarar?",
    a: "AIShark, görev analizine göre motivasyonel geri bildirimler sunar. Güçlü ve zayıf yönlerine göre öneriler verir.",
  },
  {
    q: "Görev günlerini kaçırırsam ne olur?",
    a: "Atlanan günler ‘skipped’ olarak işaretlenir. Bu da analizlerde değerlendirilir, ama moralini bozma!",
  },
  {
    q: "Progress Bar nasıl güncelleniyor?",
    a: "Görev günlerinin statüsü değiştikçe progress otomatik olarak artar veya sabit kalır.",
  },
  {
    q: "AI önerileri ücretsiz mi?",
    a: "Evet, DeepSeek üzerinden alınan öneriler ücretsizdir ve sınırsız şekilde kullanılabilir.",
  },
  {
    q: "Gerçek zamanlı (realtime) güncellemeler var mı?",
    a: "Evet! Görev ekleme, güncelleme ve AI analizleri gerçek zamanlı olarak anında yansıtılır.",
  },
  {
    q: "Blog sisteminde ne paylaşabilirim?",
    a: "Görevlerle ilgili deneyimlerini, motivasyonel yazılarını veya topluluğa yönelik her türlü katkıyı paylaşabilirsin.",
  },
  {
    q: "Yorum sisteminde anonimlik var mı?",
    a: "Hayır, yorumlar kullanıcı hesabınıza bağlıdır ve herkes tarafından görülebilir.",
  },
  {
    q: "Blogları kimler görebilir?",
    a: "Tüm kayıtlı kullanıcılar tüm blogları görebilir, beğeni ve yorum yapabilir.",
  },
  {
    q: "Mobil cihazlarda çalışıyor mu?",
    a: "Evet! Tüm bileşenler mobil uyumlu ve responsive olarak tasarlanmıştır.",
  },
];

export default function GuidelinePage() {
  const [openTip, setOpenTip] = useState<number | null>(null);

  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-b from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-5xl mx-auto text-center space-y-10">

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-sky-600 dark:text-sky-400"
        >
          ProcessShark Kullanım Kılavuzu
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-600 dark:text-gray-300 text-lg"
        >
          Hedeflerine adım adım ulaşmak için seni yönlendirecek basit bir rehber.
        </motion.p>

        <div className="grid gap-6 md:grid-cols-2 justify-center">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-6 text-left hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900">
                <div className="flex items-center gap-4 mb-4">
                  {step.icon}
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">{step.title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tips */}
        <div className="text-left mt-16 dark:bg-gray-900 p-6 rounded-lg shadow-md w-full">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <Lightbulb className="w-6 h-6" /> İpuçları ve Öneriler
          </h2>
          <div className="space-y-4">
            {tips.map((tip, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
              >
                <div
                  onClick={() => setOpenTip(openTip === idx ? null : idx)}
                  className={clsx(
                    "cursor-pointer p-4 rounded-lg border transition-all duration-300",
                    openTip === idx
                      ? "bg-sky-100 dark:bg-sky-900 text-black dark:text-white"
                      : "bg-muted/40 hover:bg-muted"
                  )}
                >
                  <p className="font-medium">
                    {tip}
                  </p>
                  {openTip === idx && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {`✨ Bu ipucunu uygulamak seni bir adım öne taşır!`}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 text-left">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <HelpCircle className="w-6 h-6" /> Sıkça Sorulan Sorular
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem value={`faq-${idx}`} key={idx}>
                <AccordionTrigger className="text-left text-base">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <Link href="/pricing">
            <Button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 text-lg shadow-md">
              Fiyatlandırmalarımıza Göz At!
            </Button>
          </Link>

          <Link href="/about-blog">
            <Button variant="outline" className="hover:border-sky-500">
              Bloglara Göz At
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
