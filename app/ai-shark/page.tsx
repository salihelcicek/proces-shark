"use client"

import { useState,useRef,useEffect } from "react"
import ChatInput from "./ChatInput"
import MessageList from "./MessageList"
import { motion } from "framer-motion"
import BubbleLayer from "@/components/BubbleLayer"
import { useRouter } from "next/navigation";
import { checkOrCreateUser } from "../actionts";
export default function AISharkPage() {
  const [messages, setMessages] = useState<
    { id: number; role: "user" | "assistant"; content: string }[]
  >([])
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])
  useEffect(() => {
    const fetchData = async () => {

      const userData = await checkOrCreateUser();
      if(!userData) {
        router.push("/login");
        return;
      }
    };

    fetchData();
  }, [router]);

const handleSend = async (text: string) => {
  if (!text.trim()) return;

  const userMessage = { id: Date.now(), role: "user" as const, content: text };
  setMessages((prev) => [...prev, userMessage]);
  setIsLoading(true); // ✅ Başladı

  try {
    const res = await fetch("/api/ai-shark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text }),
    });

    const data = await res.json();

    const assistantMessage = {
      id: Date.now() + 1,
      role: "assistant" as const,
      content: data.response,
    };

    setMessages((prev) => [...prev, assistantMessage]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: "assistant",
        content: "⚠️ Bir hata oluştu, lütfen tekrar deneyin.",
      },
    ]);
  } finally {
    setIsLoading(false); // ✅ Bitti
  }
  
  
      // Hata mesajı
};

  

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-3xl mx-auto px-4 pt-10 ">
      <BubbleLayer></BubbleLayer>
      <motion.h1
        className="text-3xl font-bold text-center text-sky-500 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        AI-SHARK 
      </motion.h1>

      <div className="flex-1 overflow-y-auto mb-4">
        <MessageList messages={messages} isLoading={isLoading} />
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  )
}
