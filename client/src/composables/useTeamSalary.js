//src/composables/useTeamSalary.js
import { ref, computed } from 'vue'

export function useTeamSalary() {
  // Constants for 2023-24 NBA season
  const SALARY_CAP = 136021000
  const LUXURY_TAX = 165294000
  const TAX_APRON = 172346000
  const HARD_CAP = TAX_APRON

  // Cache for team salary calculations
  const salaryCache = ref(new Map())

  // Calculate total team salary including all types of contracts
  const calculateTeamSalary = (teamId, roster) => {
    let totalSalary = 0
    let guaranteedSalary = 0
    let nonGuaranteedSalary = 0
    let deadCap = 0

    roster.forEach((player) => {
      if (player.contractType === 'guaranteed') {
        guaranteedSalary += player.salary
      } else if (player.contractType === 'non-guaranteed') {
        nonGuaranteedSalary += player.salary
      } else if (player.contractType === 'dead-cap') {
        deadCap += player.salary
      }
      totalSalary += player.salary
    })

    const salaryInfo = {
      total: totalSalary,
      guaranteed: guaranteedSalary,
      nonGuaranteed: nonGuaranteedSalary,
      deadCap,
      capSpace: Math.max(0, SALARY_CAP - totalSalary),
      luxuryTaxSpace: Math.max(0, LUXURY_TAX - totalSalary),
      hardCapSpace: Math.max(0, HARD_CAP - totalSalary),
      isOverCap: totalSalary > SALARY_CAP,
      isOverTax: totalSalary > LUXURY_TAX,
      isOverApron: totalSalary > TAX_APRON,
    }

    // Cache the calculation
    salaryCache.value.set(teamId, salaryInfo)
    return salaryInfo
  }

  // Get team salary info (from cache if available)
  const getTeamSalaryInfo = (teamId, roster) => {
    if (salaryCache.value.has(teamId)) {
      return salaryCache.value.get(teamId)
    }
    return calculateTeamSalary(teamId, roster)
  }

  // Calculate luxury tax payment
  const calculateLuxuryTax = (teamSalary) => {
    if (teamSalary <= LUXURY_TAX) return 0

    const excessSalary = teamSalary - LUXURY_TAX
    let taxAmount = 0

    // Tax brackets (simplified version)
    const brackets = [
      { threshold: 5000000, rate: 1.5 },
      { threshold: 10000000, rate: 1.75 },
      { threshold: 15000000, rate: 2.5 },
      { threshold: 20000000, rate: 3.25 },
      { threshold: Infinity, rate: 3.75 },
    ]

    let remainingExcess = excessSalary
    let currentThreshold = 0

    for (const bracket of brackets) {
      const bracketSize = bracket.threshold - currentThreshold
      const amountInBracket = Math.min(remainingExcess, bracketSize)

      if (amountInBracket <= 0) break

      taxAmount += amountInBracket * bracket.rate
      remainingExcess -= amountInBracket
      currentThreshold = bracket.threshold
    }

    return taxAmount
  }

  // Project future salary commitments
  const projectFutureSalaries = (roster, years = 5) => {
    const projections = []

    for (let year = 0; year < years; year++) {
      const yearSalary = roster.reduce((total, player) => {
        if (year < player.contractYears) {
          // Apply any raises or contract options
          const yearlyIncrease = player.yearlyIncrease || 0
          return total + player.salary * Math.pow(1 + yearlyIncrease, year)
        }
        return total
      }, 0)

      projections.push({
        year: new Date().getFullYear() + year,
        salary: yearSalary,
        capSpace: SALARY_CAP - yearSalary, // Simplified, actual cap will change
      })
    }

    return projections
  }

  // Check if trade creates hard cap
  const checkHardCapTriggers = (incomingPlayers) => {
    return incomingPlayers.some(
      (player) => player.signAndTrade || player.taxpayerMLE || player.biAnnual,
    )
  }

  return {
    calculateTeamSalary,
    getTeamSalaryInfo,
    calculateLuxuryTax,
    projectFutureSalaries,
    checkHardCapTriggers,
    SALARY_CAP,
    LUXURY_TAX,
    TAX_APRON,
    HARD_CAP,
  }
}
