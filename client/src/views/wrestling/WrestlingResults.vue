<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900">Wrestling Results</h1>
      <p class="mt-4 text-xl text-gray-600">Latest match results and event coverage</p>
    </div>

    <!-- Promotion Filter -->
    <div class="mb-8 flex space-x-4">
      <button
        v-for="promotion in ['all', 'WWE', 'AEW']"
        :key="promotion"
        @click="selectedPromotion = promotion"
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
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
      <button
        @click="fetchResults"
        class="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
      >
        Try Again
      </button>
    </div>

    <!-- Results Grid -->
    <div
      v-else-if="filteredResults.length"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <router-link
        v-for="result in filteredResults"
        :key="result._id"
        :to="`/wrestling/results/${result.slug}`"
        class="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
      >
        <img
          :src="result.coverImage?.url || '/placeholder-event.jpg'"
          :alt="result.name"
          class="w-full h-48 object-cover"
        />
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-900 line-clamp-1">{{ result.name }}</h2>
            <span
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="
                result.promotion === 'WWE' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              "
            >
              {{ result.promotion }}
            </span>
          </div>

          <div class="flex items-center gap-2 text-gray-600 mb-3">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {{ formatDate(result.date) }}
          </div>

          <p class="text-gray-600 mb-4">{{ result.venue }}</p>

          <div class="flex flex-wrap gap-2">
            <span class="text-sm text-gray-500"> {{ result.matches?.length || 0 }} matches </span>
            <span class="text-gray-400">•</span>
            <span class="text-sm text-gray-500">
              By {{ result.author?.displayName || 'Anonymous' }}
            </span>
          </div>
        </div>
      </router-link>
    </div>

    <!-- No Results State -->
    <div v-else class="text-center py-12">
      <p class="text-gray-600">No results found</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { format } from 'date-fns'

const results = ref([])
const selectedPromotion = ref('all')
const loading = ref(false)
const error = ref(null)

const filteredResults = computed(() => {
  if (selectedPromotion.value === 'all') return results.value
  return results.value.filter((result) => result.promotion === selectedPromotion.value)
})

const formatDate = (date) => {
  return format(new Date(date), 'MMMM dd, yyyy')
}

const fetchResults = async () => {
  try {
    loading.value = true
    error.value = null
    const { data } = await axios.get('/api/wrestling-results')
    results.value = data.sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch (err) {
    console.error('Error fetching results:', err)
    error.value = 'Failed to load results. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchResults)
</script>
