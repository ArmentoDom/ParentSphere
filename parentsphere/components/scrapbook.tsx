"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, ImageIcon, Smile, Calendar, ChevronLeft, ChevronRight } from "lucide-react"

interface ScrapbookEntry {
  id: string
  date: string
  title: string
  description: string
  imageUrl: string
}

const placeholderEntries: ScrapbookEntry[] = [
  {
    id: "1",
    date: "2023-06-01",
    title: "First Smile",
    description: "Today, our little one smiled for the first time! It was the most heartwarming moment.",
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "2",
    date: "2023-06-15",
    title: "Rolling Over",
    description: "Milestone achieved! Our baby rolled over for the first time during tummy time.",
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "3",
    date: "2023-07-01",
    title: "First Words",
    description: "We heard 'Mama' today! It's official, our baby is talking!",
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
]

export function Scrapbook() {
  const [entries, setEntries] = useState<ScrapbookEntry[]>(placeholderEntries)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const [newEntry, setNewEntry] = useState<Partial<ScrapbookEntry>>({
    date: format(new Date(), "yyyy-MM-dd"),
    title: "",
    description: "",
    imageUrl: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewEntry((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newEntry.date && newEntry.title && newEntry.description) {
      const entry: ScrapbookEntry = {
        id: Date.now().toString(),
        date: newEntry.date,
        title: newEntry.title,
        description: newEntry.description,
        imageUrl: newEntry.imageUrl || "/placeholder.svg?height=300&width=400",
      }
      setEntries((prev) => [...prev, entry])
      setNewEntry({
        date: format(new Date(), "yyyy-MM-dd"),
        title: "",
        description: "",
        imageUrl: "",
      })
      setIsAdding(false)
    }
  }

  const nextEntry = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % entries.length)
  }

  const prevEntry = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + entries.length) % entries.length)
  }

  return (
    <div className="space-y-8">
      <Card className="backdrop-blur-lg bg-white/10">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white flex items-center justify-between">
            <span>Digital Scrapbook</span>
            <Button
              variant="outline"
              size="icon"
              className="text-white border-white hover:bg-white/20"
              onClick={() => setIsAdding(!isAdding)}
            >
              <PlusCircle className="h-6 w-6" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.form
                key="add-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="text-white">
                      Date
                    </Label>
                    <Input
                      type="date"
                      id="date"
                      name="date"
                      value={newEntry.date}
                      onChange={handleInputChange}
                      required
                      className="bg-white/20 text-white placeholder-white/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title" className="text-white">
                      Title
                    </Label>
                    <Input
                      type="text"
                      id="title"
                      name="title"
                      value={newEntry.title}
                      onChange={handleInputChange}
                      required
                      className="bg-white/20 text-white placeholder-white/50"
                      placeholder="Milestone or moment"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newEntry.description}
                    onChange={handleInputChange}
                    required
                    className="bg-white/20 text-white placeholder-white/50"
                    placeholder="Describe this special moment..."
                  />
                </div>
                <div>
                  <Label htmlFor="imageUrl" className="text-white">
                    Image URL (optional)
                  </Label>
                  <Input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={newEntry.imageUrl}
                    onChange={handleInputChange}
                    className="bg-white/20 text-white placeholder-white/50"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <Button type="submit" className="bg-white text-indigo-600 hover:bg-indigo-100">
                  Add Memory
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="scrapbook-display"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[4/3] overflow-hidden rounded-xl"
              >
                <img
                  src={entries[currentIndex].imageUrl || "/placeholder.svg"}
                  alt={entries[currentIndex].title}
                  className="absolute inset-0 object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{entries[currentIndex].title}</h3>
                  <p className="text-sm mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {format(new Date(entries[currentIndex].date), "MMMM d, yyyy")}
                  </p>
                  <p className="text-sm">{entries[currentIndex].description}</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white border-white hover:bg-white/20"
                  onClick={prevEntry}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white border-white hover:bg-white/20"
                  onClick={nextEntry}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-lg bg-white/10 cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-4">
                <img
                  src={entry.imageUrl || "/placeholder.svg"}
                  alt={entry.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h4 className="text-lg font-semibold text-white mb-2">{entry.title}</h4>
                <p className="text-sm text-indigo-200 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(new Date(entry.date), "MMMM d, yyyy")}
                </p>
                <p className="text-sm text-indigo-100 line-clamp-2">{entry.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

