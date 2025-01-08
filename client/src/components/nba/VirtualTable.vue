//components/nba/VirtualTable.vue
<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  players: {
    type: Array,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    default: 50,
  },
  rowHeight: {
    type: Number,
    default: 52,
  },
  visibleRows: {
    type: Number,
    default: 15,
  },
  sortBy: {
    type: String,
    default: 'name',
  },
  sortDirection: {
    type: String,
    default: 'asc',
  },
})

const emit = defineEmits(['sort', 'player-hover', 'page-change'])
const router = useRouter()
const containerRef = ref(null)
const scrollTop = ref(0)
const currentPage = ref(1)
const bufferSize = 5

// Pagination calculations
const totalPages = computed(() => Math.ceil(props.players.length / props.itemsPerPage))

const paginatedPlayers = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return props.players.slice(start, end)
})

// Virtual scrolling calculations
const totalHeight = computed(() => paginatedPlayers.value.length * props.rowHeight)

const visibleRange = computed(() => {
  const start = Math.floor(scrollTop.value / props.rowHeight) - bufferSize
  const end = start + props.visibleRows + 2 * bufferSize

  return {
    start: Math.max(0, start),
    end: Math.min(paginatedPlayers.value.length, end),
  }
})

const visiblePlayers = computed(() => {
  return paginatedPlayers.value.slice(visibleRange.value.start, visibleRange.value.end)
})

const offsetY = computed(() => visibleRange.value.start * props.rowHeight)

// Event handlers
const handleScroll = (event) => {
  scrollTop.value = event.target.scrollTop
}

const handleSort = (column) => {
  emit('sort', column)
}

const handlePlayerHover = (player) => {
  emit('player-hover', player)
}

const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    scrollTop.value = 0 // Reset scroll position
    if (containerRef.value) {
      containerRef.value.scrollTop = 0
    }
    emit('page-change', page)
  }
}

const navigateToPlayer = (player) => {
  const playerUrlName = player.DISPLAY_FIRST_LAST.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')

  router.push({
    name: 'PlayerStats',
    params: { playerName: playerUrlName },
  })
}

const getSortIcon = (column) => {
  if (props.sortBy !== column) return '↕️'
  return props.sortDirection === 'asc' ? '↑' : '↓'
}

// Reset page when data changes
watch(
  () => props.players,
  () => {
    currentPage.value = 1
    scrollTop.value = 0
  },
)

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div class="flex flex-col bg-white rounded-lg shadow">
    <!-- Table Container -->
    <div ref="containerRef" class="relative h-[600px] overflow-auto">
      <!-- Fixed Header -->
      <div class="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
        <div class="flex">
          <div
            class="flex-1 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            @click="handleSort('name')"
          >
            Name {{ getSortIcon('name') }}
          </div>
          <div
            class="flex-1 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            @click="handleSort('team')"
          >
            Team {{ getSortIcon('team') }}
          </div>
          <div
            class="flex-1 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            @click="handleSort('age')"
          >
            Age {{ getSortIcon('age') }}
          </div>
        </div>
      </div>

      <!-- Virtual Scroll Container -->
      <div class="relative w-full" :style="{ height: `${totalHeight}px` }">
        <div class="absolute w-full" :style="{ transform: `translateY(${offsetY}px)` }">
          <div
            v-for="player in visiblePlayers"
            :key="player.PLAYER_ID"
            class="flex hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
            :style="{ height: `${rowHeight}px` }"
            @click="navigateToPlayer(player)"
            @mouseenter="handlePlayerHover(player)"
          >
            <div class="flex-1 px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-blue-600 hover:text-blue-800">
                {{ player.DISPLAY_FIRST_LAST }}
              </div>
            </div>
            <div class="flex-1 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ player.TEAM_ABBREVIATION }}
            </div>
            <div class="flex-1 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ player.PLAYER_AGE }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
      <div class="flex-1 flex justify-between sm:hidden">
        <!-- Mobile pagination -->
        <button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <!-- Results count -->
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">
              {{ (currentPage - 1) * itemsPerPage + 1 }}
            </span>
            to
            <span class="font-medium">
              {{ Math.min(currentPage * itemsPerPage, props.players.length) }}
            </span>
            of
            <span class="font-medium">{{ props.players.length }}</span>
            results
          </p>
        </div>
        <!-- Desktop pagination -->
        <div class="flex space-x-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="handlePageChange(page)"
            :class="[
              'px-3 py-1 border rounded-md text-sm',
              currentPage === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'text-gray-700 border-gray-300 hover:bg-gray-50',
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
