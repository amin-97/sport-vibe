<!-- src/views/nba/NBANewsDetail.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { format } from 'date-fns'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const article = ref(null)
const loading = ref(true)
const error = ref(null)
const showDeleteModal = ref(false)

const formatDate = (date) => {
  return format(new Date(date), 'MMMM dd, yyyy')
}

const fetchArticle = async () => {
  try {
    loading.value = true
    const { data } = await axios.get(`/api/nba-news/slug/${route.params.slug}`)
    article.value = data
  } catch (err) {
    console.error('Error fetching article:', err)
    error.value = 'Failed to load article'
  } finally {
    loading.value = false
  }
}

const handleEdit = () => {
  router.push(`/admin/write/nba/article/edit/${article.value.slug}`)
}

const handleDelete = () => {
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await axios.delete(`/api/nba/articles/${article.value._id}`)
    router.push('/nba/news')
  } catch (err) {
    console.error('Error deleting article:', err)
    alert('Failed to delete article')
  } finally {
    showDeleteModal.value = false
  }
}

onMounted(fetchArticle)
</script>

<template>
  <div v-if="loading" class="text-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
  </div>

  <div v-else-if="error" class="text-center py-12 text-red-600">
    {{ error }}
  </div>

  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <article>
      <!-- Category and Date -->
      <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {{ article.category }}
          </span>
          <span class="text-gray-500">{{ formatDate(article.createdAt) }}</span>
        </div>
        <div v-if="authStore.isAdmin" class="flex gap-4">
          <button
            @click="handleEdit"
            class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Edit Article
          </button>
          <button
            @click="handleDelete"
            class="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete Article
          </button>
        </div>
      </div>

      <!-- Title and Description -->
      <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ article.title }}</h1>
      <p class="text-xl text-gray-600 mb-8">{{ article.description }}</p>

      <!-- Author Info -->
      <div class="flex items-center gap-4 mb-8">
        <img
          :src="article.author?.photoURL || '/placeholder-user.png'"
          :alt="article.author?.displayName"
          class="w-12 h-12 rounded-full"
        />
        <div>
          <p class="font-medium text-gray-900">{{ article.author?.displayName }}</p>
          <p class="text-sm text-gray-500">Sports Journalist</p>
        </div>
      </div>

      <!-- Main Image -->
      <img
        :src="article.image?.url || '/placeholder-image.png'"
        :alt="article.title"
        class="w-full h-[500px] object-cover rounded-lg mb-8"
      />

      <!-- Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <!-- Main Content -->
          <div class="prose max-w-none mb-8" v-html="article.content"></div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-8">
            <span
              v-for="tag in article.tags"
              :key="tag"
              class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="space-y-6">
          <!-- Teams Mentioned -->
          <div v-if="article.teams?.length" class="bg-white shadow rounded-lg p-6">
            <h2 class="font-bold text-gray-900 mb-4">Teams Mentioned</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="team in article.teams"
                :key="team"
                class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {{ team }}
              </span>
            </div>
          </div>

          <!-- Players Mentioned -->
          <div v-if="article.players?.length" class="bg-white shadow rounded-lg p-6">
            <h2 class="font-bold text-gray-900 mb-4">Players Mentioned</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="player in article.players"
                :key="player"
                class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {{ player }}
              </span>
            </div>
          </div>

          <!-- Related Articles -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="font-bold text-gray-900 mb-4">Related Articles</h2>
            <div class="space-y-4">
              <!-- We'll implement this later when we have the related articles functionality -->
              <p class="text-gray-500 text-sm">Related articles coming soon...</p>
            </div>
          </div>
        </aside>
      </div>
    </article>
  </div>

  <!-- Delete Confirmation Modal -->
  <div
    v-if="showDeleteModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-bold mb-4">Delete Article</h3>
      <p class="text-gray-600 mb-6">
        Are you sure you want to delete this article? This action cannot be undone.
      </p>
      <div class="flex justify-end gap-4">
        <button
          @click="showDeleteModal = false"
          class="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          @click="confirmDelete"
          class="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose img {
  border-radius: 0.5rem; /* Equivalent to rounded-lg */
}
</style>
