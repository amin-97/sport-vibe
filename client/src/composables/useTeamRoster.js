//src/composables/useTeamRoster.js
import { ref, computed } from 'vue'
import { useTeamSalary } from './useTeamSalary'

export function useTeamRoster() {
  const rosterCache = ref(new Map())
  const { calculateTeamSalary } = useTeamSalary()

  // Constants
  const MIN_ROSTER_SIZE = 14
  const MAX_ROSTER_SIZE = 15
  const TWO_WAY_MAX = 2
  const EXHIBIT_10_MAX = 6

  // Roster validation errors
  const rosterErrors = ref([])

  // Calculate roster spots by contract type
  const calculateRosterSpots = (roster) => {
    return roster.reduce((counts, player) => {
      counts[player.contractType] = (counts[player.contractType] || 0) + 1
      return counts
    }, {})
  }

  // Validate roster composition
  const validateRoster = (teamId, roster) => {
    const errors = []
    const spots = calculateRosterSpots(roster)

    // Check total roster size
    const standardContracts = spots['standard'] || 0
    if (standardContracts < MIN_ROSTER_SIZE) {
      errors.push(`Team must have at least ${MIN_ROSTER_SIZE} players on standard contracts`)
    }
    if (standardContracts > MAX_ROSTER_SIZE) {
      errors.push(`Team cannot have more than ${MAX_ROSTER_SIZE} players on standard contracts`)
    }

    // Check two-way contracts
    const twoWayContracts = spots['two-way'] || 0
    if (twoWayContracts > TWO_WAY_MAX) {
      errors.push(`Team cannot have more than ${TWO_WAY_MAX} players on two-way contracts`)
    }

    // Check Exhibit 10 contracts
    const exhibit10Contracts = spots['exhibit-10'] || 0
    if (exhibit10Contracts > EXHIBIT_10_MAX) {
      errors.push(`Team cannot have more than ${EXHIBIT_10_MAX} players on Exhibit 10 contracts`)
    }

    rosterErrors.value = errors
    return errors.length === 0
  }

  // Project roster after trade
  const projectRosterAfterTrade = (teamId, currentRoster, incomingPlayers, outgoingPlayers) => {
    // Remove outgoing players
    const updatedRoster = currentRoster.filter(
      (player) => !outgoingPlayers.some((p) => p.playerId === player.playerId),
    )

    // Add incoming players
    updatedRoster.push(...incomingPlayers)

    // Recalculate team salary with new roster
    const salaryInfo = calculateTeamSalary(teamId, updatedRoster)

    return {
      roster: updatedRoster,
      isValid: validateRoster(teamId, updatedRoster),
      salaryInfo,
      errors: rosterErrors.value,
    }
  }

  // Check positional balance
  const checkPositionalBalance = (roster) => {
    const positions = roster.reduce((counts, player) => {
      counts[player.position] = (counts[player.position] || 0) + 1
      return counts
    }, {})

    const warnings = []

    // Check for minimum players at each position
    if (!positions['PG'] || positions['PG'] < 2) warnings.push('Low point guard depth')
    if (!positions['C'] || positions['C'] < 2) warnings.push('Low center depth')
    if (!positions['SF'] || positions['SF'] < 2) warnings.push('Low small forward depth')

    return warnings
  }

  // Get available roster spots
  const getAvailableRosterSpots = (roster) => {
    const spots = calculateRosterSpots(roster)

    return {
      standard: MAX_ROSTER_SIZE - (spots['standard'] || 0),
      twoWay: TWO_WAY_MAX - (spots['two-way'] || 0),
      exhibit10: EXHIBIT_10_MAX - (spots['exhibit-10'] || 0),
    }
  }

  // Check if player can be added to roster
  const canAddPlayerToRoster = (roster, player) => {
    const availableSpots = getAvailableRosterSpots(roster)

    switch (player.contractType) {
      case 'standard':
        return availableSpots.standard > 0
      case 'two-way':
        return availableSpots.twoWay > 0
      case 'exhibit-10':
        return availableSpots.exhibit10 > 0
      default:
        return false
    }
  }

  return {
    validateRoster,
    projectRosterAfterTrade,
    checkPositionalBalance,
    getAvailableRosterSpots,
    canAddPlayerToRoster,
    rosterErrors,
    MIN_ROSTER_SIZE,
    MAX_ROSTER_SIZE,
    TWO_WAY_MAX,
  }
}
