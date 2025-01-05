<!-- src/views/wrestling/WrestlingEditorialDetail.vue -->
<template>
  <div v-if="loading" class="text-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
  </div>

  <div v-else-if="error" class="text-center py-12 text-red-600">
    {{ error }}
  </div>

  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <article class="prose max-w-none">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <span class="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
            {{ editorial.category }}
          </span>
          <span class="text-sm text-gray-500">{{ formatDate(editorial.createdAt) }}</span>
        </div>

        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ editorial.title }}</h1>
        <p class="text-xl text-gray-600 mb-6">{{ editorial.summary }}</p>

        <!-- Author Info -->
        <div class="flex items-center gap-4 mb-6">
          <img
            :src="editorial.author?.photoURL || '/placeholder-user.png'"
            :alt="editorial.author?.displayName"
            class="w-12 h-12 rounded-full"
          />
          <div>
            <p class="font-medium text-gray-900">{{ editorial.author?.displayName }}</p>
            <p class="text-sm text-gray-500 flex items-center">
              Wrestling Journalist
              <span class="ml-2 text-gray-400">•</span>
              <span class="ml-2">{{ editorial.readingTime }} min read</span>
            </p>
          </div>
        </div>

        <!-- Main Image -->
        <img
          v-if="editorial.image?.url"
          :src="editorial.image.url"
          :alt="editorial.title"
          class="w-full h-[500px] object-cover rounded-lg mb-8"
        />
      </div>

      <!-- Key Arguments -->
      <div v-if="editorial.keyArguments?.length" class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Key Arguments</h2>
        <ul class="list-disc pl-5 space-y-2">
          <li
            v-for="(argument, index) in editorial.keyArguments"
            :key="index"
            class="text-gray-700"
          >
            {{ argument }}
          </li>
        </ul>
      </div>

      <!-- Editorial Content -->
      <div class="editorial-content" v-html="editorial.content"></div>

      <!-- Topics -->
      <div v-if="editorial.topics?.length" class="mt-8">
        <h3 class="text-xl font-semibold mb-4">Topics</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="topic in editorial.topics"
            :key="topic"
            class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            {{ topic }}
          </span>
        </div>
      </div>

      <!-- Related Content -->
      <div v-if="editorial.relatedContent?.length" class="mt-12">
        <h3 class="text-2xl font-semibold mb-6">Related Content</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- You'd need to implement the actual related content fetching/rendering -->
          <div
            v-for="related in editorial.relatedContent"
            :key="related.item._id"
            class="bg-white shadow-md rounded-lg p-4"
          >
            <h4 class="text-lg font-medium">{{ related.item.title }}</h4>
            <p class="text-sm text-gray-600">{{ related.type }}</p>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
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
    console.log('Fetching editorial with slug:', route.params.slug)

    // Ensure slug exists before making the request
    if (!route.params.slug) {
      throw new Error('No slug provided')
    }

    const { data } = await axios.get(`/api/wrestling-editorials/slug/${route.params.slug}`)
    editorial.value = data
    console.log('Fetched editorial:', data)
  } catch (err) {
    console.error('Error fetching editorial:', err)
    error.value = err.response?.data?.message || 'Failed to load editorial'
  } finally {
    loading.value = false
  }
}

// Add to editorials routes:
/*
router.get("/slug/:slug", wrestlingEditorialController.getWrestlingEditorialBySlug);
*/

onMounted(fetchEditorial)
</script>

<style scoped>
/* Prose styles for rich text content */
.prose h1,
.prose h2,
.prose h3 {
  margin-bottom: 1rem;
  line-height: 1.3;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul,
.prose ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}
</style>
