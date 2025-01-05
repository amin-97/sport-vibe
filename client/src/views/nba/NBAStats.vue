<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Router
const router = useRouter()

// State
const allPlayers = ref([]) // Store ALL players
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(50)
const totalPages = ref(0)
const totalRecords = ref(0)

// Computed Properties
// Get unique players first, sorted by last name
const uniquePlayers = computed(() => {
  const playerMap = new Map()

  allPlayers.value.forEach((player) => {
    if (
      !playerMap.has(player.PLAYER_ID) ||
      player.SEASON_ID > playerMap.get(player.PLAYER_ID).SEASON_ID
    ) {
      playerMap.set(player.PLAYER_ID, player)
    }
  })

  return Array.from(playerMap.values()).sort((a, b) => {
    const aLastName = a.DISPLAY_FIRST_LAST.split(' ').pop().toLowerCase()
    const bLastName = b.DISPLAY_FIRST_LAST.split(' ').pop().toLowerCase()
    return aLastName.localeCompare(bLastName)
  })
})

const searchedPlayers = computed(() => {
  if (!searchQuery.value) return uniquePlayers.value

  const query = searchQuery.value.toLowerCase()
  return uniquePlayers.value.filter((player) =>
    player.DISPLAY_FIRST_LAST.toLowerCase().includes(query),
  )
})

// Handle filtered and paginated players
const filteredPlayers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return searchedPlayers.value.slice(start, end)
})

// Methods
const fetchAllPlayers = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await axios.get('http://localhost:5000/api/stats/players', {
      params: {
        limit: 1000, // Adjust as needed
      },
    })

    const { data } = response
    if (data && Array.isArray(data.stats)) {
      allPlayers.value = data.stats
    } else {
      throw new Error('Invalid response format')
    }
  } catch (err) {
    console.error('Error fetching players:', err)
    error.value = err.response?.data?.message || 'Failed to load players'
  } finally {
    loading.value = false
    updatePaginationInfo()
  }
}

const updatePaginationInfo = () => {
  totalRecords.value = searchedPlayers.value.length
  totalPages.value = Math.ceil(totalRecords.value / itemsPerPage.value)
}

const handlePageChange = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage
  }
}

const navigateToPlayerStats = (player) => {
  const playerUrlName = player.DISPLAY_FIRST_LAST.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')

  router.push({
    name: 'PlayerStats',
    params: { playerName: playerUrlName },
  })
}

// Lifecycle Hooks
onMounted(() => {
  fetchAllPlayers()
})
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Header with Search -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold mb-4">NBA Players</h1>
      <div class="flex items-center">
        <div class="relative flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search players..."
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="updatePaginationInfo"
          />
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <!-- Players Table -->
    <div
      v-if="!loading && filteredPlayers.length > 0"
      class="bg-white rounded-lg shadow overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full table-auto">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Team
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Age
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="player in filteredPlayers"
              :key="player.PLAYER_ID"
              @click="navigateToPlayerStats(player)"
              class="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-blue-600 hover:text-blue-800">
                  {{ player.DISPLAY_FIRST_LAST }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ player.TEAM_ABBREVIATION }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ player.PLAYER_AGE }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!loading && filteredPlayers.length === 0"
      class="text-center py-8 bg-white rounded-lg shadow"
    >
      <p class="text-gray-500">No players found</p>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-8 bg-white rounded-lg shadow"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <p class="mt-2 text-gray-500">Loading players...</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages.value > 1" class="mt-4 flex justify-between items-center">
      <span class="text-sm text-gray-700"> Page {{ currentPage }} of {{ totalPages }} </span>
      <div class="flex space-x-2">
        <button
          @click="handlePageChange(currentPage.value - 1)"
          :disabled="currentPage.value === 1"
          class="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          @click="handlePageChange(currentPage.value + 1)"
          :disabled="currentPage.value === totalPages.value"
          class="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
