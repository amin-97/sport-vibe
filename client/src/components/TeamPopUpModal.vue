<!-- src/components/TeamPopUpModal.vue -->
<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-4 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-4 scale-95"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
    >
      <div
        class="w-full max-w-4xl max-h-[90vh] overflow-auto bg-white rounded-xl shadow-2xl relative pointer-events-auto animate-pop-in"
      >
        <!-- Close Button -->
        <button
          @click="closeModal"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Modal Header -->
        <div class="flex items-center p-6 border-b">
          <img
            :src="`/team-logos/${team.abbreviation.toLowerCase()}.png`"
            :alt="team.full_name"
            class="w-12 h-12 mr-4 object-contain"
            @error="setDefaultLogo"
          />
          <h2 class="text-2xl font-bold">{{ team.full_name }}</h2>
        </div>

        <!-- Tabs -->
        <div class="flex border-b">
          <button
            @click="activeTab = 'details'"
            :class="{
              'border-blue-500 text-blue-600': activeTab === 'details',
              'border-transparent text-gray-500 hover:text-gray-700': activeTab !== 'details',
            }"
            class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          >
            Team Details
          </button>
          <button
            @click="activeTab = 'roster'"
            :class="{
              'border-blue-500 text-blue-600': activeTab === 'roster',
              'border-transparent text-gray-500 hover:text-gray-700': activeTab !== 'roster',
            }"
            class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
          >
            Team Roster
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6">
          <!-- Team Details Tab -->
          <div v-if="activeTab === 'details'">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-xl font-semibold mb-4">Team Information</h4>
                <div class="space-y-2">
                  <p><strong>City:</strong> {{ teamDetails.CITY }}</p>
                  <p><strong>Arena:</strong> {{ teamDetails.ARENA }}</p>
                  <p><strong>Arena Capacity:</strong> {{ teamDetails.ARENACAPACITY }}</p>
                  <p><strong>Founded:</strong> {{ teamDetails.YEARFOUNDED }}</p>
                </div>
              </div>
              <div>
                <h4 class="text-xl font-semibold mb-4">Management</h4>
                <div class="space-y-2">
                  <p><strong>Owner:</strong> {{ teamDetails.OWNER }}</p>
                  <p><strong>General Manager:</strong> {{ teamDetails.GENERALMANAGER }}</p>
                  <p><strong>Head Coach:</strong> {{ teamDetails.HEADCOACH }}</p>
                  <p><strong>G League Affiliate:</strong> {{ teamDetails.DLEAGUEAFFILIATION }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Roster Tab -->
          <div v-else-if="activeTab === 'roster'">
            <div v-if="loading" class="flex justify-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            <div v-else-if="teamRoster.length === 0" class="text-center text-gray-600">
              No roster information available
            </div>
            <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div
                v-for="player in teamRoster"
                :key="player.PLAYER_ID"
                class="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div class="text-center">
                  <div class="text-lg font-medium mb-2">{{ player.PLAYER }}</div>
                  <div class="text-sm text-gray-600">
                    <p>Position: {{ player.POSITION }}</p>
                    <p>Number: #{{ player.NUM }}</p>
                    <p>
                      Experience:
                      {{ player.EXP === 'R' ? 'Rookie' : `${player.EXP} years` }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  team: {
    type: Object,
    required: true,
  },
})

// Emits
const emit = defineEmits(['close'])

// Reactive state
const activeTab = ref('details')
const teamDetails = ref({})
const teamRoster = ref([])
const loading = ref(false)
const error = ref(null)

// Fetch team details
const fetchTeamDetails = async () => {
  try {
    loading.value = true

    // Log the team object to see its structure
    console.log('Team object:', props.team)

    // Debugging: try multiple methods to fetch team details
    let response
    const searchQueries = [props.team.abbreviation, props.team.full_name, props.team.nickname]

    for (const query of searchQueries) {
      try {
        // Try searching via multiple possible routes
        response = await axios.get(`/api/team-details/search/query?query=${query}`)

        // If search returns results, take the first one
        if (response.data && response.data.length > 0) {
          teamDetails.value = response.data[0]
          break
        }
      } catch (searchErr) {
        console.log(`Search with ${query} failed:`, searchErr)
      }
    }

    // If no details found after all attempts
    if (!teamDetails.value) {
      throw new Error('Team details not found')
    }
  } catch (err) {
    error.value = 'Failed to load team details'
    console.error('Team details fetch error:', err)
    // Optionally, set some default or fallback details
    teamDetails.value = {
      CITY: props.team.city || 'Unknown',
      NICKNAME: props.team.nickname || 'Unknown',
      ABBREVIATION: props.team.abbreviation || 'N/A',
    }
  } finally {
    loading.value = false
  }
}

// Fetch team roster
const fetchTeamRoster = async () => {
  try {
    loading.value = true
    const response = await axios.get(`/api/common-team-roster?teamId=${props.team.id}&season=2024`)
    teamRoster.value = response.data.rosterEntries || []
  } catch (err) {
    error.value = 'Failed to load team roster'
    console.error('Team roster fetch error:', err)
    teamRoster.value = []
  } finally {
    loading.value = false
  }
}

// Watch for changes in team prop
watch(
  () => props.team,
  (newTeam) => {
    if (newTeam) {
      fetchTeamDetails()
      fetchTeamRoster()
    }
  },
  { immediate: true },
)

// Close modal
const closeModal = () => {
  emit('close')
}

// Fallback for team logos
const setDefaultLogo = (event) => {
  event.target.src = '/placeholder-image.png'
}
</script>

<style scoped>
@keyframes popIn {
  0% {
    transform: scale(0.9) translateY(20px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.animate-pop-in {
  animation: popIn 0.3s ease-out;
}
</style>
