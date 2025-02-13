<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/utils/axios'
import { format } from 'date-fns'

const news = ref([])
const selectedCategory = ref('all')
const loading = ref(false)
const error = ref(null)

const filteredNews = computed(() => {
  if (selectedCategory.value === 'all') return news.value
  return news.value.filter((item) => item.category === selectedCategory.value)
})

const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy')
}

const fetchNews = async () => {
  try {
    loading.value = true
    const { data } = await api.get('/api/wrestling-news')
    // Filter for only wrestling news (wwe and aew categories)
    news.value = data.filter((item) => ['wwe', 'aew'].includes(item.category))
  } catch (err) {
    error.value = 'Failed to fetch news'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchNews)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900">Wrestling News</h1>
      <p class="mt-4 text-xl text-gray-600">Latest updates from WWE and AEW</p>
    </div>

    <!-- News Filter -->
    <div class="mb-8 flex space-x-4">
      <button
        @click="selectedCategory = 'all'"
        :class="[
          'px-4 py-2 rounded-md',
          selectedCategory === 'all'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50',
        ]"
      >
        All News
      </button>
      <button
        @click="selectedCategory = 'wwe'"
        :class="[
          'px-4 py-2 rounded-md',
          selectedCategory === 'wwe'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50',
        ]"
      >
        WWE
      </button>
      <button
        @click="selectedCategory = 'aew'"
        :class="[
          'px-4 py-2 rounded-md',
          selectedCategory === 'aew'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50',
        ]"
      >
        AEW
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

    <!-- News Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="item in filteredNews"
        :key="item._id"
        class="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 group hover:shadow-xl hover:-translate-y-2"
      >
        <router-link :to="`/wrestling/news/${item.slug}`" class="block">
          <img
            :src="item.image?.url || '/placeholder-image.png'"
            :alt="item.title"
            class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </router-link>

        <div class="p-6">
          <span
            :class="[
              'text-sm font-medium',
              item.category === 'wwe' ? 'text-red-600' : 'text-blue-600',
            ]"
          >
            {{ item.category.toUpperCase() }}
          </span>

          <router-link :to="`/wrestling/news/${item.slug}`" class="block">
            <h2
              class="mt-2 text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors"
            >
              {{ item.title }}
            </h2>
          </router-link>

          <p class="mt-2 text-gray-600 line-clamp-3">{{ item.description }}</p>

          <!-- Tags -->
          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="tag in item.tags"
              :key="tag"
              class="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-md"
            >
              {{ tag }}
            </span>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <span class="text-sm text-gray-500">{{ formatDate(item.createdAt) }}</span>
            <router-link
              :to="`/wrestling/news/${item.slug}`"
              class="text-primary hover:text-primary/90 inline-flex items-center group/link"
            >
              Read More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 ml-1 transition-transform group-hover/link:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
