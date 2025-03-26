"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Check, Info } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import TrustedByMarquee from "@/components/TrustedByMarquee";

const plans = [
  {
    name: "Starter",
    price: { monthly: 0, yearly: 0 },
    description: "Temel özelliklerle başla.",
    features: [
      { name: "1 Kullanıcı", tip: "Aynı anda sadece bir kişi erişebilir." },
      { name: "1 Mission oluşturma", tip: "Sadece 1 görev oluşturabilirsin." },
      { name: "Günlük ilerleme takibi", tip: "Her gün görevlerini işaretleyebilirsin." },
    ],
    cta: "Başla",
  },
  {
    name: "Pro",
    price: { monthly: 12, yearly: 99 },
    description: "AIShark destekli plan.",
    features: [
      { name: "5 kullanıcıya kadar", tip: "Ekibinle birlikte kullanabilirsin." },
      { name: "Sınırsız mission", tip: "İstediğin kadar görev oluştur." },
      { name: "AI Geri Bildirimleri", tip: "AIShark’tan kişiselleştirilmiş tavsiyeler alırsın." },
      { name: "Detaylı istatistikler", tip: "İlerlemeni grafiklerle analiz et." },
    ],
    cta: "Yükselt",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: { monthly: "Özel", yearly: "Özel" },
    description: "Kurumsal çözümler için özel destek.",
    features: [
      { name: "Sınırsız kullanıcı", tip: "Tüm takımın dahil olabilir." },
      { name: "Takım yönetimi", tip: "Kullanıcı rollerini yönetebilirsin." },
      { name: "AI ile sohbet", tip: "AIShark ile doğrudan etkileşim kur." },
      { name: "Özel destek ve SLA", tip: "Kurumsal destek alırsın." },
    ],
    cta: "İletişime Geç",
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <TooltipProvider>
        
      <div className="min-h-screen bg-background py-20 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-foreground mb-4"
        >
          Fiyat Planları
        </motion.h1>
        <p className="text-muted-foreground text-lg mb-8">
          Kendi kullanım seviyene uygun planı seç!
        </p>

        <div className="flex justify-center mb-10">
          <ToggleGroup
            type="single"
            value={billing}
            onValueChange={(val) => val && setBilling(val as "monthly" | "yearly")}
          >
            <ToggleGroupItem value="monthly">Aylık</ToggleGroupItem>
            <ToggleGroupItem value="yearly">Yıllık</ToggleGroupItem>
          </ToggleGroup>
        </div>
        {/* Currency Toggle (Visual Placeholder) */}
<div className="text-center mt-5 mb-5  ">
  <div className="inline-flex gap-4 border p-2 rounded-lg">
    <button className="text-sm px-3 py-1 rounded bg-sky-500 text-white">USD</button>
    <button className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white">EUR</button>
    <button className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white">TRY</button>
  </div>
</div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
            >
              <Card
                className={clsx(
                  "text-left p-6 border shadow-sm transition-all relative",
                  plan.highlight && "border-sky-500 ring-2 ring-sky-500"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  {billing === "yearly" && plan.name !== "Starter" && (
                    <Badge className="text-xs bg-green-600 ml-1">%15 İndirim</Badge>
                  )}
                </div>

                <p className="text-muted-foreground mb-4">{plan.description}</p>

                <div className="text-4xl font-bold text-foreground mb-6">
                  {typeof plan.price[billing] === "number"
                    ? `$${plan.price[billing]}`
                    : plan.price[billing]}
                  <span className="text-base text-muted-foreground font-medium">
                    {typeof plan.price[billing] === "number" && "/ay"}
                  </span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="flex items-center gap-1">
                        {feat.name}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3 h-3 text-muted-foreground cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent>{feat.tip}</TooltipContent>
                        </Tooltip>
                      </span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full">{plan.cta}</Button>
              </Card>
            </motion.div>
          ))}
        </div>

        

{/* Plan Comparison Table */}
<div className="mt-20 max-w-5xl mx-auto">
  <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">Plan Karşılaştırması</h2>
  <div className="overflow-auto rounded-lg shadow">
    <table className="min-w-full bg-white dark:bg-gray-900 text-sm">
      <thead>
        <tr>
          <th className="text-center p-4">Özellik</th>
          <th className="text-center p-4">Starter</th>
          <th className="text-center p-4">Pro</th>
          <th className="text-center p-4">Enterprise</th>
        </tr>
      </thead>
      <tbody className="dark:text-gray-200">
        <tr className="border-t hover:bg-slate-100 dark:hover:bg-slate-800 ">
          <td className="p-4 font-medium">AI Shark Tavsiyesi</td>
          <td className="text-center">❌</td>
          <td className="text-center">✅</td>
          <td className="text-center">✅</td>
        </tr>
        <tr className="border-t hover:bg-slate-100 dark:hover:bg-slate-800">
          <td className="p-4 font-medium">Kullanıcı Sayısı</td>
          <td className="text-center">1</td>
          <td className="text-center">5</td>
          <td className="text-center">Sınırsız</td>
        </tr>
        <tr className="border-t hover:bg-slate-100 dark:hover:bg-slate-800">
          <td className="p-4 font-medium">Detaylı Grafikler</td>
          <td className="text-center">❌</td>
          <td className="text-center">✅</td>
          <td className="text-center">✅</td>
        </tr>
        <tr className="border-t hover:bg-slate-100 dark:hover:bg-slate-800">
          <td className="p-4 font-medium">Öncelikli Destek</td>
          <td className="text-center">❌</td>
          <td className="text-center">❌</td>
          <td className="text-center">✅</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<div className="mt-20">
    <TrustedByMarquee />
 </div>
      </div>
      
    </TooltipProvider>
  );


}
