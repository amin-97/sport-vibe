<!-- src/views/nba/TeamsView.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900">NBA Team Rosters</h1>
      <p class="mt-4 text-xl text-gray-600">View complete rosters for all NBA teams</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-600 py-12">
      {{ error }}
    </div>

    <!-- Team Selection -->
    <div v-else class="bg-white shadow-lg rounded-lg p-6 mb-8">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <button
          v-for="team in teams"
          :key="team.id"
          @click="openTeamModal(team)"
          class="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200 ease-in-out"
        >
          <div class="text-center">
            <img
              :src="getTeamLogoUrl(team)"
              :alt="team.full_name"
              class="w-20 h-20 mx-auto mb-2 object-contain"
              @error="setDefaultLogo($event)"
            />
            <div class="font-semibold">{{ team.full_name }}</div>
          </div>
        </button>
      </div>
    </div>

    <!-- Team Modal with Backdrop -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
    >
      <TeamPopUpModal :is-open="isModalOpen" :team="selectedTeam" @close="closeTeamModal" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/axios'
import TeamPopUpModal from '@/components/nba/TeamPopUpModal.vue'

// Reactive state
const teams = ref([])
const loading = ref(true)
const error = ref(null)

// Modal state
const isModalOpen = ref(false)
const selectedTeam = ref(null)

// Fetch all teams on component mount
onMounted(async () => {
  try {
    const teamsResponse = await api.get('/api/teams')
    teams.value = teamsResponse.data.teams
    loading.value = false
  } catch (err) {
    error.value = 'Failed to load teams. Please try again.'
    loading.value = false
    console.error(err)
  }
})

// Open team modal
const openTeamModal = (team) => {
  selectedTeam.value = team
  isModalOpen.value = true
}

// Close team modal
const closeTeamModal = () => {
  isModalOpen.value = false
  selectedTeam.value = null
}

// Team logo URL handler
const getTeamLogoUrl = (team) => {
  return `/team-logos/${team.abbreviation.toLowerCase()}.png`
}

// Fallback for team logos
const setDefaultLogo = (event) => {
  event.target.src = '/placeholder-image.png'
}
</script>
