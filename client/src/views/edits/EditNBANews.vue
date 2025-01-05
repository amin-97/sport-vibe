<!-- src/views/edits/EditNBANews.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Edit NBA Article</h1>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Details -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              v-model="articleData.title"
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="articleData.description"
              rows="2"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              v-model="articleData.category"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            >
              <option value="">Select Category</option>
              <option value="news">News</option>
              <option value="trades">Trades</option>
              <option value="rumors">Rumors</option>
              <option value="injuries">Injuries</option>
              <option value="game-recap">Game Recap</option>
              <option value="analysis">Analysis</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
            <input type="file" @change="handleImageUpload" accept="image/*" class="w-full" />
            <img
              :src="imagePreview || articleData.image?.url"
              class="mt-2 h-32 w-auto object-cover rounded"
            />
          </div>
        </div>

        <!-- Editor -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <EditorForm v-model="articleData.content" placeholder="Write your article..." />
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <div class="flex flex-wrap gap-2">
            <input
              v-model="tagInput"
              @keydown.enter.prevent="addTag"
              type="text"
              class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="Press enter to add tag"
            />
            <div
              v-for="(tag, index) in articleData.tags"
              :key="index"
              class="bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1"
            >
              <span>{{ tag }}</span>
              <button
                @click="removeTag(index)"
                type="button"
                class="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- Teams -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Teams</label>
          <div class="flex flex-wrap gap-2">
            <input
              v-model="teamInput"
              @keydown.enter.prevent="addTeam"
              type="text"
              class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="Press enter to add team"
            />
            <div
              v-for="(team, index) in articleData.teams"
              :key="index"
              class="bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1"
            >
              <span>{{ team }}</span>
              <button
                @click="removeTeam(index)"
                type="button"
                class="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- Players -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Players</label>
          <div class="flex flex-wrap gap-2">
            <input
              v-model="playerInput"
              @keydown.enter.prevent="addPlayer"
              type="text"
              class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="Press enter to add player"
            />
            <div
              v-for="(player, index) in articleData.players"
              :key="index"
              class="bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1"
            >
              <span>{{ player }}</span>
              <button
                @click="removePlayer(index)"
                type="button"
                class="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="saveAsDraft"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {{ isSubmitting ? 'Updating...' : 'Update Article' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EditorForm from '@/components/EditorForm.vue'
import axios from 'axios'
import { useToast } from 'vue-toast-notification'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isSubmitting = ref(false)
const loading = ref(true)
const imagePreview = ref(null)
const tagInput = ref('')
const teamInput = ref('')
const playerInput = ref('')

const articleData = ref({
  title: '',
  description: '',
  category: '',
  content: '',
  image: null,
  tags: [],
  teams: [],
  players: [],
  status: 'published',
})

const fetchArticle = async () => {
  try {
    const { data } = await axios.get(`/api/nba-news/slug/${route.params.slug}`)
    articleData.value = {
      ...data,
      image: data.image || null,
      tags: data.tags || [],
      teams: data.teams || [],
      players: data.players || [],
    }
    loading.value = false
  } catch (err) {
    console.error('Error fetching article:', err)
    toast.error('Failed to load article', {
      position: 'top-right',
      duration: 3000,
    })
    loading.value = false
  }
}

const addTag = () => {
  if (tagInput.value.trim()) {
    articleData.value.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (index) => {
  articleData.value.tags.splice(index, 1)
}

const addTeam = () => {
  if (teamInput.value.trim()) {
    articleData.value.teams.push(teamInput.value.trim())
    teamInput.value = ''
  }
}

const removeTeam = (index) => {
  articleData.value.teams.splice(index, 1)
}

const addPlayer = () => {
  if (playerInput.value.trim()) {
    articleData.value.players.push(playerInput.value.trim())
    playerInput.value = ''
  }
}

const removePlayer = (index) => {
  articleData.value.players.splice(index, 1)
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    articleData.value.newImage = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const saveAsDraft = async () => {
  articleData.value.status = 'draft'
  await handleSubmit()
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    const formData = new FormData()

    // Append basic fields
    formData.append('title', articleData.value.title)
    formData.append('description', articleData.value.description)
    formData.append('category', articleData.value.category)
    formData.append('content', articleData.value.content)
    formData.append('tags', JSON.stringify(articleData.value.tags))
    formData.append('teams', JSON.stringify(articleData.value.teams))
    formData.append('players', JSON.stringify(articleData.value.players))
    formData.append('status', articleData.value.status)

    // Append new image if uploaded
    if (articleData.value.newImage) {
      formData.append('image', articleData.value.newImage)
    }

    const token = localStorage.getItem('token')
    const response = await axios.put(`/api/nba-news/slug/${route.params.slug}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })

    toast.success('Article updated successfully', {
      position: 'top-right',
      duration: 3000,
    })

    // Navigate to the article's detail page
    router.push(`/nba/news/${response.data.slug}`)
  } catch (error) {
    console.error('Error updating article:', error)
    toast.error(error.response?.data?.message || 'Error updating article', {
      position: 'top-right',
      duration: 3000,
    })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(fetchArticle)

// Cleanup
onBeforeUnmount(() => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
})
</script>
