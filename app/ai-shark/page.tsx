"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useMemo } from "react"

export default function AISharkPage() {
  // ⛱ Random bubble positions
  const bubbles = useMemo(() => {
    return Array.from({ length: 10 }, () => ({
      size: Math.random() * 20 + 10, // 10px - 30px
      left: Math.random() * 100, // %
      delay: Math.random() * 10, // s
      duration: Math.random() * 10 + 5, // s
    }))
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-b from-white to-blue-500 dark:from-slate-900 dark:to-black text-center px-4">

      {/* Baloncuklar */}
      {bubbles.map((bubble, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 0.8, y: -400, scale: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: bubble.duration,
            delay: bubble.delay,
            ease: "easeOut",
          }}
          className="absolute bottom-0 bg-white/40 rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* Köpekbalığı */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="w-64 h-64 relative z-10 transition-all"
      >
        <Image
          src="/shark-seeklogo.png"
          alt="AI Shark"
          fill
          style={{ objectFit: "contain" }}
        />
      </motion.div>

      <h1 className="text-4xl mt-6 font-bold text-sky-900 dark:text-sky-100 z-10">
        AIShark Yakında! 🦈
      </h1>
      <p className="mt-2 text-sky-800 dark:text-gray-300 text-sm max-w-md z-10">
        Gelişim sürecinize yapay zeka destekli içgörülerle güç katacağız. Takipte kalın!
      </p>

      {/* SVG Dalga */}
      <div className="absolute bottom-0 w-full">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-40"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="0.5"
            d="M0,224L30,197.3C60,171,120,117,180,122.7C240,128,300,192,360,208C420,224,480,192,540,165.3C600,139,660,117,720,128C780,139,840,181,900,197.3C960,213,1020,203,1080,197.3C1140,192,1200,192,1260,176C1320,160,1380,128,1410,112L1440,96L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  )
}
