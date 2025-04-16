"use client"

import { Bot, User } from "lucide-react"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import React from "react"
type Message = {
  id: number
  role: "user" | "assistant"
  content: string
  created_at?: string // gelen veride varsa göster
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
}

function getDateLabel(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()

  const isToday = date.toDateString() === now.toDateString()

  const yesterday = new Date()
  yesterday.setDate(now.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  if (isToday) return "Bugün"
  if (isYesterday) return "Dün"

  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
  })
}


export default function MessageList({ messages, isLoading }: { messages: Message[]; isLoading: boolean }) {

  return (
<div className="space-y-4 overflow-y-auto pb-4">
  {messages.length > 0 && (() => {
    let lastDate = ""
    return messages.map((msg) => {

      const msgDate = msg.created_at ? getDateLabel(msg.created_at) : ""
      const showDateLabel = msgDate !== lastDate
      lastDate = msgDate

      return (
        <React.Fragment key={msg.id}>
          {showDateLabel && msgDate && (
            <div className="text-center text-xs text-gray-400 my-2">
              {msgDate}
            </div>
          )}

          <motion.div
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
              {msg.created_at && (
                <p className="text-[10px] text-black dark:text-white mt-1 text-right">
                  {formatTime(msg.created_at)}
                </p>
              )}
            </div>
            {msg.role === "user" && (
              <User className="mt-1 w-5 h-5 text-sky-500" />
            )}
          </motion.div>
        </React.Fragment>
      )
    })
  })()}

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
