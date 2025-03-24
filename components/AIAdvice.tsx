"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AIAdvice({ mission }) {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState("");

  const generateAdvice = async () => {
    setLoading(true);
    setAdvice("");
  
    const prompt = `Görev adı: ${mission.name}\n\nAçıklama: ${mission.description}\n\nToplam gün: ${mission.total_days}\n\nTamamlanan gün sayısı: ${mission.completed_days}\nAtlanan gün sayısı: ${mission.skipped_days}\n\nKullanıcının bu göreve dair güçlü ve zayıf yönlerini, motivasyon önerilerini detaylı ve destekleyici şekilde açıkla.`;
  
    const res = await fetch("/api/ai-advice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
  
    // 👇👇 Bu kısmı yeni ekliyoruz
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
    <Card className="p-6 mt-6 text-center">
      <h2 className="text-2xl font-bold mb-4">🎯 AI dan Geri Bildirim Al</h2>
      <Button onClick={generateAdvice} disabled={loading} className="w-fit">
        {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "AI Geri Bildirim Al"}
      </Button>
      {advice && (
        <Textarea
          className="mt-4 bg-muted resize-none text-sm"
          value={advice}
          rows={10}
          readOnly
        />
      )}
    </Card>
  );
}
