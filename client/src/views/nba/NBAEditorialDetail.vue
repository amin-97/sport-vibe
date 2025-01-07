// src/views/nba/NBAEditorialDetail.vue
<template>
  <div v-if="loading" class="text-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
  </div>

  <div v-else-if="error" class="text-center py-12 text-red-600">
    {{ error }}
  </div>

  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Editorial Header -->
    <div class="mb-8">
      <!-- Topics and Reading Time -->
      <div class="flex items-center gap-2 mb-4">
        <span
          v-for="topic in editorial.topics"
          :key="topic"
          class="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
        >
          {{ topic }}
        </span>
        <span class="text-sm text-gray-500">{{ editorial.readingTime }} min read</span>
      </div>

      <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ editorial.title }}</h1>
      <p class="text-xl text-gray-600 mb-6">{{ editorial.summary }}</p>

      <!-- Author Info -->
      <div class="flex items-center gap-4">
        <img
          :src="editorial.author?.photoURL || '/placeholder-user.png'"
          :alt="editorial.author?.displayName"
          class="w-12 h-12 rounded-full"
        />
        <div>
          <p class="font-medium text-gray-900">{{ editorial.author?.displayName }}</p>
          <p class="text-sm text-gray-500">{{ formatDate(editorial.createdAt) }}</p>
        </div>
      </div>
    </div>

    <!-- Main Image -->
    <div class="mb-8">
      <img
        :src="editorial.image?.url || '/placeholder-image.png'"
        :alt="editorial.title"
        class="w-full h-[400px] object-cover rounded-lg"
      />
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2">
        <!-- Key Arguments -->
        <div class="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Key Arguments</h2>
          <ul class="space-y-2">
            <li
              v-for="(argument, index) in editorial.keyArguments"
              :key="index"
              class="flex items-start gap-2"
            >
              <span class="text-primary font-bold">•</span>
              <span>{{ argument }}</span>
            </li>
          </ul>
        </div>

        <!-- Main Content -->
        <div class="prose max-w-none" v-html="editorial.content"></div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Teams Mentioned -->
        <div v-if="editorial.teams?.length" class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-lg font-bold mb-4">Teams Mentioned</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="team in editorial.teams"
              :key="team"
              class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {{ team }}
            </span>
          </div>
        </div>

        <!-- Players Mentioned -->
        <div v-if="editorial.players?.length" class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-lg font-bold mb-4">Players Mentioned</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="player in editorial.players"
              :key="player"
              class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {{ player }}
            </span>
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

const route = useRoute()
const editorial = ref(null)
const loading = ref(true)
const error = ref(null)

const formatDate = (date) => {
  return format(new Date(date), 'MMMM dd, yyyy')
}

const fetchEditorial = async () => {
  try {
    loading.value = true
    const { data } = await api.get(`/api/nba-editorials/slug/${route.params.slug}`)
    editorial.value = data
  } catch (err) {
    console.error('Error fetching editorial:', err)
    error.value = 'Failed to load editorial'
  } finally {
    loading.value = false
  }
}

onMounted(fetchEditorial)
</script>
