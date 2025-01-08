// Views/NBAStats.vue
<script setup>
import { watch } from 'vue'
import { useNBAStats } from '@/composables/useNBAStats'
import { usePlayerSearch } from '@/composables/usePlayerSearch'
import { usePlayerFilter } from '@/composables/usePlayerFilter'
import VirtualTable from '@/components/nba/VirtualTable.vue'
import SearchFilter from '@/components/nba/SearchFilter.vue'

const { allPlayers, loading, error, fetchPlayers, prefetchPlayerDetails } = useNBAStats()

const { searchQuery, searchedPlayers, debouncedSearch } = usePlayerSearch(allPlayers)

const { selectedTeam, uniqueTeams, filteredPlayers } = usePlayerFilter(searchedPlayers)

// Prefetch player details on hover
const handlePlayerHover = (player) => {
  prefetchPlayerDetails(player.PLAYER_ID)
}

// Refresh data when filter changes
watch([searchQuery, selectedTeam], () => {
  if (searchQuery.value || selectedTeam.value !== 'ALL') {
    fetchPlayers()
  }
})
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Header with Search and Filters -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold mb-4">NBA Players</h1>
      <SearchFilter
        v-model:search="searchQuery"
        v-model:team="selectedTeam"
        :teams="uniqueTeams"
        :disabled="loading"
      />
    </div>

    <!-- Error State -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
      <button
        @click="() => fetchPlayers(true)"
        class="ml-4 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Retry
      </button>
    </div>

    <!-- Content -->
    <div v-if="!loading && !error">
      <VirtualTable :players="filteredPlayers" @player-hover="handlePlayerHover" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span class="ml-2">Loading players...</span>
    </div>
  </div>
</template>
