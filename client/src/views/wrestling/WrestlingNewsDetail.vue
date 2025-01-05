<!-- src/views/wrestling/WrestlingNewsDetail.vue -->
<template>
  <div v-if="loading" class="text-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
  </div>

  <div v-else-if="error" class="text-center py-12 text-red-600">
    {{ error }}
  </div>

  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Article Header -->
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        <span class="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
          {{ news.category }}
        </span>
        <span class="text-sm text-gray-500">{{ formatDate(news.createdAt) }}</span>
      </div>
      <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ news.title }}</h1>
      <p class="text-xl text-gray-600 mb-6">{{ news.description }}</p>

      <!-- Author Info -->
      <div class="flex items-center gap-4">
        <img
          :src="news.author?.photoURL || '/placeholder-user.png'"
          :alt="news.author?.displayName"
          class="w-12 h-12 rounded-full"
        />
        <div>
          <p class="font-medium text-gray-900">{{ news.author?.displayName }}</p>
          <p class="text-sm text-gray-500">Wrestling Journalist</p>
        </div>
      </div>
    </div>

    <!-- Main Image -->
    <div class="mb-8">
      <img
        :src="news.image?.url || '/placeholder-image.png'"
        :alt="news.title"
        class="w-full h-[500px] object-cover rounded-lg"
      />
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2">
        <div class="prose max-w-none" v-html="news.content"></div>

        <!-- Tags -->
        <div class="mt-8 flex flex-wrap gap-2">
          <span
            v-for="tag in news.tags"
            :key="tag"
            class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Share Buttons -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="font-bold text-gray-900 mb-4">Share This Story</h2>
          <div class="flex gap-4">
            <button class="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
            </button>
            <button class="p-2 rounded-full bg-blue-400 text-white hover:bg-blue-500">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Related Stories -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="font-bold text-gray-900 mb-4">Related Stories</h2>
          <div class="space-y-4">
            <div class="group cursor-pointer">
              <p class="text-sm font-medium text-gray-900 group-hover:text-primary">
                Latest wrestling news and updates...
              </p>
              <span class="text-xs text-gray-500">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { format } from 'date-fns'

const route = useRoute()
const router = useRouter()

const news = ref(null)
const loading = ref(true)
const error = ref(null)

const formatDate = (date) => {
  return format(new Date(date), 'MMMM dd, yyyy')
}

// In WrestlingNewsDetail.vue
const fetchNews = async () => {
  try {
    loading.value = true
    const { data } = await axios.get(`/api/wrestling-news/slug/${route.params.slug}`)
    news.value = data
  } catch (err) {
    console.error('Error fetching news:', err)
    error.value = 'Failed to load news article'
  } finally {
    loading.value = false
  }
}

onMounted(fetchNews)
</script>
