<script setup>
import { defineProps } from 'vue'
import { useImageLoader } from '@/composables/useImageLoader'
import { format } from 'date-fns'

const props = defineProps({
  result: {
    type: Object,
    required: true,
  },
})

const { imageLoaded, handleImageLoad } = useImageLoader()

const formatDate = (date) => {
  return format(new Date(date), 'MMMM dd, yyyy')
}
</script>

<template>
  <router-link
    :to="`/wrestling/results/${result.slug}`"
    class="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
  >
    <div class="relative aspect-video">
      <img
        :src="result.coverImage?.url || '/placeholder-event.jpg'"
        :alt="result.name"
        class="w-full h-full object-cover"
        :class="{ 'opacity-0': !imageLoaded[result._id] }"
        @load="handleImageLoad(result._id)"
        loading="lazy"
      />
      <div v-if="!imageLoaded[result._id]" class="absolute inset-0 bg-gray-200 animate-pulse"></div>
    </div>

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
</template>
