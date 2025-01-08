// usePlayerSort.js
import { ref, computed } from 'vue'

export function usePlayerSort(players) {
  const sortBy = ref('name')
  const sortDirection = ref('asc')

  const sortedPlayers = computed(() => {
    return [...players.value].sort((a, b) => {
      let compareResult = 0

      // Extract last names for name sorting
      let aLastName, bLastName
      if (sortBy.value === 'name') {
        aLastName = a.DISPLAY_FIRST_LAST.split(' ').pop().toLowerCase()
        bLastName = b.DISPLAY_FIRST_LAST.split(' ').pop().toLowerCase()
      }

      switch (sortBy.value) {
        case 'name':
          compareResult = aLastName.localeCompare(bLastName)
          break
        case 'team':
          compareResult = a.TEAM_ABBREVIATION.localeCompare(b.TEAM_ABBREVIATION)
          break
        case 'age':
          compareResult = a.PLAYER_AGE - b.PLAYER_AGE
          break
      }

      return sortDirection.value === 'asc' ? compareResult : -compareResult
    })
  })

  const handleSort = (column) => {
    if (sortBy.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy.value = column
      sortDirection.value = 'asc'
    }
  }

  const getSortIcon = (column) => {
    if (sortBy.value !== column) return '↕️'
    return sortDirection.value === 'asc' ? '↑' : '↓'
  }

  return {
    sortBy,
    sortDirection,
    sortedPlayers,
    handleSort,
    getSortIcon,
  }
}
