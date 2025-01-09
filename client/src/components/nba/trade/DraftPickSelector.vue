<!-- src/components/nba/trade/DraftPickSelector.vue -->
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  team: {
    type: Object,
    required: true,
  },
  selectedPicks: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['select', 'remove'])

// Draft years available for trading (up to 7 years in the future)
const currentYear = new Date().getFullYear()
const availableYears = Array.from({ length: 7 }, (_, i) => currentYear + i)

// Pick types
const PICK_TYPES = ['First Round', 'Second Round']

// Protection options
const PROTECTION_OPTIONS = [
  { value: 'none', label: 'Unprotected' },
  { value: 'top3', label: 'Top 3 Protected' },
  { value: 'top5', label: 'Top 5 Protected' },
  { value: 'top10', label: 'Top 10 Protected' },
  { value: 'top14', label: 'Lottery Protected' },
]

// New pick form
const newPick = ref({
  year: currentYear,
  round: 'First Round',
  protection: 'none',
  swap: false,
  swapTeam: null,
})

// Computed available picks (excluding already selected ones)
const availablePicks = computed(() => {
  return availableYears.map((year) => {
    const firstRoundSelected = props.selectedPicks.some(
      (p) => p.year === year && p.round === 'First Round',
    )
    const secondRoundSelected = props.selectedPicks.some(
      (p) => p.year === year && p.round === 'Second Round',
    )

    return {
      year,
      available: {
        firstRound: !firstRoundSelected,
        secondRound: !secondRoundSelected,
      },
    }
  })
})

// Add new pick
const addPick = () => {
  const pick = {
    id: `${props.team.id}-${newPick.value.year}-${newPick.value.round}`,
    teamId: props.team.id,
    year: newPick.value.year,
    round: newPick.value.round,
    protection: newPick.value.protection,
    swap: newPick.value.swap,
    swapTeam: newPick.value.swapTeam,
  }

  emit('select', pick)

  // Reset form
  newPick.value = {
    year: currentYear,
    round: 'First Round',
    protection: 'none',
    swap: false,
    swapTeam: null,
  }
}

// Format pick description
const formatPickDescription = (pick) => {
  let desc = `${pick.year} ${pick.round}`
  if (pick.protection !== 'none') {
    desc += ` (${PROTECTION_OPTIONS.find((p) => p.value === pick.protection).label})`
  }
  if (pick.swap) {
    desc += ` (Swap Rights with ${pick.swapTeam})`
  }
  return desc
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="font-semibold text-gray-700">Draft Picks</h3>

    <!-- Selected Picks -->
    <div v-if="selectedPicks.length > 0" class="space-y-2">
      <div
        v-for="pick in selectedPicks"
        :key="pick.id"
        class="flex items-center justify-between p-2 bg-blue-50 rounded-lg"
      >
        <span>{{ formatPickDescription(pick) }}</span>
        <button @click="emit('remove', pick.id)" class="text-red-500 hover:text-red-700">
          Remove
        </button>
      </div>
    </div>

    <!-- Add New Pick -->
    <div class="border rounded-lg p-4 space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <!-- Year Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <select
            v-model="newPick.year"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <!-- Round Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Round</label>
          <select
            v-model="newPick.round"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option v-for="type in PICK_TYPES" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>
      </div>

      <!-- Protection Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Protection</label>
        <select
          v-model="newPick.protection"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option
            v-for="protection in PROTECTION_OPTIONS"
            :key="protection.value"
            :value="protection.value"
          >
            {{ protection.label }}
          </option>
        </select>
      </div>

      <!-- Pick Swap Option -->
      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          v-model="newPick.swap"
          class="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
        />
        <span class="text-sm text-gray-700">Include pick swap rights</span>
      </div>

      <!-- Add Button -->
      <button
        @click="addPick"
        class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        :disabled="!availablePicks.some((p) => p.available.firstRound || p.available.secondRound)"
      >
        Add Draft Pick
      </button>
    </div>
  </div>
</template>
