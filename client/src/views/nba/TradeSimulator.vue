<!-- src/components/nba/trade/TradeSimulator.vue -->
<script setup>
import { ref, computed } from 'vue'
import PlayerSelector from '@/components/nba/trade/PlayerSelector.vue'
import DraftPickSelector from '@/components/nba/trade/DraftPickSelector.vue'
import TradeSummary from '@/components/nba/trade/TradeSummary.vue'
import TradeExceptions from '@/components/nba/trade/TradeExceptions.vue'
import { useSalaryCapRules } from '@/composables/useSalaryCapRules'
import { useTeamRoster } from '@/composables/useTeamRoster'
import { useTradeExceptions } from '@/composables/useTradeExceptions'
import TeamSelector from '@/components/nba/trade/TeamSelector.vue'
// Initialize with empty arrays and maps
const teams = ref([])
const tradedPlayers = ref(new Map())
const tradedPicks = ref(new Map())
const tradeExceptions = ref(new Map())
const validationErrors = ref([])
const validationWarnings = ref([])
const showTeamSelector = ref(false)

const MAX_TEAMS = 3

const { validateTrade, tradeErrors, tradeWarnings } = useSalaryCapRules()
const { validateRoster } = useTeamRoster()
const { getActiveExceptions } = useTradeExceptions()

// Add team to trade
const addTeam = (team) => {
  if (!team) return
  if (teams.value.length < MAX_TEAMS && !teams.value.find((t) => t.id === team.id)) {
    teams.value.push(team)
    tradedPlayers.value.set(team.id, [])
    tradedPicks.value.set(team.id, [])
    tradeExceptions.value.set(team.id, getActiveExceptions(team.id) || [])
  }
}

// Remove team from trade
const removeTeam = (teamId) => {
  if (!teamId) return
  teams.value = teams.value.filter((team) => team.id !== teamId)
  tradedPlayers.value.delete(teamId)
  tradedPicks.value.delete(teamId)
  tradeExceptions.value.delete(teamId)
  validateCurrentTrade()
}

// Handle player selection
const handlePlayerSelect = (teamId, player) => {
  if (!teamId || !player) return
  const currentPlayers = tradedPlayers.value.get(teamId) || []
  tradedPlayers.value.set(teamId, [...currentPlayers, player])
  validateCurrentTrade()
}

// Handle player removal
const handlePlayerRemove = (teamId, playerId) => {
  if (!teamId || !playerId) return
  const currentPlayers = tradedPlayers.value.get(teamId) || []
  tradedPlayers.value.set(
    teamId,
    currentPlayers.filter((p) => p.playerId !== playerId),
  )
  validateCurrentTrade()
}

// Handle pick selection
const handlePickSelect = (teamId, pick) => {
  if (!teamId || !pick) return
  const currentPicks = tradedPicks.value.get(teamId) || []
  tradedPicks.value.set(teamId, [...currentPicks, pick])
  validateCurrentTrade()
}

// Handle pick removal
const handlePickRemove = (teamId, pickId) => {
  if (!teamId || !pickId) return
  const currentPicks = tradedPicks.value.get(teamId) || []
  tradedPicks.value.set(
    teamId,
    currentPicks.filter((p) => p.id !== pickId),
  )
  validateCurrentTrade()
}

// Calculate outgoing salary for a team
const calculateOutgoingSalary = (players = []) => {
  return players.reduce((total, player) => total + (player.salary || 0), 0)
}

// Calculate incoming salary for a team
const calculateIncomingSalary = (teamId) => {
  if (!teamId) return 0
  let total = 0
  tradedPlayers.value.forEach((players, sourceTeamId) => {
    if (sourceTeamId !== teamId) {
      total += calculateOutgoingSalary(players)
    }
  })
  return total
}

// Validate current trade
const validateCurrentTrade = () => {
  // Basic validation
  if (teams.value.length < 2) {
    validationErrors.value = ['At least two teams are required for a trade']
    return false
  }

  // Call validate trade from salary cap rules
  const isValid = validateTrade(teams.value, tradedPlayers.value, tradedPicks.value)
  validationErrors.value = tradeErrors.value
  validationWarnings.value = tradeWarnings.value

  return isValid
}

// Computed property for checking if a valid trade can be executed
const canExecuteTrade = computed(() => {
  return teams.value.length >= 2 && validationErrors.value.length === 0
})
</script>

# Add this import to your script section if not already there import TeamSelector from
'@/components/nba/trade/TeamSelector.vue'

