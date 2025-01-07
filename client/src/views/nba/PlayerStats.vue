<template>
  <div class="container mx-auto p-4">
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
    </div>

    <template v-else-if="playerData">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">{{ playerData.playerInfo.DISPLAY_FIRST_LAST }}</h1>
        <div class="text-gray-600">Current Team: {{ playerData.playerInfo.TEAM_ABBREVIATION }}</div>
      </div>

      <!-- Stats Toggle Section -->
      <div class="mb-4 flex justify-between items-center">
        <!-- Tabs for Total vs Average Stats -->
        <div class="flex border rounded-lg overflow-hidden">
          <button
            @click="statsDisplay = 'total'"
            :class="{
              'bg-blue-500 text-white': statsDisplay === 'total',
              'bg-white text-gray-700 hover:bg-gray-100': statsDisplay !== 'total',
            }"
            class="px-4 py-2 text-sm font-medium transition-colors duration-200"
          >
            Total Stats
          </button>
          <button
            @click="statsDisplay = 'average'"
            :class="{
              'bg-blue-500 text-white': statsDisplay === 'average',
              'bg-white text-gray-700 hover:bg-gray-100': statsDisplay !== 'average',
            }"
            class="px-4 py-2 text-sm font-medium transition-colors duration-200 border-l"
          >
            Average Stats
          </button>
        </div>

        <!-- Additional controls -->
        <div class="flex gap-2">
          <button
            @click="toggleGraphType"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            {{ isLineGraph ? 'Show Bars' : 'Show Line' }}
          </button>
          <button
            @click="downloadCSV"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Download CSV
          </button>
        </div>
      </div>

      <!-- Career Highlights -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div
          v-for="stat in careerHighlights"
          :key="stat.key"
          class="bg-white p-4 rounded-lg shadow"
        >
          <div class="text-sm text-gray-500">{{ stat.label }}</div>
          <div class="text-2xl font-bold">{{ formatStat(stat.value) }}</div>
        </div>
      </div>

      <!-- Stats Table -->
      <div class="mb-8 overflow-x-auto bg-white rounded-lg shadow">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-50">
              <th class="p-3 border text-left">Season</th>
              <th class="p-3 border text-left">Team</th>
              <th
                v-for="stat in statColumns"
                :key="stat.key"
                class="p-3 border text-right cursor-pointer hover:bg-gray-100"
                @click="selectStat(stat.key)"
              >
                {{ stat.label }}
                <span v-if="selectedStat === stat.key" class="ml-1 text-blue-500">→</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="season in playerData.seasonStats" :key="season.SEASON_ID">
              <td class="p-3 border">{{ season.SEASON_ID }}</td>
              <td class="p-3 border">{{ season.TEAM_ABBREVIATION }}</td>
              <td
                v-for="stat in statColumns"
                :key="stat.key"
                class="p-3 border text-right"
                :class="{ 'bg-blue-50': selectedStat === stat.key }"
              >
                {{
                  statsDisplay === 'total'
                    ? formatStat(season[stat.key], stat.isPercentage)
                    : formatStat(calculateAverageStat(season, stat.key), stat.isPercentage)
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Graph -->
      <div class="mb-8 bg-white p-6 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">
            {{ getStatLabel(selectedStat) }}
            {{ statsDisplay === 'average' ? 'per Game' : 'Total' }} by Season
          </h2>
        </div>

        <div class="h-96">
          <Line v-if="isLineGraph && chartData" :data="chartData" :options="chartOptions" />
          <Bar v-else-if="chartData" :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </template>

    <div v-else class="text-center py-8 text-gray-500">Player not found</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import api from '@/utils/axios'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
)

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const playerData = ref(null)
const selectedStat = ref('PTS')
const statsDisplay = ref('total')
const isLineGraph = ref(true)

// Stat columns configuration
const statColumns = [
  { key: 'GP', label: 'Games', totalOnly: true },
  { key: 'MIN', label: 'Minutes' },
  { key: 'PTS', label: 'Points' },
  { key: 'REB', label: 'Rebounds' },
  { key: 'AST', label: 'Assists' },
  { key: 'STL', label: 'Steals' },
  { key: 'BLK', label: 'Blocks' },
  { key: 'TOV', label: 'Turnovers' },
  { key: 'FG_PCT', label: 'FG%', isPercentage: true, totalOnly: true },
  { key: 'FG3_PCT', label: '3P%', isPercentage: true, totalOnly: true },
  { key: 'FT_PCT', label: 'FT%', isPercentage: true, totalOnly: true },
]

// Calculate average stat
const calculateAverageStat = (season, statKey) => {
  // For 'GP', always return the total number of games
  if (statKey === 'GP') {
    return season[statKey]
  }

  // For percentage stats, return the existing value
  if (['FG_PCT', 'FG3_PCT', 'FT_PCT'].includes(statKey)) {
    return season[statKey]
  }

  // For other stats, divide by games played
  return season[statKey] / (season.GP || 1)
}

// Career highlights computed from all seasons
const careerHighlights = computed(() => {
  if (!playerData.value?.seasonStats) return []

  const total = playerData.value.seasonStats.reduce(
    (acc, season) => {
      acc.games += season.GP
      acc.points += season.PTS
      acc.rebounds += season.REB
      acc.assists += season.AST
      return acc
    },
    { games: 0, points: 0, rebounds: 0, assists: 0 },
  )

  return [
    { key: 'games', label: 'Career Games', value: total.games },
    { key: 'points', label: 'PPG Career', value: total.points / total.games },
    { key: 'rebounds', label: 'RPG Career', value: total.rebounds / total.games },
    { key: 'assists', label: 'APG Career', value: total.assists / total.games },
  ]
})

// Format stat values based on type
const formatStat = (value, isPercentage = false) => {
  if (value === null || value === undefined) return '-'
  if (isPercentage) {
    return `${(value * 100).toFixed(1)}%`
  }
  return Number(value).toFixed(1)
}

const selectStat = (key) => {
  selectedStat.value = key
}

const getStatLabel = (key) => {
  const stat = statColumns.find((s) => s.key === key)
  return stat ? stat.label : key
}

// Toggle graph type
const toggleGraphType = () => {
  isLineGraph.value = !isLineGraph.value
}

// Chart data computed property
const chartData = computed(() => {
  if (!playerData.value?.seasonStats) return null

  return {
    labels: playerData.value.seasonStats.map((season) => season.SEASON_ID),
    datasets: [
      {
        label: getStatLabel(selectedStat.value),
        data: playerData.value.seasonStats.map((season) =>
          statsDisplay.value === 'total'
            ? season[selectedStat.value]
            : calculateAverageStat(season, selectedStat.value),
        ),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1,
      },
    ],
  }
})

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const stat = statColumns.find((s) => s.key === selectedStat.value)
          const value = context.raw
          return `${stat.label}: ${formatStat(value, stat.isPercentage)}`
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => {
          const stat = statColumns.find((s) => s.key === selectedStat.value)
          return formatStat(value, stat.isPercentage)
        },
      },
    },
  },
}

