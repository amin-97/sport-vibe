// src/components/HeroSlideshow.vue
<template>
  <div class="relative overflow-hidden rounded-lg">
    <div v-if="loading" class="animate-pulse bg-gray-700 h-64 rounded-lg"></div>

    <div v-else class="relative">
      <transition-group name="fade" mode="out-in">
        <div v-for="item in currentItems" :key="item.id" class="relative">
          <img
            :src="item.image"
            :alt="item.title"
            class="w-full h-64 object-cover rounded-lg"
            loading="lazy"
          />
          <div
            class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent"
          >
            <h3 class="text-white font-semibold">{{ item.title }}</h3>
            <p class="text-gray-200 text-sm">{{ item.excerpt }}</p>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useNewsStore } from '@/stores/news'

const loading = ref(true)
const currentItemIndex = ref(0)
const newsStore = useNewsStore()

const currentItems = computed(() => {
  const items = newsStore.featuredItems
  return items.length > 0 ? [items[currentItemIndex.value]] : []
})

let slideInterval

const nextSlide = () => {
  if (newsStore.featuredItems.length > 1) {
    currentItemIndex.value = (currentItemIndex.value + 1) % newsStore.featuredItems.length
  }
}

onMounted(async () => {
  await newsStore.fetchFeaturedItems()
  loading.value = false
  slideInterval = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
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
