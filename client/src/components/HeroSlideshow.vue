// src/components/HeroSlideshow.vue
<template>
  <div class="relative overflow-hidden rounded-lg bg-gray-900">
    <div class="relative h-64">
      <transition-group name="fade" mode="out-in">
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
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
            <div class="absolute bottom-0 left-0 p-4">
              <h3 class="text-white font-semibold text-lg">{{ item.title }}</h3>
              <p class="text-gray-200 text-sm mt-1">{{ item.excerpt }}</p>
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

      <!-- Navigation Dots -->
      <div class="absolute bottom-4 right-4 flex space-x-2">
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

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'

const newsItems = ref([])
const currentNewsIndex = ref(0)
const loading = ref(true)
const error = ref(null)

// Fetch latest NBA news
const fetchLatestNews = async () => {
  try {
    loading.value = true
    const { data } = await axios.get('/api/nba-news')

    // Sort by most recent and take top 4
    const sortedNews = data
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4)
      .map((article) => ({
        id: article._id,
        title: article.title,
        excerpt: article.description,
        image: article.image?.url || '/placeholder-image.png',
        link: `/nba/news/${article.slug}`,
      }))

    newsItems.value = sortedNews
  } catch (err) {
    console.error('Error fetching NBA news:', err)
    error.value = 'Failed to load news'
    newsItems.value = [
      {
        id: 1,
        title: 'Latest NBA Updates',
        excerpt: 'Check back soon for the latest NBA news and updates...',
        image: '/placeholder-image.png',
        link: '/nba/news',
      },
    ]
  } finally {
    loading.value = false
  }
}

let slideInterval
const startSlideshow = () => {
  slideInterval = setInterval(() => {
    currentNewsIndex.value = (currentNewsIndex.value + 1) % newsItems.value.length
  }, 5000)
}

onMounted(() => {
  fetchLatestNews()
  startSlideshow()
})

onBeforeUnmount(() => {
  clearInterval(slideInterval)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
