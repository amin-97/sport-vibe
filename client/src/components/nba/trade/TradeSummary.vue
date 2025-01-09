<!-- src/components/nba/trade/TradeSummary.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  teams: {
    type: Array,
    required: true,
  },
  tradedPlayers: {
    type: Map,
    required: true,
  },
  tradedPicks: {
    type: Map,
    required: true,
  },
  errors: {
    type: Array,
    default: () => [],
  },
})

// Calculate total salary for each team's traded players
const teamSalaries = computed(() => {
  const salaries = new Map()

  props.teams.forEach((team) => {
    const players = props.tradedPlayers.get(team.id) || []
    const totalSalary = players.reduce((sum, player) => sum + (player.salary || 0), 0)
    salaries.set(team.id, totalSalary)
  })

  return salaries
})

// Format salary numbers
const formatSalary = (salary) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(salary)
}

// Format pick description
const formatPickDescription = (pick) => {
  let desc = `${pick.year} ${pick.round}`
  if (pick.protection !== 'none') {
    desc += ` (${pick.protection})`
  }
  if (pick.swap) {
    desc += ` (Swap Rights)`
  }
  return desc
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-xl font-bold mb-4">Trade Summary</h2>

    <!-- Trade Breakdown -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <div v-for="team in teams" :key="team.id" class="border rounded-lg p-4">
        <div class="flex items-center space-x-2 mb-4">
          <img
            :src="`/team-logos/${team.abbreviation.toLowerCase()}.png`"
            :alt="team.full_name"
            class="w-8 h-8 object-contain"
          />
          <h3 class="font-semibold">{{ team.full_name }}</h3>
        </div>

        <!-- Outgoing Players -->
        <div class="mb-4">
          <h4 class="font-medium text-gray-700 mb-2">Outgoing Players:</h4>
          <div v-if="tradedPlayers.get(team.id)?.length" class="space-y-1">
            <div
              v-for="player in tradedPlayers.get(team.id)"
              :key="player.playerId"
              class="text-sm"
            >
              {{ player.player }} - {{ formatSalary(player.salary) }}
            </div>
          </div>
          <div v-else class="text-sm text-gray-500">None</div>
        </div>

        <!-- Outgoing Picks -->
        <div class="mb-4">
          <h4 class="font-medium text-gray-700 mb-2">Outgoing Picks:</h4>
          <div v-if="tradedPicks.get(team.id)?.length" class="space-y-1">
            <div v-for="pick in tradedPicks.get(team.id)" :key="pick.id" class="text-sm">
              {{ formatPickDescription(pick) }}
            </div>
          </div>
          <div v-else class="text-sm text-gray-500">None</div>
        </div>

        <!-- Salary Summary -->
        <div class="text-sm">
          <div class="font-medium">
            Outgoing Salary: {{ formatSalary(teamSalaries.get(team.id) || 0) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Trade Validation -->
    <div v-if="errors.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <h4 class="font-medium text-red-700 mb-2">Trade Cannot Be Completed:</h4>
      <ul class="list-disc list-inside space-y-1">
        <li v-for="(error, index) in errors" :key="index" class="text-sm text-red-600">
          {{ error }}
        </li>
      </ul>
    </div>

    <!-- CBA Rules Information -->
    <div class="mt-6 text-sm text-gray-500">
      <h4 class="font-medium text-gray-700 mb-2">NBA Trade Rules:</h4>
      <ul class="list-disc list-inside space-y-1">
        <li>Teams over the salary cap must match salaries within 125% + $100,000</li>
        <li>Teams cannot trade newly signed players for 3 months or until December 15</li>
        <li>Teams must maintain minimum roster sizes (14 players)</li>
        <li>Draft picks can only be traded up to 7 years in the future</li>
        <li>Teams must keep at least one future first-round pick</li>
      </ul>
    </div>
  </div>
</template>
