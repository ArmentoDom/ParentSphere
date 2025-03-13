import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface InfoCardProps {
  icon: LucideIcon
  title: string
  value: string
  subValue: string
  color: string
  onClick: () => void
}

export function InfoCard({ icon: Icon, title, value, subValue, color, onClick }: InfoCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`bg-white rounded-2xl p-6 shadow-lg cursor-pointer ${color}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{subValue}</p>
        </div>
      </div>
    </motion.div>
  )
}

