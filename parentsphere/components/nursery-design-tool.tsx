"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Wand2, PaintBucket, Info, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function NurseryDesignTool() {
  const [roomImage, setRoomImage] = useState<File | null>(null)
  const [preferences, setPreferences] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setRoomImage(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomImage || !preferences) return

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", roomImage)
      formData.append("preferences", preferences)

      const response = await fetch("/api/generate-nursery", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate nursery design")
      }

      setGeneratedImage(data.output_url)
    } catch (error) {
      console.error("Error generating nursery design:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <Card className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
            <CardTitle className="text-4xl font-bold flex items-center gap-4">
              <PaintBucket className="w-10 h-10" />
              AI Nursery Design Tool
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="room-image" className="text-lg font-semibold text-purple-700">
                      Upload Room Image
                    </Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        id="room-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Label
                        htmlFor="room-image"
                        className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-purple-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-purple-500 focus:outline-none"
                      >
                        <span className="flex items-center space-x-2">
                          <Upload className="w-6 h-6 text-purple-500" />
                          <span className="font-medium text-purple-600">
                            {roomImage ? roomImage.name : "Click to upload image"}
                          </span>
                        </span>
                      </Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferences" className="text-lg font-semibold text-purple-700">
                      Design Preferences
                    </Label>
                    <Textarea
                      id="preferences"
                      value={preferences}
                      onChange={(e) => setPreferences(e.target.value)}
                      placeholder="Describe your ideal nursery design (e.g., color scheme, theme, specific items)"
                      className="h-40 bg-white/50 border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="text-purple-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Upload a clear image of your room and describe your preferences in detail for best results.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button
                      type="submit"
                      disabled={!roomImage || !preferences || isLoading}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-6 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating AI Design...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          Generate AI Nursery Design
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col justify-center"
              >
                <AnimatePresence>
                  {generatedImage && (
                    <motion.div
                      key="generated-image"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white p-4 rounded-lg shadow-lg"
                    >
                      <h3 className="text-2xl font-semibold mb-4 text-purple-700">Your AI-Generated Nursery Design</h3>
                      <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                        <img
                          src={generatedImage || "/placeholder.svg"}
                          alt="AI-generated nursery design"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="mt-4 text-gray-600 italic">
                        This is an AI-generated design based on your preferences. Feel free to generate more designs or
                        refine your preferences for different results.
                      </p>
                    </motion.div>
                  )}
                  {!generatedImage && (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-purple-100 rounded-lg p-8 text-center"
                    >
                      <PaintBucket className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold text-purple-700 mb-2">Ready to Design Your Nursery?</h3>
                      <p className="text-purple-600">
                        Upload a room image and describe your preferences to see the magic happen!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </CardContent>
        </Card>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </motion.div>
    </div>
  )
}

