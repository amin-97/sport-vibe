// src/composables/useSalaryCapRules.js
import { ref, computed } from 'vue'

export function useSalaryCapRules(options = {}) {
  const {
    salaryCapAmount = 136021000, // 2023-24 NBA Salary Cap
    luxuryTaxAmount = 165294000, // 2023-24 Luxury Tax
    taxApronAmount = 172346000, // 2023-24 Tax Apron
    minimumSalary = 953000, // 2023-24 Minimum Salary
  } = options

  const tradeErrors = ref([])
  const tradeWarnings = ref([])

  // Calculate total salary for a team's traded players
  const calculateTradedSalary = (players) => {
    return players.reduce((total, player) => total + (player.salary || 0), 0)
  }

  // Check if team is over the cap
  const isTeamOverCap = (teamSalary) => {
    return teamSalary > salaryCapAmount
  }

  // Calculate maximum salary a team can take back
  const calculateMaxIncomingSalary = (outgoingSalary, teamSalary) => {
    if (!isTeamOverCap(teamSalary)) {
      return salaryCapAmount - teamSalary + outgoingSalary
    }

    // Teams over the cap must follow trade rules
    if (outgoingSalary <= 6533333) {
      return outgoingSalary * 1.75
    } else if (outgoingSalary <= 19600000) {
      return outgoingSalary + 5000000
    } else {
      return outgoingSalary * 1.25
    }
  }

  // Validate trade based on salary matching rules
  const validateSalaryMatch = (teams, tradedPlayers) => {
    const errors = []

    teams.forEach((team) => {
      const outgoingSalary = calculateTradedSalary(tradedPlayers.get(team.id) || [])
      const teamSalary = team.totalSalary || 0
      const maxIncoming = calculateMaxIncomingSalary(outgoingSalary, teamSalary)

      // Calculate total incoming salary from other teams
      const incomingSalary = Array.from(tradedPlayers.entries())
        .filter(([id]) => id !== team.id)
        .reduce((total, [, players]) => total + calculateTradedSalary(players), 0)

      if (incomingSalary > maxIncoming) {
        errors.push(
          `${team.full_name} cannot take back $${incomingSalary.toLocaleString()} in salary. Maximum allowed is $${maxIncoming.toLocaleString()}.`,
        )
      }
    })

    return errors
  }

  // Validate roster size
  const validateRosterSize = (teams, tradedPlayers) => {
    const errors = []

    teams.forEach((team) => {
      const outgoingCount = (tradedPlayers.get(team.id) || []).length
      const incomingCount = Array.from(tradedPlayers.entries())
        .filter(([id]) => id !== team.id)
        .reduce((total, [, players]) => total + players.length, 0)

      const newRosterSize = team.rosterSize - outgoingCount + incomingCount

      if (newRosterSize > 15) {
        // Standard NBA roster limit
        errors.push(`${team.full_name} would exceed the 15-player roster limit.`)
      }
      if (newRosterSize < 14) {
        // Minimum roster size
        errors.push(`${team.full_name} would fall below the 14-player minimum roster requirement.`)
      }
    })

    return errors
  }

  // Check trade restrictions
  const checkTradeRestrictions = (players) => {
    const errors = []
    const now = new Date()

    players.forEach((player) => {
      // Recently signed players
      if (player.contractSignDate) {
        const signDate = new Date(player.contractSignDate)
        const daysSigned = (now - signDate) / (1000 * 60 * 60 * 24)
        if (daysSigned < 60) {
          errors.push(
            `${player.player} cannot be traded until ${new Date(signDate.getTime() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString()} (60 days after signing)`,
          )
        }
      }

      // No-trade clause
      if (player.noTradeClause) {
        errors.push(`${player.player} has a no-trade clause.`)
      }

      // Recently traded players
      if (player.lastTradeDate) {
        const tradeDate = new Date(player.lastTradeDate)
        const daysTraded = (now - tradeDate) / (1000 * 60 * 60 * 24)
        if (daysTraded < 60) {
          errors.push(
            `${player.player} cannot be traded until ${new Date(tradeDate.getTime() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString()} (60 days after last trade)`,
          )
        }
      }
    })

    return errors
  }

  // Validate entire trade
  const validateTrade = (teams, tradedPlayers, tradedPicks = new Map()) => {
    tradeErrors.value = []
    tradeWarnings.value = []

    // Check if any assets are being traded
    const hasPlayers = Array.from(tradedPlayers.values()).some((players) => players.length > 0)
    const hasPicks = Array.from(tradedPicks.values()).some((picks) => picks.length > 0)

    if (!hasPlayers && !hasPicks) {
      tradeErrors.value.push('Trade must include at least one player or draft pick')
      return false
    }

    // Validate salary matching
    tradeErrors.value.push(...validateSalaryMatch(teams, tradedPlayers))

    // Validate roster sizes
    tradeErrors.value.push(...validateRosterSize(teams, tradedPlayers))

    // Check trade restrictions
    const allPlayers = Array.from(tradedPlayers.values()).flat()
    tradeErrors.value.push(...checkTradeRestrictions(allPlayers))

    return tradeErrors.value.length === 0
  }

  return {
    tradeErrors,
    tradeWarnings,
    validateTrade,
    calculateTradedSalary,
    isTeamOverCap,
    calculateMaxIncomingSalary,
  }
}
