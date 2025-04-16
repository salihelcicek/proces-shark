// components/BubbleLayer.tsx
"use client"

import { useEffect, useState } from "react"

export default function BubbleLayer() {
  const [bubbles, setBubbles] = useState<
    { id: number; left: string; size: number; delay: number }[]
  >([])

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now()
      const left = `${Math.random() * 100}%`
      const size = Math.floor(Math.random() * 20) + 10
      const delay = Math.random() * 4

      setBubbles((prev) => [...prev, { id, left, size, delay }])

      // Belirli süre sonra kaldır
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== id))
      }, 5000)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {bubbles.map((bubble) => (
        <span
          key={bubble.id}
          className="absolute bottom-0 rounded-full bg-sky-300 opacity-50 animate-bubble"
          style={{
            left: bubble.left,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
