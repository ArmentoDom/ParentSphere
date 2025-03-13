import type { Metadata } from "next"
import { MilestonesTracker } from "@/components/milestones-tracker"
import { Baby } from "lucide-react"

export const metadata: Metadata = {
  title: "Milestones | ParentSphere",
  description: "Track and celebrate your baby's developmental milestones",
}

export default function MilestonesPage() {
  return (
    <div className="container mx-auto px-4 py-12 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-800 mb-4 flex items-center justify-center">
            <Baby className="w-10 h-10 mr-4 text-pink-500" />
            Baby Milestones
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track and celebrate your baby's developmental journey. Record important achievements and create a digital
            memory book of your little one's growth.
          </p>
        </div>
        <div className="text-3xl font-bold text-red-500 mb-4">Test Update</div>
        <MilestonesTracker />
      </div>
    </div>
  )
}

