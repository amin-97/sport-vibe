// src/views/nba/EditorialsView.vue
<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { format } from 'date-fns'

const editorials = ref([])
const selectedTopic = ref('all')
const loading = ref(false)
const error = ref(null)

// Get featured editorial (most recent or featured flag)
const featuredEditorial = computed(
  () => editorials.value.find((ed) => ed.featured) || editorials.value[0],
)

// Get popular editorials for sidebar
const popularEditorials = computed(() =>
  editorials.value.filter((ed) => ed._id !== featuredEditorial.value?._id).slice(0, 4),
)

// Get remaining editorials for grid
const remainingEditorials = computed(() => {
  let filtered = editorials.value.filter(
    (ed) =>
      ed._id !== featuredEditorial.value?._id &&
      !popularEditorials.value.find((pop) => pop._id === ed._id),
  )

  if (selectedTopic.value !== 'all') {
    filtered = filtered.filter((ed) =>
      ed.topics.some((topic) => topic.toLowerCase().includes(selectedTopic.value.toLowerCase())),
    )
  }

  return filtered
})

const getUniqueTopics = computed(() => {
  const topics = new Set()
  editorials.value.forEach((ed) => ed.topics.forEach((topic) => topics.add(topic)))
  return Array.from(topics)
})

const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy')
}

const fetchEditorials = async () => {
  try {
    loading.value = true
    const { data } = await axios.get('/api/nba-editorials')
    editorials.value = data
  } catch (err) {
    console.error('Error fetching editorials:', err)
    error.value = 'Failed to load editorials'
  } finally {
    loading.value = false
  }
}

onMounted(fetchEditorials)
</script>

<template>
  <div v-if="loading" class="text-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
  </div>

  <div v-else-if="error" class="text-center py-12 text-red-600">
    {{ error }}
  </div>

  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900">NBA Editorials</h1>
      <p class="mt-4 text-xl text-gray-600">Analysis and opinions from sports experts</p>
    </div>

    <!-- Topics filter -->
    <div class="mb-8 flex flex-wrap gap-4">
      <button
        @click="selectedTopic = 'all'"
        :class="[
          'px-4 py-2 rounded-md transition-colors',
          selectedTopic === 'all'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50',
        ]"
      >
        All Topics
      </button>
      <button
        v-for="topic in getUniqueTopics"
        :key="topic"
        @click="selectedTopic = topic"
        :class="[
          'px-4 py-2 rounded-md transition-colors',
          selectedTopic === topic
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50',
        ]"
      >
        {{ topic }}
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Featured Editorial -->
      <div v-if="featuredEditorial" class="lg:col-span-2">
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            :src="featuredEditorial.image?.url || '/placeholder-image.png'"
            :alt="featuredEditorial.title"
            class="w-full h-64 object-cover"
          />
          <div class="p-6">
            <div class="flex items-center gap-2 mb-3">
              <span class="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full"
                >Featured</span
              >
              <span class="text-sm text-gray-500"
                >{{ featuredEditorial.readingTime }} min read</span
              >
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-3">
              {{ featuredEditorial.title }}
            </h2>
            <p class="text-gray-600 mb-4">
              {{ featuredEditorial.summary }}
            </p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="topic in featuredEditorial.topics"
                :key="topic"
                class="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded"
              >
                {{ topic }}
              </span>
            </div>
            <div class="flex items-center justify-between mt-6">
              <div class="flex items-center">
                <img
                  :src="featuredEditorial.author?.photoURL || '/placeholder-image.png'"
                  :alt="featuredEditorial.author?.displayName"
                  class="w-10 h-10 rounded-full"
                />
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    {{ featuredEditorial.author?.displayName }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ formatDate(featuredEditorial.createdAt) }}
                  </p>
                </div>
              </div>
              <router-link
                :to="`/nba/editorials/${featuredEditorial.slug}`"
                class="text-primary hover:text-primary/90 font-medium"
              >
                Read Article →
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-lg font-bold mb-4">Popular Editorials</h2>
          <div class="space-y-4">
            <div
              v-for="editorial in popularEditorials"
              :key="editorial._id"
              class="group cursor-pointer border-b last:border-0 pb-4 last:pb-0"
            >
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs text-primary"> {{ editorial.readingTime }} min read </span>
                <span class="text-xs text-gray-500">
                  {{ editorial.topics[0] }}
                </span>
              </div>
              <router-link
                :to="`/nba/editorials/${editorial.slug}`"
                class="text-sm font-medium group-hover:text-primary"
              >
                {{ editorial.title }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Editorial Grid -->
    <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="editorial in remainingEditorials"
        :key="editorial._id"
        class="bg-white shadow-lg rounded-lg overflow-hidden"
      >
        <img
          :src="editorial.image?.url || '/placeholder-image.png'"
          :alt="editorial.title"
          class="w-full h-48 object-cover"
        />
        <div class="p-6">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-sm text-primary">{{ editorial.topics[0] }}</span>
            <span class="text-sm text-gray-500">{{ editorial.readingTime }} min read</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">{{ editorial.title }}</h3>
          <p class="text-gray-600 text-sm mb-4">{{ editorial.summary }}</p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="topic in editorial.topics"
              :key="topic"
              class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {{ topic }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <img
                :src="editorial.author?.photoURL || '/placeholder-image.png'"
                :alt="editorial.author?.displayName"
                class="w-8 h-8 rounded-full"
              />
              <span class="ml-2 text-sm text-gray-600">
                {{ editorial.author?.displayName }}
              </span>
            </div>
            <router-link
              :to="`/nba/editorials/${editorial.slug}`"
              class="text-primary hover:text-primary/90 text-sm font-medium"
            >
              Read More →
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
