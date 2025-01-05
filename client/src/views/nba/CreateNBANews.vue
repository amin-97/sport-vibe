<!-- src/views/admin/CreateNBANews.vue -->
<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import EditorForm from '@/components/EditorForm.vue'
import axios from 'axios'

const router = useRouter()
const isSubmitting = ref(false)
const imagePreview = ref(null)
const tagInput = ref('')
const teamInput = ref('')
const playerInput = ref('')

const newsData = ref({
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

const addTag = () => {
  if (tagInput.value.trim()) {
    newsData.value.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (index) => {
  newsData.value.tags.splice(index, 1)
}

const addTeam = () => {
  if (teamInput.value.trim()) {
    newsData.value.teams.push(teamInput.value.trim())
    teamInput.value = ''
  }
}

const removeTeam = (index) => {
  newsData.value.teams.splice(index, 1)
}

const addPlayer = () => {
  if (playerInput.value.trim()) {
    newsData.value.players.push(playerInput.value.trim())
    playerInput.value = ''
  }
}

const removePlayer = (index) => {
  newsData.value.players.splice(index, 1)
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    newsData.value.image = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const saveAsDraft = async () => {
  newsData.value.status = 'draft'
  await handleSubmit()
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    const formData = new FormData()

    // Append basic fields
    formData.append('title', newsData.value.title)
    formData.append('description', newsData.value.description)
    formData.append('category', newsData.value.category)
    formData.append('content', newsData.value.content)
    formData.append('tags', JSON.stringify(newsData.value.tags))
    formData.append('teams', JSON.stringify(newsData.value.teams))
    formData.append('players', JSON.stringify(newsData.value.players))
    formData.append('status', newsData.value.status)

    // Append image if it exists
    if (newsData.value.image) {
      formData.append('image', newsData.value.image)
    }

    const token = localStorage.getItem('token')
    const response = await axios.post('/api/nba-news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })

    console.log('News created:', response.data)
    router.push('/nba/news')
  } catch (error) {
    console.error('Error creating news:', error)
    alert(error.response?.data?.message || 'Error creating news')
  } finally {
    isSubmitting.value = false
  }
}

// Cleanup
onBeforeUnmount(() => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Create NBA News</h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Details -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              v-model="newsData.title"
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="newsData.description"
              rows="2"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              v-model="newsData.category"
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
            <input
              type="file"
              @change="handleImageUpload"
              accept="image/*"
              class="w-full"
              required
            />
            <img
              v-if="imagePreview"
              :src="imagePreview"
              class="mt-2 h-32 w-auto object-cover rounded"
            />
          </div>
        </div>

        <!-- Editor -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <EditorForm v-model="newsData.content" placeholder="Write your news..." />
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
              v-for="(tag, index) in newsData.tags"
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
              v-for="(team, index) in newsData.teams"
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
              v-for="(player, index) in newsData.players"
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
            {{ isSubmitting ? 'Publishing...' : 'Publish News' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
