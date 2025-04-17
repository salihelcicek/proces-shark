'use client'

import { useState, useRef, useEffect } from 'react'
import ChatInput from './ChatInput'
import MessageList from './MessageList'
import { motion } from 'framer-motion'
import BubbleLayer from '@/components/BubbleLayer'
import { useRouter } from 'next/navigation'
import { checkOrCreateUser } from '../actionts'
import { addChatMessage, getChatHistory} from '@/lib/db/chatHistory'
import MessageCleanupPanel from '@/components/MessageCleanupPanel'

export default function AISharkPage() {
  const [messages, setMessages] = useState<
    { id: number; role: 'user' | 'assistant'; content: string; created_at?: string }[]
  >([])

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Sayfa scroll otomatiği
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // İlk veri çekme
  useEffect(() => {
    const fetchData = async () => {
      const userData = await checkOrCreateUser()
      if (!userData) {
        router.push('/login')
        return
      }

      const history = await getChatHistory(userData.id)
      const formatted = history.map((msg, index) => ({
        id: msg.id || Date.now() + index,
        role: msg.role,
        content: msg.content,
        created_at: msg.created_at,
      }))
      setMessages(formatted)
    }

    fetchData()
  }, [router])

  // Mesaj gönderme
  const handleSend = async (text: string) => {
    if (!text.trim()) return

    const userData = await checkOrCreateUser()
    if (!userData) return

    setIsLoading(true)

    const userMessage = await addChatMessage(userData.id, 'user', text)
    if (userMessage) {
      setMessages((prev) => [...prev, userMessage])
    }

    try {
      const res = await fetch('/api/ai-shark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      })

      const data = await res.json()

      const assistantMessage = await addChatMessage(userData.id, 'assistant', data.response)
      if (assistantMessage) {
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('❌ Hata:', error)

      const fallbackText = '⚠️ Bir hata oluştu, lütfen tekrar deneyin.'
      const fallbackMessage = await addChatMessage(userData.id, 'assistant', fallbackText)
      if (fallbackMessage) {
        setMessages((prev) => [...prev, fallbackMessage])
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Silme sonrası messages'ı güncelle
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMessagesCleared = (filterFn?: (msg: any) => boolean) => {
    if (!filterFn) {
      setMessages([])
    } else {
      setMessages((prev) => prev.filter(filterFn))
    }
  }



  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-3xl mx-auto px-4 pt-10">
      <BubbleLayer />

      <motion.h1
        className="text-3xl font-bold text-center text-sky-500 mb-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        AI-SHARK
      </motion.h1>

      <MessageCleanupPanel onMessagesCleared={handleMessagesCleared} />

      

      <div className="flex-1 overflow-y-auto mb-4">
        <MessageList messages={messages} isLoading={isLoading} />
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} messages={messages} />
    </div>
  )
}
