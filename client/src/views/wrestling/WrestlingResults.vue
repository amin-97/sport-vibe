<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ResultCard from '@/shared/ResultCard.vue'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import { useCache } from '@/composables/useCache'
import { wrestlingApi } from '@/services/wrestlingApi'

// Constants
const ITEMS_PER_PAGE = 12
const PROMOTIONS = ['all', 'WWE', 'AEW']

// State
const results = ref([])
const selectedPromotion = ref('all')
const loading = ref(false)
const error = ref(null)
const page = ref(1)
const hasMore = ref(true)
const retryCount = ref(0)

// Cache setup
const { get: getCache, set: setCache, cleanup: cleanupCache } = useCache()

// Computed
const filteredResults = computed(() => {
  if (selectedPromotion.value === 'all') return results.value
  return results.value.filter((result) => result.promotion === selectedPromotion.value)
})

// Methods
const fetchResults = async (pageNum = 1, promotion = 'all') => {
  const cacheKey = `results-${promotion}-${pageNum}`
  const cachedData = getCache(cacheKey)

  if (cachedData) {
    return cachedData
  }

  try {
    loading.value = true
    error.value = null

    const params = {
      page: pageNum,
      limit: ITEMS_PER_PAGE,
      ...(promotion !== 'all' && { promotion }),
    }

    const data = await wrestlingApi.getResults(params)
    setCache(cacheKey, data)
    retryCount.value = 0

    return data
  } catch (err) {
    if (retryCount.value < 3) {
      retryCount.value++
      await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount.value))
      return fetchResults(pageNum, promotion)
    }

    error.value = 'Failed to load results. Please try again.'
    throw err
  } finally {
    loading.value = false
  }
}

const loadMoreResults = async () => {
  if (loading.value || !hasMore.value) return

  page.value++
  const newResults = await fetchResults(page.value, selectedPromotion.value)

  if (newResults.length < ITEMS_PER_PAGE) {
    hasMore.value = false
  }

  results.value = [...results.value, ...newResults]
}

const handlePromotionChange = async (promotion) => {
  selectedPromotion.value = promotion
  results.value = []
  page.value = 1
  hasMore.value = true
  const initialResults = await fetchResults(1, promotion)
  results.value = initialResults
}

// Infinite scroll setup
const { bottomRef } = useInfiniteScroll(() => {
  if (!loading.value && hasMore.value) {
    loadMoreResults()
  }
})

// Lifecycle hooks
onMounted(async () => {
  const initialResults = await fetchResults()
  results.value = initialResults

  // Set up cache cleanup interval
  const cleanup = setInterval(cleanupCache, 60 * 1000)

  onUnmounted(() => {
    clearInterval(cleanup)
  })
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900">Wrestling Results</h1>
      <p class="mt-4 text-xl text-gray-600">Latest match results and event coverage</p>
    </div>

    <!-- Promotion Filter -->
    <div class="mb-8 flex space-x-4">
      <button
        v-for="promotion in PROMOTIONS"
        :key="promotion"
        @click="handlePromotionChange(promotion)"
        :class="[
          'px-4 py-2 rounded-md transition-colors',
          selectedPromotion === promotion
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50',
        ]"
      >
        {{ promotion === 'all' ? 'All Events' : promotion }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !results.length" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
      <button
        @click="() => fetchResults(page, selectedPromotion)"
        class="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
      >
        Try Again
      </button>
    </div>

    <!-- Results Grid -->
    <div v-else>
      <div
        v-if="filteredResults.length"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <ResultCard v-for="result in filteredResults" :key="result._id" :result="result" />
      </div>

      <!-- Infinite Scroll Trigger -->
      <div ref="bottomRef" class="h-4 mt-8">
        <div v-if="loading && results.length" class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>

      <!-- No Results State -->
      <div v-if="!filteredResults.length" class="text-center py-12">
        <p class="text-gray-600">No results found</p>
      </div>
    </div>
  </div>
</template>
