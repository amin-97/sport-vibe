// usePlayerSearch.js
import { ref, computed } from 'vue'

export function usePlayerSearch(players) {
  const searchQuery = ref('')

  const searchedPlayers = computed(() => {
    if (!searchQuery.value) return players.value

    const query = searchQuery.value.toLowerCase()
    return players.value.filter((player) => player.DISPLAY_FIRST_LAST.toLowerCase().includes(query))
  })

  return {
    searchQuery,
    searchedPlayers,
  }
}
