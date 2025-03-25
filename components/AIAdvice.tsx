"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import AISharkLoading from "./AISharkLoading";

export default function AIAdvice({ mission }) {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState("");

  const generateAdvice = async () => {
    setLoading(true);
    setAdvice("");

    const prompt = `Görev adı: ${mission.name}\n\nAçıklama: ${mission.description}\n\nToplam gün: ${mission.total_days}\n\nTamamlanan gün sayısı: ${mission.completed_days}\nAtlanan gün sayısı: ${mission.skipped_days}\n\nKullanıcının bu göreve dair güçlü ve zayıf yönlerini, motivasyon önerilerini detaylı ve destekleyici şekilde açıkla gerekli satır boşlukları ve emojilerle okuması keyifli olsun.`;

    const res = await fetch("/api/ai-advice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ API hatası:", res.status, errorText);
      setAdvice(`API hatası: ${res.status}\n${errorText}`);
      setLoading(false);
      return;
    }

    const data = await res.json();
    console.log("✅ API cevabı:", data);
    setAdvice(data.result);
    setLoading(false);
  };

  return (
    <Card className="p-6 mt-6 text-center w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-sky-500">🎯 AI-Shark'dan geri bildirim al </h2>
      {loading ? (
  <AISharkLoading />
) : (
  <Button onClick={generateAdvice} className="w-fit mx-auto">
    AIShark'dan tavsiye al
  </Button>
)}


      {advice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <div className="relative mt-6 p-4 border rounded-md bg-muted/40 prose dark:prose-invert max-w-none text-left">
            <ReactMarkdown>{advice}</ReactMarkdown>
          </div>

          <div className="text-center mt-4">
            <Button variant="outline" onClick={generateAdvice}>
              Yeniden Sor
            </Button>
          </div>
        </motion.div>
      )}
    </Card>
  );
}
