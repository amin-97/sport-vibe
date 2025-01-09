<!-- src/components/nba/trade/PlayerSelector.vue -->
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRosterStore } from '@/stores/rosterStore'
import { storeToRefs } from 'pinia'

const props = defineProps({
  team: {
    type: Object,
    required: true,
  },
  selectedPlayers: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['select', 'remove'])

const rosterStore = useRosterStore()
const { teamRoster, loading, error } = storeToRefs(rosterStore)
const searchQuery = ref('')

onMounted(async () => {
  if (props.team?.id) {
    await rosterStore.fetchTeamRoster(props.team.id)
  }
})

// Watch for team changes and reload roster
watch(
  () => props.team?.id,
  async (newTeamId) => {
    if (newTeamId) {
      await rosterStore.fetchTeamRoster(newTeamId)
    }
  },
)

// Filter available players
const availablePlayers = computed(() => {
  if (!teamRoster.value) return []

  const query = searchQuery.value.toLowerCase()
  return teamRoster.value.filter((player) => {
    // Check if player exists and has required fields
    if (!player || !player.PLAYER) return false

    const matchesSearch = player.PLAYER.toLowerCase().includes(query)
    const notSelected = !props.selectedPlayers.some((p) => p.PLAYER_ID === player.PLAYER_ID)
    return matchesSearch && notSelected
  })
})
</script>

<template>
  <div class="space-y-4">
    <!-- Search Bar -->
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search players..."
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="text-center text-red-500 py-2">
      {{ error }}
    </div>

    <!-- Selected Players -->
    <div v-if="selectedPlayers?.length > 0" class="space-y-2">
      <h3 class="font-semibold text-gray-700">Selected Players</h3>
      <div
        v-for="player in selectedPlayers"
        :key="player.PLAYER_ID"
        class="flex items-center justify-between p-2 bg-blue-50 rounded-lg"
      >
        <div class="flex items-center space-x-2">
          <span class="font-medium">{{ player.PLAYER }}</span>
          <span class="text-sm text-gray-500">#{{ player.NUM }}</span>
        </div>
        <button @click="emit('remove', player.PLAYER_ID)" class="text-red-500 hover:text-red-700">
          Remove
        </button>
      </div>
    </div>

    <!-- Available Players -->
    <div class="space-y-2">
      <h3 class="font-semibold text-gray-700">Available Players</h3>
      <div class="max-h-64 overflow-y-auto space-y-2">
        <div
          v-for="player in availablePlayers"
          :key="player.PLAYER_ID"
          @click="emit('select', player)"
          class="flex items-center justify-between p-2 bg-white border rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-medium">{{ player.PLAYER }}</span>
              <span class="text-sm text-gray-500">#{{ player.NUM }}</span>
            </div>
            <div class="text-sm text-gray-500 mt-1">
              {{ player.POSITION }} • {{ player.HEIGHT }} •
              {{ player.EXP === 0 ? 'Rookie' : `${player.EXP} YRS` }}
            </div>
          </div>
          <button class="text-blue-500 hover:text-blue-700">Add</button>
        </div>
      </div>

      <!-- No Results Message -->
      <div v-if="availablePlayers.length === 0 && !loading" class="text-center py-4 text-gray-500">
        No players available
      </div>
    </div>
  </div>
</template>
