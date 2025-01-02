// src/components/HeroSlideshow.vue
<template>
  <div class="bg-white rounded-lg shadow-lg p-4">
    <!-- Tab Buttons -->
    <div class="flex space-x-4 mb-4 border-b">
      <button
        @click="activeTab = 'news'"
        :class="[
          'px-4 py-2 font-medium focus:outline-none',
          activeTab === 'news'
            ? 'text-accent border-b-2 border-accent'
            : 'text-gray-600 hover:text-gray-900',
        ]"
      >
        Latest News
      </button>
      <button
        @click="activeTab = 'results'"
        :class="[
          'px-4 py-2 font-medium focus:outline-none',
          activeTab === 'results'
            ? 'text-accent border-b-2 border-accent'
            : 'text-gray-600 hover:text-gray-900',
        ]"
      >
        Recent Results
      </button>
    </div>

    <!-- Slideshow Container -->
    <div class="relative h-[400px] overflow-hidden">
      <!-- News Slides -->
      <TransitionGroup v-if="activeTab === 'news'" name="slide" tag="div" class="h-full">
        <div
          v-for="(news, index) in newsItems"
          :key="news.id"
          v-show="currentNewsIndex === index"
          class="absolute inset-0 transition-opacity duration-500"
        >
          <img :src="news.image" :alt="news.title" class="w-full h-48 object-cover rounded-t-lg" />
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">{{ news.title }}</h3>
            <p class="text-gray-600 text-sm">{{ news.excerpt }}</p>
            <router-link
              :to="news.link"
              class="mt-4 inline-flex items-center text-accent hover:text-accent-dark"
            >
              Read More →
            </router-link>
          </div>
        </div>
      </TransitionGroup>

      <!-- Results Slides -->
      <TransitionGroup v-else name="slide" tag="div" class="h-full">
        <div
          v-for="(result, index) in results"
          :key="result.id"
          v-show="currentResultIndex === index"
          class="absolute inset-0 transition-opacity duration-500"
        >
          <div class="p-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-lg font-semibold mb-2">{{ result.event }}</div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-700">{{ result.date }}</span>
                <span class="text-sm text-gray-500">{{ result.venue }}</span>
              </div>
              <div class="text-center py-4">
                <div class="font-bold">{{ result.mainEvent }}</div>
                <div class="text-accent mt-2">{{ result.winner }}</div>
              </div>
            </div>
            <router-link
              :to="result.link"
              class="mt-4 inline-flex items-center text-accent hover:text-accent-dark"
            >
              View Details →
            </router-link>
          </div>
        </div>
      </TransitionGroup>

      <!-- Navigation Dots -->
      <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        <button
          v-for="(_, index) in activeTab === 'news' ? newsItems : results"
          :key="index"
          @click="activeTab === 'news' ? (currentNewsIndex = index) : (currentResultIndex = index)"
          :class="[
            'w-2 h-2 rounded-full transition-all',
            (activeTab === 'news' ? currentNewsIndex : currentResultIndex) === index
              ? 'bg-accent w-4'
              : 'bg-gray-300 hover:bg-gray-400',
          ]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const activeTab = ref('news')
const currentNewsIndex = ref(0)
const currentResultIndex = ref(0)

// Sample data - replace with your actual data
const newsItems = ref([
  {
    id: 1,
    title: 'Roman Reigns Retains Title at Royal Rumble',
    excerpt: 'In a stunning match, Roman Reigns continues his historic championship reign...',
    image: '/api/placeholder/400/200',
    link: '/wrestling/news/1',
  },
  {
    id: 2,
    title: 'Lakers Make Blockbuster Trade',
    excerpt: 'The Los Angeles Lakers have made a major move before the trade deadline...',
    image: '/api/placeholder/400/200',
    link: '/nba/news/1',
  },
  {
    id: 3,
    title: 'AEW Revolution Announced',
    excerpt: 'AEW has announced their next major pay-per-view event...',
    image: '/api/placeholder/400/200',
    link: '/wrestling/news/2',
  },
  {
    id: 4,
    title: 'NBA All-Star Starters Revealed',
    excerpt: "The NBA has announced the starting lineups for this year's All-Star game...",
    image: '/api/placeholder/400/200',
    link: '/nba/news/2',
  },
])

const results = ref([
  {
    id: 1,
    event: 'WWE Royal Rumble 2024',
    date: 'January 27, 2024',
    venue: 'Tropicana Field',
    mainEvent: 'Universal Championship Match',
    winner: 'Roman Reigns def. Randy Orton',
    link: '/wrestling/results/1',
  },
  {
    id: 2,
    event: 'NBA Regular Season',
    date: 'January 28, 2024',
    venue: 'Crypto.com Arena',
    mainEvent: 'Lakers vs Warriors',
    winner: 'Lakers win 123-111',
    link: '/nba/results/1',
  },
  {
    id: 3,
    event: 'AEW Dynamite',
    date: 'January 31, 2024',
    venue: 'UBS Arena',
    mainEvent: 'World Championship Match',
    winner: 'Samoa Joe def. HOOK',
    link: '/wrestling/results/2',
  },
  {
    id: 4,
    event: 'NBA Regular Season',
    date: 'February 1, 2024',
    venue: 'Madison Square Garden',
    mainEvent: 'Knicks vs Heat',
    winner: 'Knicks win 115-109',
    link: '/nba/results/2',
  },
])

// Auto-advance slides
let slideInterval

const startSlideshow = () => {
  slideInterval = setInterval(() => {
    if (activeTab.value === 'news') {
      currentNewsIndex.value = (currentNewsIndex.value + 1) % newsItems.value.length
    } else {
      currentResultIndex.value = (currentResultIndex.value + 1) % results.value.length
    }
  }, 5000) // Change slide every 5 seconds
}

onMounted(() => {
  startSlideshow()
})

onUnmounted(() => {
  clearInterval(slideInterval)
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
