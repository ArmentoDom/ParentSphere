import { format, subDays } from "date-fns"

interface SleepEntry {
  date: string
  duration: number
}

interface FeedingEntry {
  date: string
  amount: number
  unit: string
}

export function generateSleepInsights(sleepEntries: SleepEntry[]): string {
  if (sleepEntries.length === 0) {
    return "Not enough data to generate insights. Keep tracking your sleep!"
  }

  const averageSleep = sleepEntries.reduce((sum, entry) => sum + entry.duration, 0) / sleepEntries.length
  const lastSleep = sleepEntries[0].duration

  let insight = `Your average sleep duration is ${averageSleep.toFixed(1)} hours. `

  if (lastSleep < averageSleep - 1) {
    insight += "Your last sleep was shorter than your average. Try to get more rest tonight!"
  } else if (lastSleep > averageSleep + 1) {
    insight += "Your last sleep was longer than your average. Great job catching up on rest!"
  } else {
    insight += "Your last sleep was close to your average. Keep up the consistent sleep schedule!"
  }

  return insight
}

export function generateFeedingInsights(feedingEntries: FeedingEntry[]): string {
  if (feedingEntries.length === 0) {
    return "Not enough data to generate insights. Keep tracking your feeding!"
  }

  const averageAmount = feedingEntries.reduce((sum, entry) => sum + entry.amount, 0) / feedingEntries.length
  const lastAmount = feedingEntries[0].amount
  const unit = feedingEntries[0].unit

  let insight = `Your average feeding amount is ${averageAmount.toFixed(1)} ${unit}. `

  if (lastAmount < averageAmount - 1) {
    insight += "Your last feeding was less than your average. Monitor your baby's hunger cues closely."
  } else if (lastAmount > averageAmount + 1) {
    insight += "Your last feeding was more than your average. Your baby might be going through a growth spurt!"
  } else {
    insight += "Your last feeding was close to your average. Consistency is key in feeding patterns!"
  }

  return insight
}

export function generateGeneralInsights(sleepEntries: SleepEntry[], feedingEntries: FeedingEntry[]): string {
  const today = new Date()
  const yesterday = subDays(today, 1)
  const todayString = format(today, "yyyy-MM-dd")
  const yesterdayString = format(yesterday, "yyyy-MM-dd")

  const todaySleep = sleepEntries.find((entry) => entry.date === todayString)
  const yesterdaySleep = sleepEntries.find((entry) => entry.date === yesterdayString)

  const todayFeedings = feedingEntries.filter((entry) => entry.date === todayString)
  const yesterdayFeedings = feedingEntries.filter((entry) => entry.date === yesterdayString)

  let insight = "Here's a general insight based on your recent data: "

  if (todaySleep && yesterdaySleep) {
    const sleepDifference = todaySleep.duration - yesterdaySleep.duration
    if (sleepDifference > 1) {
      insight += "You've slept more today compared to yesterday. This extra rest might positively impact your day. "
    } else if (sleepDifference < -1) {
      insight += "You've slept less today compared to yesterday. Try to maintain a consistent sleep schedule. "
    }
  }

  if (todayFeedings.length > 0 && yesterdayFeedings.length > 0) {
    const todayTotalFeeding = todayFeedings.reduce((sum, entry) => sum + entry.amount, 0)
    const yesterdayTotalFeeding = yesterdayFeedings.reduce((sum, entry) => sum + entry.amount, 0)
    const feedingDifference = todayTotalFeeding - yesterdayTotalFeeding

    if (feedingDifference > 2) {
      insight += "Your baby has eaten more today compared to yesterday. They might be going through a growth spurt. "
    } else if (feedingDifference < -2) {
      insight += "Your baby has eaten less today compared to yesterday. Monitor their appetite and energy levels. "
    }
  }

  if (insight === "Here's a general insight based on your recent data: ") {
    insight = "Keep tracking your sleep and feeding patterns to receive more personalized insights!"
  }

  return insight
}

