"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (message.trim() === "") return
    onSend(message)
    setMessage("")
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Mesajınızı yazın..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === "Enter") {
            e.preventDefault()
            handleSend()
            }
        }}
/>

      <Button onClick={handleSend}>Gönder</Button>
    </div>
  )
}
