// usePlayerFilter.js
import { ref, computed } from 'vue'

export function usePlayerFilter(players) {
  const selectedTeam = ref('ALL')

  const uniqueTeams = computed(() => {
    const teams = new Set(players.value.map((player) => player.TEAM_ABBREVIATION))
    return ['ALL', ...Array.from(teams).sort()]
  })

  const filteredPlayers = computed(() => {
    if (selectedTeam.value === 'ALL') return players.value
    return players.value.filter((player) => player.TEAM_ABBREVIATION === selectedTeam.value)
  })

  return {
    selectedTeam,
    uniqueTeams,
    filteredPlayers,
  }
}
