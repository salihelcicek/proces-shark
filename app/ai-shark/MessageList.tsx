"use client"

import { Bot, User } from "lucide-react"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
type Message = {
  id: number
  role: "user" | "assistant"
  content: string
}

export default function MessageList({ messages, isLoading }: { messages: Message[]; isLoading: boolean }) {

  return (
    <div className="space-y-4 overflow-y-auto pb-4">
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          className={`flex gap-3 items-start ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, type: "spring" }}

        >
          {msg.role === "assistant" && (
            <Bot className="mt-1 w-5 h-5 text-sky-500" />
          )}
          <div
            className={`rounded-lg px-4 py-2 max-w-xs text-sm shadow ${
              msg.role === "user"
                ? "bg-sky-500 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
          {msg.role === "user" && (
            <User className="mt-1 w-5 h-5 text-sky-500" />
          )}
        </motion.div>
      ))}

        {isLoading && (
          <motion.div
            className="flex gap-3 items-start justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Bot className="mt-1 w-5 h-5 text-sky-500" />
            <div className="rounded-lg px-4 py-2 max-w-xs text-sm shadow bg-muted text-muted-foreground animate-pulse">
              AI Shark düşünüyor...
            </div>
          </motion.div>
        )}


      
    </div>
  )
}
