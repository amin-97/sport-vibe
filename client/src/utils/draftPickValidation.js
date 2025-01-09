// src/utils/draftPickValidation.js
const MAX_FUTURE_YEARS = 7

export const draftPickValidation = {
  // Validate draft pick years
  validatePickYears(picks) {
    const currentYear = new Date().getFullYear()
    const errors = []

    picks.forEach((pick) => {
      if (pick.year < currentYear) {
        errors.push(`Invalid year for draft pick: ${pick.year}`)
      }
      if (pick.year > currentYear + MAX_FUTURE_YEARS) {
        errors.push(`Cannot trade picks more than ${MAX_FUTURE_YEARS} years in the future`)
      }
    })

    return errors
  },

  // Validate Stepien Rule (must have a first-round pick every other year)
  validateStepienRule(teamId, existingPicks, tradedOutPicks, tradedInPicks) {
    const errors = []
    const currentYear = new Date().getFullYear()

    // Combine existing and traded picks
    const allPicks = new Map()

    // Add existing picks
    existingPicks.forEach((pick) => {
      if (pick.round === 'First Round') {
        allPicks.set(pick.year, pick)
      }
    })

    // Remove traded out picks
    tradedOutPicks.forEach((pick) => {
      if (pick.round === 'First Round') {
        allPicks.delete(pick.year)
      }
    })

    // Add traded in picks
    tradedInPicks.forEach((pick) => {
      if (pick.round === 'First Round') {
        allPicks.set(pick.year, pick)
      }
    })

    // Check for gaps in first-round picks
    for (let year = currentYear; year < currentYear + MAX_FUTURE_YEARS - 1; year++) {
      if (!allPicks.has(year) && !allPicks.has(year + 1)) {
        errors.push(
          `Team must have at least one first-round pick in every two-year period (${year}-${year + 1})`,
        )
      }
    }

    return errors
  },

  // Validate pick protections
  validatePickProtections(picks) {
    const errors = []
    const protectionsByYear = new Map()

    picks.forEach((pick) => {
      const key = `${pick.year}-${pick.round}`
      const existing = protectionsByYear.get(key)

      if (existing) {
        errors.push(`Multiple pick protections for ${pick.year} ${pick.round}`)
      }

      protectionsByYear.set(key, pick.protection)
    })

    return errors
  },

  // Validate pick swaps
  validatePickSwaps(picks) {
    const errors = []
    const swapsByYear = new Map()

    picks.forEach((pick) => {
      if (pick.swap) {
        const key = pick.year
        const existing = swapsByYear.get(key)

        if (existing) {
          errors.push(`Multiple pick swaps for ${pick.year}`)
        }

        swapsByYear.set(key, pick)
      }
    })

    return errors
  },

  // Validate all pick-related rules
  validateAllPickRules(teamId, existingPicks, tradedOutPicks, tradedInPicks) {
    const errors = []

    errors.push(...this.validatePickYears([...tradedOutPicks, ...tradedInPicks]))
    errors.push(...this.validateStepienRule(teamId, existingPicks, tradedOutPicks, tradedInPicks))
    errors.push(...this.validatePickProtections([...tradedOutPicks, ...tradedInPicks]))
    errors.push(...this.validatePickSwaps([...tradedOutPicks, ...tradedInPicks]))

    return errors
  },
}
