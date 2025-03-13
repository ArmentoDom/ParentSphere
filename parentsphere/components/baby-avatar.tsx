import { motion } from "framer-motion"
import { Baby } from "lucide-react"

interface BabyAvatarProps {
  name: string
  onClick: () => void
}

export function BabyAvatar({ name, onClick }: BabyAvatarProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center cursor-pointer shadow-lg relative mb-12"
      onClick={onClick}
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="w-28 h-28 bg-white rounded-full flex items-center justify-center"
      >
        <Baby className="w-16 h-16 text-pink-500" />
      </motion.div>
      <motion.div className="absolute -bottom-10 bg-white px-4 py-2 rounded-full shadow-md">
        <p className="text-lg font-bold text-purple-600">{name}</p>
      </motion.div>
    </motion.div>
  )
}

