//src/services/tradeValidationService.js
import { useTeamSalary } from '../composables/useTeamSalary'
import { useTeamRoster } from '../composables/useTeamRoster'
import { useTradeExceptions } from '../composables/useTradeExceptions'

export class TradeValidationService {
  constructor() {
    const { calculateTeamSalary, checkHardCapTriggers } = useTeamSalary()
    const { validateRoster, projectRosterAfterTrade } = useTeamRoster()
    const { getActiveExceptions } = useTradeExceptions()

    this.calculateTeamSalary = calculateTeamSalary
    this.checkHardCapTriggers = checkHardCapTriggers
    this.validateRoster = validateRoster
    this.projectRosterAfterTrade = projectRosterAfterTrade
    this.getActiveExceptions = getActiveExceptions
  }

  validateTeamParticipation(team, outgoingPlayers, outgoingPicks, exceptions) {
    const errors = []
    const warnings = []

    // Check roster size
    const projectedRoster = this.projectRosterAfterTrade(team.id, team.roster, [], outgoingPlayers)
    if (!projectedRoster.isValid) {
      errors.push(...projectedRoster.errors)
    }

    // Check hard cap
    const teamSalary = this.calculateTeamSalary(team.id, projectedRoster.roster)
    if (teamSalary.isOverApron && this.checkHardCapTriggers(outgoingPlayers)) {
      errors.push(`${team.name} cannot exceed the hard cap due to trade restrictions`)
    }

    // Validate draft pick rules
    if (outgoingPicks.length > 0) {
      const stepienRule = this.validateStepienRule(team, outgoingPicks)
      if (!stepienRule.isValid) {
        errors.push(...stepienRule.errors)
      }
    }

    return { errors, warnings }
  }

  validateSalaryMatching(teams, tradedPlayers, exceptions) {
    const errors = []
    const warnings = []

    teams.forEach((team) => {
      const outgoingSalary = this.calculateOutgoingSalary(tradedPlayers.get(team.id) || [])
      const incomingSalary = this.calculateIncomingSalary(team.id, tradedPlayers)

      if (
        !this.validateSalaryMatchRules(
          team,
          outgoingSalary,
          incomingSalary,
          exceptions.get(team.id),
        )
      ) {
        errors.push(`${team.name} cannot take back $${incomingSalary.toLocaleString()} in salary`)
      }
    })

    return { errors, warnings }
  }

  validateStepienRule(team, outgoingPicks) {
    const errors = []
    const years = new Set(outgoingPicks.map((pick) => pick.year))

    // Team must have at least one first-round pick every other year
    for (let year of years) {
      const hasFirstNextYear = team.futurePicks.some(
        (pick) => pick.year === year + 1 && pick.round === 'First Round',
      )
      if (!hasFirstNextYear) {
        errors.push(`${team.name} must keep a first-round pick in ${year + 1} (Stepien Rule)`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  validateTradeRestrictions(tradedPlayers) {
    const errors = []
    const warnings = []
    const now = new Date()

    // Check each traded player for restrictions
    for (const [teamId, players] of tradedPlayers.entries()) {
      players.forEach((player) => {
        // Recently signed free agent restriction
        if (player.contractSignDate) {
          const signDate = new Date(player.contractSignDate)
          const daysSigned = (now - signDate) / (1000 * 60 * 60 * 24)
          if (daysSigned < 90) {
            // 3 months
            errors.push(
              `${player.name} cannot be traded until ${new Date(signDate.getTime() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
            )
          }
        }

        // No-trade clause
        if (player.noTradeClause) {
          warnings.push(`${player.name} has a no-trade clause and must approve the trade`)
        }

        // Bird rights implications
        if (player.birdRights) {
          warnings.push(`Trading ${player.name} will affect Bird Rights status`)
        }

        // Recently extended contract
        if (player.extensionDate) {
          const extDate = new Date(player.extensionDate)
          const daysExtended = (now - extDate) / (1000 * 60 * 60 * 24)
          if (daysExtended < 180) {
            // 6 months
            errors.push(
              `${player.name} cannot be traded until ${new Date(extDate.getTime() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
            )
          }
        }
      })
    }

    return { errors, warnings }
  }

  calculateOutgoingSalary(players) {
    return players.reduce((total, player) => total + (player.salary || 0), 0)
  }

  calculateIncomingSalary(teamId, tradedPlayers) {
    let total = 0
    for (const [sourceTeamId, players] of tradedPlayers.entries()) {
      if (sourceTeamId !== teamId) {
        total += this.calculateOutgoingSalary(players)
      }
    }
    return total
  }

  validateSalaryMatchRules(team, outgoingSalary, incomingSalary, exceptions) {
    const teamSalary = this.calculateTeamSalary(team.id, team.roster)

    // Teams under the cap can take back salary up to the cap
    if (!teamSalary.isOverCap) {
      return incomingSalary <= teamSalary.capSpace + outgoingSalary
    }

    // Teams over the cap must match salaries within rules
    let allowedIncoming
    if (outgoingSalary <= 6533333) {
      allowedIncoming = outgoingSalary * 1.75
    } else if (outgoingSalary <= 19600000) {
      allowedIncoming = outgoingSalary + 5000000
    } else {
      allowedIncoming = outgoingSalary * 1.25
    }

    // Add available exceptions
    if (exceptions) {
      allowedIncoming += exceptions.reduce((total, exception) => total + exception.amount, 0)
    }

    return incomingSalary <= allowedIncoming
  }
}