// Download CSV function
const downloadCSV = () => {
  if (!playerData.value?.seasonStats) return

  const headers = ['Season', 'Team', getStatLabel(selectedStat.value)]
  const rows = playerData.value.seasonStats.map((season) => {
    const statValue =
      statsDisplay.value === 'total'
        ? season[selectedStat.value]
        : calculateAverageStat(season, selectedStat.value)

    return [season.SEASON_ID, season.TEAM_ABBREVIATION, statValue]
  })

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute(
    'download',
    `${playerData.value.playerInfo.DISPLAY_FIRST_LAST}_${selectedStat.value}_${statsDisplay.value}.csv`,
  )
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Fetch player stats
onMounted(async () => {
  try {
    const response = await api.get(`/api/stats/players/name/${route.params.playerName}`)
    playerData.value = response.data

    // Sort season stats by season ID if it's an array
    if (Array.isArray(playerData.value.seasonStats)) {
      playerData.value.seasonStats.sort((a, b) => a.SEASON_ID.localeCompare(b.SEASON_ID))
    }
  } catch (error) {
    console.error('Error fetching player stats:', error)
    // Optionally handle 404 or other errors
    if (error.response?.status === 404) {
      // Redirect or show not found message
    }
  } finally {
    loading.value = false
  }
})
</script>
