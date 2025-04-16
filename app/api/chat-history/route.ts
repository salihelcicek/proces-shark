import { addChatMessage } from "@/lib/db/chatHistory"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { user_id, role, content } = body

    if (!user_id || !role || !content) {
      return NextResponse.json({ error: "Eksik veri gönderildi." }, { status: 400 })
    }

    const result = await addChatMessage(user_id, role, content)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("❌ Chat history API hatası:", error)
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 })
  }
}
