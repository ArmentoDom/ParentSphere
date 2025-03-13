"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain, Loader2 } from "lucide-react"
import { findRelevantFAQ } from "@/lib/baby-care-knowledge"

const API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill"

export function HuggingFaceAI() {
  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      setError(null)

      // Check if we have a relevant FAQ answer
      const faqAnswer = findRelevantFAQ(input)
      if (faqAnswer) {
        setResponse(faqAnswer)
        setIsLoading(false)
        setInput("")
        return
      }

      try {
        // Pre-process the input
        const processedInput = `As an AI assistant specializing in baby care and parenting, please answer the following question: ${input}`

        const apiToken = process.env.NEXT_PUBLIC_HUGGING_FACE_API_TOKEN
        if (!apiToken) {
          throw new Error("Hugging Face API token is not configured")
        }

        const result = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`,
          },
          body: JSON.stringify({ inputs: processedInput }),
        })

        if (!result.ok) {
          throw new Error(`API request failed with status ${result.status}`)
        }

        const data = await result.json()

        // Post-process the response
        const processedResponse = postProcessResponse(data[0]?.generated_text || "I'm not sure how to answer that.")
        setResponse(processedResponse)
      } catch (error: any) {
        console.error("Error fetching from Hugging Face:", error)
        setError(error.message || "An unexpected error occurred")
        setResponse("I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later!")
      }

      setIsLoading(false)
      setInput("")
    },
    [input],
  )

  const postProcessResponse = (rawResponse: string) => {
    // Remove any mentions of being an AI language model
    let processed = rawResponse.replace(/As an AI language model,?/gi, "")

    // Add a friendly touch
    processed = "Here's what I know about that: " + processed

    return processed.trim()
  }

  return (
    <Card className="backdrop-blur-lg bg-white/10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white flex items-center">
          <Brain className="w-6 h-6 mr-2 text-indigo-300" />
          Sphere AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Sphere AI about baby care..."
            className="bg-white/20 text-white placeholder-white/50"
          />
          <Button type="submit" className="bg-white text-indigo-600 hover:bg-indigo-100" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Thinking...
              </>
            ) : (
              "Ask Sphere"
            )}
          </Button>
        </form>
        {error && (
          <div className="mt-4 p-4 bg-red-100/20 rounded-md">
            <p className="text-red-300">{error}</p>
          </div>
        )}
        {response && !error && (
          <div className="mt-4 p-4 bg-white/20 rounded-md">
            <p className="text-white">{response}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

