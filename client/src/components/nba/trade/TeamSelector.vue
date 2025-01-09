<!-- src/components/nba/trade/TeamSelector.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { useTeamStore } from '@/stores/teamStore'
import { storeToRefs } from 'pinia'

const props = defineProps({
  show: Boolean,
  selectedTeams: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'select'])

const teamStore = useTeamStore()
const { teams, loading, error } = storeToRefs(teamStore)
const searchQuery = ref('')

onMounted(async () => {
  if (teams.value.length === 0) {
    await teamStore.fetchTeams()
  }
})

const filteredTeams = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return teams.value.filter((team) => {
    const matchesSearch = team.full_name.toLowerCase().includes(query)
    const notSelected = !props.selectedTeams.some((t) => t.id === team.id)
    return matchesSearch && notSelected
  })
})
</script>

<template>
  <Dialog :open="show" @close="emit('close')" class="relative z-50">
    <div class="fixed inset-0 bg-black/30" aria-hidden="true" />

    <div class="fixed inset-0 flex items-center justify-center p-4">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
      >
        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Select Team</h3>

        <div class="mb-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search teams..."
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div v-if="loading" class="flex justify-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <div v-else-if="error" class="text-center py-4 text-red-500">
          {{ error }}
        </div>

        <div v-else class="max-h-96 overflow-y-auto">
          <div class="space-y-2">
            <button
              v-for="team in filteredTeams"
              :key="team.id"
              @click="emit('select', team)"
              class="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <img
                :src="`/team-logos/${team.abbreviation.toLowerCase()}.png`"
                :alt="team.full_name"
                class="w-8 h-8 object-contain"
              />
              <div class="flex flex-col flex-1 text-left">
                <span class="font-medium">{{ team.full_name }}</span>
                <span class="text-sm text-gray-500">{{ team.abbreviation }}</span>
              </div>
            </button>
          </div>

          <div v-if="filteredTeams.length === 0" class="text-center py-4 text-gray-500">
            No teams found
          </div>
        </div>

        <div class="mt-4">
          <button
            @click="emit('close')"
            class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>
