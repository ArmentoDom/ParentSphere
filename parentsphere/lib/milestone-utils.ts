import confetti from "canvas-confetti"

export function celebrateMilestone() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  })
}

export function awardToken(milestoneId: number) {
  // This function would interact with a blockchain or token system
  // For now, we'll just log the award
  console.log(`Token awarded for milestone ${milestoneId}`)
}

