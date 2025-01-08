import { ref, onMounted, onUnmounted } from 'vue'
import { useStorage } from '@/composables/useStorage'
import { nbaApi } from '@/services/nbaApi'

export function useNBAStats() {
  // Local storage cache
  const { getItem, setItem } = useStorage()
  const CACHE_KEY = 'nba_players_cache'
  const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

  // State
  const allPlayers = ref([])
  const loading = ref(false)
  const error = ref(null)
  const lastFetchTime = ref(0)

  // Data fetching with cache
  const fetchPlayers = async (force = false) => {
    const now = Date.now()
    const cached = getItem(CACHE_KEY)

    // Return cached data if valid
    if (!force && cached?.data && now - cached.timestamp < CACHE_EXPIRY) {
      allPlayers.value = cached.data
      return
    }

    try {
      loading.value = true
      const response = await nbaApi.getPlayers()

      if (response.data) {
        // Process and deduplicate players
        const processedPlayers = deduplicatePlayers(response.data.stats)
        allPlayers.value = processedPlayers

        // Cache the results
        setItem(CACHE_KEY, {
          data: processedPlayers,
          timestamp: now,
        })

        lastFetchTime.value = now
      }
    } catch (err) {
      error.value = 'Failed to load players'
      console.error('Error:', err)
    } finally {
      loading.value = false
    }
  }

  // Data processing
  const deduplicatePlayers = (players) => {
    const playerMap = new Map()

    players.forEach((player) => {
      if (
        !playerMap.has(player.PLAYER_ID) ||
        player.SEASON_ID > playerMap.get(player.PLAYER_ID).SEASON_ID
      ) {
        playerMap.set(player.PLAYER_ID, player)
      }
    })

    return Array.from(playerMap.values())
  }

  // Prefetch next page data
  const prefetchPlayerDetails = async (playerId) => {
    try {
      await nbaApi.getPlayerStats(playerId)
    } catch (err) {
      console.error('Prefetch error:', err)
    }
  }

  // Auto-refresh data if stale
  const checkAndRefreshData = () => {
    const now = Date.now()
    if (now - lastFetchTime.value > CACHE_EXPIRY) {
      fetchPlayers(true)
    }
  }

  // Setup
  onMounted(() => {
    fetchPlayers()

    // Set up periodic cache check
    const interval = setInterval(checkAndRefreshData, CACHE_EXPIRY)

    onUnmounted(() => {
      clearInterval(interval)
    })
  })

  return {
    allPlayers,
    loading,
    error,
    fetchPlayers,
    prefetchPlayerDetails,
  }
}
