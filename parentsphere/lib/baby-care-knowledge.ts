export const babyCareFAQ = [
  {
    question: "How often should I feed my newborn?",
    answer:
      "Newborns typically need to be fed every 2-3 hours, or 8-12 times in a 24-hour period. This frequency may decrease as they grow older.",
  },
  {
    question: "When can I start sleep training my baby?",
    answer:
      "Most pediatricians recommend starting sleep training when your baby is between 4 and 6 months old. However, every baby is different, so it's best to consult with your pediatrician.",
  },
  {
    question: "How many diapers does a newborn use in a day?",
    answer: "On average, newborns go through 8-12 diapers per day. This number may decrease as they grow older.",
  },
  {
    question: "When should I start introducing solid foods?",
    answer:
      "The American Academy of Pediatrics recommends introducing solid foods around 6 months of age, while continuing to breastfeed or formula feed.",
  },
  {
    question: "How can I soothe a teething baby?",
    answer:
      "You can soothe a teething baby by gently rubbing their gums with a clean finger, offering a cold teething ring, or using over-the-counter pain relievers recommended by your pediatrician.",
  },
]

export function findRelevantFAQ(query: string): string | null {
  const lowercaseQuery = query.toLowerCase()
  for (const faq of babyCareFAQ) {
    if (lowercaseQuery.includes(faq.question.toLowerCase())) {
      return faq.answer
    }
  }
  return null
}

