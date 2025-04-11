import { NextRequest, NextResponse } from "next/server";
// import deepseek from "@/lib/ai"; - Temporarily commented out

export async function POST(req: NextRequest) {
  try {
    // Get prompt from request
    const { prompt } = await req.json();
    console.log("✅ AI Prompt received:", prompt);
    
    // Return a placeholder message
    return NextResponse.json({ 
      result: "🚧 **AI Tavsiye Özelliği Çok Yakında!**\n\n" + 
        "Bu özellik şu anda geliştirme aşamasındadır ve yakında etkinleştirilecektir. " +
        "Görev istatistiklerinize dayalı kişiselleştirilmiş geri bildirim ve motivasyon önerileri almak için takipte kalın!"
    });

    /* Temporarily disabled AI functionality
    const response = await deepseek.createChatCompletion({
      model: "deepseek-chat",
      temperature: 0.7,
      top_p: 1,
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: "Sen bir koçsun. Görev istatistiklerine göre destekleyici, yapıcı ve motive edici geri bildirimler ver.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = response.choices?.[0]?.message?.content;
    console.log("✅ AI Prompt:", prompt);
    console.log("✅ AI Response:", result);

    return NextResponse.json({ result: result || "AI yanıtı alınamadı." });
    */
  } catch (error: unknown) {
    console.error("❌ AI API Error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "AI servisi şu anda kullanılamıyor." },
      { status: 500 }
    );
  }
}
