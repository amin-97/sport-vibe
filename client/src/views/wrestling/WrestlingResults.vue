<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { format } from 'date-fns'

const results = ref([])
const selectedPromotion = ref('all')
const loading = ref(false)
const error = ref(null)

const formatDate = (date) => {
  return format(new Date(date), 'MMMM dd, yyyy')
}

const filteredResults = computed(() => {
  if (selectedPromotion.value === 'all') return results.value
  return results.value.filter((result) => result.category.toLowerCase() === selectedPromotion.value)
})

const fetchResults = async () => {
  try {
    loading.value = true
    const { data } = await axios.get('/api/results')
    results.value = data
  } catch (err) {
    error.value = 'Failed to fetch results'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchResults)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900">Wrestling Results</h1>
      <p class="mt-4 text-xl text-gray-600">Latest match results and event coverage</p>
    </div>

    <!-- Promotion Filter -->
    <div class="mb-8 flex space-x-4">
      <button
        v-for="promotion in ['all', 'wwe', 'aew']"
        :key="promotion"
        @click="selectedPromotion = promotion"
        :class="[
          'px-4 py-2 rounded-md',
          selectedPromotion === promotion
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50',
        ]"
      >
        {{ promotion === 'all' ? 'All Events' : promotion.toUpperCase() }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 text-red-600">
      {{ error }}
    </div>

    <!-- Results Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <router-link
        v-for="result in filteredResults"
        :key="result._id"
        :to="`/wrestling/results/${result._id}`"
        class="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
      >
        <img
          :src="result.image?.url || '/placeholder-image.png'"
          :alt="result.title"
          class="w-full h-48 object-cover"
        />
        <div class="p-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900">{{ result.title }}</h2>
            <span
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="
                result.category === 'wwe' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              "
            >
              {{ result.category.toUpperCase() }}
            </span>
          </div>

          <div class="mt-4 flex items-center gap-2 text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {{ formatDate(result.createdAt) }}
          </div>

          <p class="mt-2 text-gray-500 line-clamp-2">{{ result.description }}</p>

          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="(result, index) in result.results.slice(0, 2)"
              :key="index"
              class="text-sm text-gray-600"
            >
              {{ result }}
              <span v-if="index < 1" class="mx-1">•</span>
            </span>
            <span v-if="result.results.length > 2" class="text-sm text-gray-400">
              +{{ result.results.length - 2 }} more
            </span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>
