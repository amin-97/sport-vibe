<template>
  <div v-if="loading" class="text-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
  </div>

  <div v-else-if="error" class="text-center py-12 text-red-600">
    {{ error }}
  </div>

  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Cover Image -->
      <img
        :src="result.coverImage?.url || '/placeholder-image.png'"
        :alt="result.name"
        class="w-full h-64 object-cover"
      />

      <div class="p-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">{{ result.name }}</h1>
          <span
            class="px-3 py-1 rounded-full text-sm font-medium"
            :class="
              result.promotion === 'WWE' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            "
          >
            {{ result.promotion }}
          </span>
        </div>

        <!-- Event Info -->
        <div class="mt-4 text-gray-600">
          <p>{{ formatDate(result.date) }}</p>
          <p>{{ result.venue }}</p>
        </div>

        <!-- Matches -->
        <div class="mt-8 space-y-8">
          <div
            v-for="(match, index) in result.matches"
            :key="index"
            class="bg-gray-50 rounded-lg p-6 animate-slideUp relative"
            :style="{ animationDelay: `${index * 150}ms` }"
          >
            <!-- Championship Banner -->
            <div
              v-if="match.title"
              class="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold"
            >
              {{ match.title }} Championship Match
            </div>

            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-semibold">
                {{ match.type }}
                <span
                  v-if="match.stipulation && match.stipulation !== 'Regular Match'"
                  class="text-sm text-gray-600 ml-2"
                >
                  ({{ match.stipulation }})
                </span>
              </h3>
              <span class="text-gray-600">Match #{{ match.matchOrder }}</span>
            </div>

            <div class="space-y-4">
              <p class="text-lg">{{ match.wrestlers.join(' vs ') }}</p>

              <div class="flex justify-between items-center">
                <p class="font-medium text-primary">Winner: {{ match.winner }}</p>
                <p class="text-gray-600">Method: {{ match.method }}</p>
              </div>

              <!-- Highlights -->
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Match Highlights</h4>
                <p class="text-gray-700 whitespace-pre-line">{{ match.highlights }}</p>
              </div>

              <!-- Match Thoughts -->
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Match Thoughts</h4>
                <p class="text-gray-700">{{ match.thoughts }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Images -->
        <div v-if="result.additionalImages?.length" class="mt-8">
          <h3 class="text-xl font-semibold mb-4">Event Gallery</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <img
              v-for="(image, index) in result.additionalImages"
              :key="index"
              :src="image.url"
              :alt="`Event image ${index + 1}`"
              class="rounded-lg w-full h-48 object-cover hover:opacity-75 transition-opacity cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/utils/axios'
import { format } from 'date-fns'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const result = ref(null)
const loading = ref(true)
const error = ref(null)

const formatDate = (date) => {
  return format(new Date(date), 'MMMM dd, yyyy')
}

const fetchResult = async () => {
  try {
    loading.value = true
    const { data } = await api.get(`/api/wrestling-results/slug/${route.params.slug}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    result.value = data
  } catch (err) {
    console.error('Error fetching result:', err)
    error.value = 'Failed to load event results'
  } finally {
    loading.value = false
  }
}

onMounted(fetchResult)
</script>

<style scoped>
.animate-slideUp {
  animation: slideUp 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