<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-6">NBA Trade Machine</h1>

    <!-- Team Selection -->
    <div class="mb-6">
      <div v-if="teams.length > 0" class="flex flex-wrap gap-4 mb-4">
        <div
          v-for="team in teams"
          :key="team.id"
          class="flex items-center space-x-2 bg-gray-100 rounded-lg p-2"
        >
          <img
            :src="`/team-logos/${team.abbreviation.toLowerCase()}.png`"
            :alt="team.full_name"
            class="w-8 h-8 object-contain"
          />
          <span>{{ team.full_name }}</span>
          <button @click="() => removeTeam(team.id)" class="text-red-500 hover:text-red-700">
            Remove
          </button>
        </div>
      </div>

      <button
        v-if="teams.length < MAX_TEAMS"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        @click="showTeamSelector = true"
      >
        Add Team
      </button>

      <!-- Team Selector Modal -->
      <TeamSelector
        :show="showTeamSelector"
        :selected-teams="teams"
        @close="showTeamSelector = false"
        @select="
          (team) => {
            addTeam(team)
            showTeamSelector = false
          }
        "
      />
    </div>

    <!-- Trade Assets -->
    <div v-if="teams.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="team in teams" :key="team.id" class="space-y-6">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center space-x-2 mb-4">
            <img
              :src="`/team-logos/${team.abbreviation.toLowerCase()}.png`"
              :alt="team.full_name"
              class="w-8 h-8 object-contain"
            />
            <h2 class="text-xl font-semibold">{{ team.full_name }}</h2>
          </div>

          <!-- Player Selection -->
          <PlayerSelector
            :team="team"
            :selected-players="tradedPlayers.get(team.id) || []"
            @select="(player) => handlePlayerSelect(team.id, player)"
            @remove="(playerId) => handlePlayerRemove(team.id, playerId)"
          />

          <!-- Draft Pick Selection -->
          <DraftPickSelector
            v-if="team"
            :team="team"
            :selected-picks="tradedPicks.get(team.id) || []"
            @select="(pick) => handlePickSelect(team.id, pick)"
            @remove="(pickId) => handlePickRemove(team.id, pickId)"
          />

          <!-- Trade Exceptions -->
          <TradeExceptions
            v-if="team"
            :team="team"
            :exceptions="tradeExceptions.get(team.id) || []"
            :incoming-salary="calculateIncomingSalary(team.id)"
          />

          <!-- Team Salary Summary -->
          <div class="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Salary Summary</h3>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span>Outgoing:</span>
                <span
                  >${{ calculateOutgoingSalary(tradedPlayers.get(team.id)).toLocaleString() }}</span
                >
              </div>
              <div class="flex justify-between">
                <span>Incoming:</span>
                <span>${{ calculateIncomingSalary(team.id).toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Teams Selected Message -->
    <div v-else class="text-center py-8 text-gray-500">Select teams to begin building a trade</div>

    <!-- Trade Summary -->
    <TradeSummary
      v-if="teams.length >= 2"
      :teams="teams"
      :traded-players="tradedPlayers"
      :traded-picks="tradedPicks"
      :errors="validationErrors"
    />

    <!-- Validation Messages -->
    <div
      v-if="validationErrors.length > 0"
      class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4"
    >
      <h4 class="font-medium text-red-700 mb-2">Trade Cannot Be Completed:</h4>
      <ul class="list-disc list-inside space-y-1">
        <li v-for="(error, index) in validationErrors" :key="index" class="text-sm text-red-600">
          {{ error }}
        </li>
      </ul>
    </div>

    <!-- Warnings -->
    <div
      v-if="validationWarnings.length > 0"
      class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4"
    >
      <h4 class="font-medium text-yellow-700 mb-2">Trade Considerations:</h4>
      <ul class="list-disc list-inside space-y-1">
        <li
          v-for="(warning, index) in validationWarnings"
          :key="index"
          class="text-sm text-yellow-600"
        >
          {{ warning }}
        </li>
      </ul>
    </div>

    <!-- Execute Trade Button -->
    <button
      v-if="teams.length >= 2"
      @click="executeTrade"
      class="mt-6 w-full py-3 text-white rounded-lg"
      :class="{
        'bg-green-500 hover:bg-green-600': canExecuteTrade,
        'bg-gray-400 cursor-not-allowed': !canExecuteTrade,
      }"
      :disabled="!canExecuteTrade"
    >
      {{ canExecuteTrade ? 'Execute Trade' : 'Invalid Trade' }}
    </button>

    <!-- CBA Rules Reference -->
    <div class="mt-8 text-sm text-gray-500">
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
