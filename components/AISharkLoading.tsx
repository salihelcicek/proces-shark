"use client";

import { motion } from "framer-motion";

export default function AISharkLoading() {
  return (
    <div className="flex flex-col items-center justify-center my-6 space-y-4">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-6xl"
      >
        🦈
      </motion.div>
      <motion.div
  initial={{ x: "-100%" }}
  animate={{ x: "100%" }}
  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
  className="w-1/9 max-w-md h-3 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400 rounded-full shadow-md"
></motion.div>

      <p className="text-sm italic text-muted-foreground">
        AIShark suyun altında düşünmeye başladı...
      </p>
    </div>
  );
}
