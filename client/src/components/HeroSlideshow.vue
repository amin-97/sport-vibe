//src/components/HeroSlideshow.vue
<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import api from '@/utils/axios'

const newsItems = ref([])
const currentNewsIndex = ref(0)
const loading = ref(true)
const error = ref(null)
let abortController = null

const transformNewsItem = (article) => {
  try {
    return {
      id: article._id || Date.now(),
      title: article.title || 'Untitled',
      excerpt: article.description || 'No description available',
      image: article.image?.url || '/placeholder-image.png',
      link: article.slug ? `/nba/news/${article.slug}` : '/nba/news',
      createdAt: article.createdAt || new Date().toISOString(),
    }
  } catch (err) {
    console.error('Error transforming news item:', err)
    return null
  }
}

const fetchLatestNews = async () => {
  if (abortController) {
    abortController.abort()
  }

  abortController = new AbortController()

  try {
    loading.value = true
    error.value = null

    const { data } = await api.get('/api/nba-news', {
      signal: abortController.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid data format received')
    }

    const validNews = data
      .map(transformNewsItem)
      .filter((item) => item !== null)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4)

    if (validNews.length === 0) {
      throw new Error('No valid news items found')
    }

    newsItems.value = validNews
  } catch (err) {
    if (!abortController.signal.aborted) {
      console.error('Error fetching NBA news:', err)
      error.value = 'Failed to load news'
      newsItems.value = [
        {
          id: 'fallback',
          title: 'Latest NBA Updates',
          excerpt: 'Check back soon for the latest NBA news and updates...',
          image: '/placeholder-image.png',
          link: '/nba/news',
        },
      ]
    }
  } finally {
    if (!abortController.signal.aborted) {
      loading.value = false
    }
  }
}

let slideInterval = null

const startSlideshow = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }

  if (newsItems.value.length > 1) {
    slideInterval = setInterval(() => {
      currentNewsIndex.value = (currentNewsIndex.value + 1) % newsItems.value.length
    }, 5000)
  }
}

const cleanup = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = null
  }
  if (abortController) {
    abortController.abort()
    abortController = null
  }
}

watch(newsItems, () => {
  currentNewsIndex.value = 0
  startSlideshow()
})

onMounted(async () => {
  await fetchLatestNews()
  startSlideshow()
})

onBeforeUnmount(() => {
  cleanup()
})
</script>

<template>
  <div class="relative overflow-hidden rounded-lg bg-gray-900">
    <div v-if="loading" class="relative h-64 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
    </div>

    <div v-else-if="error" class="relative h-64 flex items-center justify-center">
      <div class="text-white text-center">
        <p>{{ error }}</p>
        <button
          @click="fetchLatestNews"
          class="mt-4 px-4 py-2 bg-accent text-white rounded hover:bg-accent/80"
        >
          Retry
        </button>
      </div>
    </div>

    <div v-else class="relative h-64">
      <transition-group name="slide-fade">
        <div
          v-for="(item, index) in newsItems"
          :key="item.id"
          v-show="index === currentNewsIndex"
          class="absolute inset-0"
        >
          <img
            :src="item.image"
            :alt="item.title"
            class="w-full h-full object-cover"
            loading="lazy"
            @error="item.image = '/placeholder-image.png'"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
            <div class="absolute bottom-0 left-0 p-4">
              <h3 class="text-white font-semibold text-lg line-clamp-2">{{ item.title }}</h3>
              <p class="text-gray-200 text-sm mt-1 line-clamp-2">{{ item.excerpt }}</p>
              <router-link
                :to="item.link"
                class="inline-flex items-center text-accent hover:text-accent/80 mt-2"
              >
                Read more
                <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </transition-group>

      <div v-if="newsItems.length > 1" class="absolute bottom-4 right-4 flex space-x-2">
        <button
          v-for="(_, index) in newsItems"
          :key="index"
          @click="currentNewsIndex = index"
          class="w-2 h-2 rounded-full transition-colors"
          :class="index === currentNewsIndex ? 'bg-accent' : 'bg-gray-400'"
        >
          <span class="sr-only">Slide {{ index + 1 }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
