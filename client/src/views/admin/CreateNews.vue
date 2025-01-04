<!-- src/views/admin/CreateNews.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Create News Article</h1>

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
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              v-model="newsData.category"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            >
              <option value="">Select Category</option>
              <option value="nba">NBA</option>
              <option value="wwe">WWE</option>
              <option value="aew">AEW</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <textarea
              v-model="newsData.description"
              rows="2"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            ></textarea>
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
          <EditorForm v-model="newsData.content" placeholder="Write your news article..." />
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

        <!-- Submit Button -->
        <div class="flex justify-end gap-4">
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

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import EditorForm from '@/components/EditorForm.vue'
import axios from 'axios'

const router = useRouter()
const isSubmitting = ref(false)
const imagePreview = ref(null)

const newsData = ref({
  title: '',
  category: '',
  description: '',
  content: '',
  image: null,
  tags: [],
})

const tagInput = ref('')

const addTag = () => {
  if (tagInput.value.trim()) {
    newsData.value.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (index) => {
  newsData.value.tags.splice(index, 1)
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    newsData.value.image = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    const formData = new FormData()

    // Log data being sent for debugging
    console.log('Submitting news data:', {
      title: newsData.value.title,
      category: newsData.value.category,
      description: newsData.value.description,
      content: newsData.value.content,
      tags: newsData.value.tags,
    })

    // Append basic fields
    formData.append('title', newsData.value.title)
    formData.append('category', newsData.value.category)
    formData.append('description', newsData.value.description)
    formData.append('content', newsData.value.content)
    formData.append('tags', JSON.stringify(newsData.value.tags))

    // Append image if it exists
    if (newsData.value.image) {
      formData.append('image', newsData.value.image)
    }

    // Get token from localStorage or your auth store
    const token = localStorage.getItem('token') // or however you store your token

    const response = await axios.post('/api/news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`, // Add auth token
      },
      baseURL: 'http://localhost:5000', // Add your backend URL
    })

    console.log('News created:', response.data)

    if (response.data._id) {
      router.push(`/wrestling/news/`)
    }
  } catch (error) {
    console.error('Error creating news:', error.response?.data || error)
    // Add error feedback to user
    alert(error.response?.data?.message || 'Error creating news article')
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

<style scoped>
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
