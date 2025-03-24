import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0.7,
      top_p: 1,
      stream: false,
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
    }),
  });

  const data = await response.json();

  const result = data.choices?.[0]?.message?.content;
  console.log(prompt)
  console.log("✅ Deepseek API yanıtı:", data);

  return NextResponse.json({ result: result || "AI yanıtı alınamadı." });
}
