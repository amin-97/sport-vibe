<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { format } from 'date-fns'

const news = ref([])
const selectedCategory = ref('all')
const loading = ref(false)
const error = ref(null)

// Get featured news (most recent or most viewed)
const featuredNews = computed(() => news.value.find((oneNews) => oneNews.featured) || news.value[0])

// Get other news excluding featured
const otherNews = computed(() => news.value.filter((oneNews) => oneNews !== featuredNews.value))

const filteredNews = computed(() => {
  if (selectedCategory.value === 'all') return otherNews.value
  return otherNews.value.filter((oneNews) => oneNews.category === selectedCategory.value)
})

// Get unique teams from all news
const getUniqueTeams = computed(() => {
  const teams = new Set()
  news.value.forEach((oneNews) => {
    if (oneNews.teams) {
      oneNews.teams.forEach((team) => teams.add(team))
    }
  })
  return Array.from(teams)
})

// Get popular tags (limit to top 10)
const getPopularTags = computed(() => {
  const tagCount = {}
  news.value.forEach((oneNews) => {
    if (oneNews.tags) {
      oneNews.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    }
  })
  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag)
})

const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy')
}

const fetchArticles = async () => {
  try {
    loading.value = true
    const { data } = await axios.get('/api/nba-news')
    news.value = data
  } catch (err) {
    console.error('Error fetching news:', err)
    error.value = 'Failed to load news'
  } finally {
    loading.value = false
  }
}

onMounted(fetchArticles)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900">NBA News</h1>
      <p class="mt-4 text-xl text-gray-600">Latest updates from around the league</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 text-red-600">
      {{ error }}
    </div>

    <div v-else>
      <!-- Categories -->
      <div class="mb-8 flex flex-wrap gap-4">
        <button
          v-for="category in [
            'all',
            'news',
            'trades',
            'rumors',
            'injuries',
            'game-recap',
            'analysis',
          ]"
          :key="category"
          @click="selectedCategory = category"
          :class="[
            'px-4 py-2 rounded-md transition-colors',
            selectedCategory === category
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50',
          ]"
        >
          {{ category === 'all' ? 'All News' : category.replace('-', ' ').toUpperCase() }}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Featured Article -->
        <div v-if="featuredNews" class="lg:col-span-2">
          <router-link :to="`/nba/news/${featuredNews.slug}`" class="block">
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                :src="featuredNews.image?.url || '/placeholder-image.png'"
                :alt="featuredNews.title"
                class="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div class="p-6">
                <div class="flex items-center gap-2 mb-3">
                  <span class="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    {{ featuredNews.category }}
                  </span>
                  <span class="text-sm text-gray-500">
                    {{ formatDate(featuredNews.createdAt) }}
                  </span>
                </div>
                <h2
                  class="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors"
                >
                  {{ featuredNews.title }}
                </h2>
                <p class="text-gray-600 mb-4">
                  {{ featuredNews.description }}
                </p>
                <div
                  class="inline-flex items-center text-primary hover:text-primary/90 font-medium"
                >
                  Read Full Story →
                </div>
              </div>
            </div>
          </router-link>

          <!-- Articles Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div
              v-for="news in filteredNews"
              :key="news._id"
              class="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 group hover:shadow-xl hover:-translate-y-2 hover:scale-105"
            >
              <router-link :to="`/nba/news/${news.slug}`" class="block">
                <div class="relative overflow-hidden">
                  <img
                    :src="news.image?.url || '/placeholder-image.png'"
                    :alt="news.title"
                    class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div
                    class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"
                  ></div>
                </div>
              </router-link>

              <div class="p-4">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-sm text-primary">{{ news.category }}</span>
                  <span class="text-sm text-gray-500">
                    {{ formatDate(news.createdAt) }}
                  </span>
                </div>

                <router-link :to="`/nba/news/${news.slug}`" class="block">
                  <h3
                    class="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300"
                  >
                    {{ news.title }}
                  </h3>
                </router-link>

                <p class="text-sm text-gray-600 mb-3">
                  {{ news.description }}
                </p>

                <div class="flex flex-wrap gap-2 mb-3">
                  <span
                    v-for="tag in news.tags"
                    :key="tag"
                    class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                  >
                    {{ tag }}
                  </span>
                </div>

                <router-link
                  :to="`/nba/news/${news.slug}`"
                  class="text-sm text-primary hover:text-primary/90 font-medium inline-flex items-center group/link"
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

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Teams mentioned -->
          <div class="bg-white shadow-lg rounded-lg p-6">
            <h2 class="text-lg font-bold mb-4">Featured Teams</h2>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="team in getUniqueTeams"
                :key="team"
                class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
              >
                {{ team }}
              </button>
            </div>
          </div>

          <!-- Popular Topics -->
          <div class="bg-white shadow-lg rounded-lg p-6">
            <h2 class="text-lg font-bold mb-4">Popular Topics</h2>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in getPopularTags"
                :key="tag"
                class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
