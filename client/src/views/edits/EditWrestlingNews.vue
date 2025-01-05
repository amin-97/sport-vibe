<!-- src/views/edits/EditWrestlingNews.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Edit Wrestling News</h1>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
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
              <option value="wwe">WWE</option>
              <option value="aew">AEW</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
            <input type="file" @change="handleImageUpload" accept="image/*" class="w-full" />
            <img
              :src="imagePreview || newsData.image?.url"
              class="mt-2 h-32 w-auto object-cover rounded"
            />
          </div>
        </div>

        <!-- Content -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            v-model="newsData.content"
            rows="6"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          ></textarea>
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
            {{ isSubmitting ? 'Updating...' : 'Update News' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toast-notification'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isSubmitting = ref(false)
const loading = ref(true)
const imagePreview = ref(null)
const tagInput = ref('')

const newsData = ref({
  title: '',
  description: '',
  content: '',
  category: '',
  image: null,
  tags: [],
  status: 'published',
})

const fetchNews = async () => {
  try {
    const { data } = await axios.get(`/api/wrestling-news/slug/${route.params.slug}`)
    newsData.value = {
      ...data,
      image: data.image || null,
      tags: data.tags || [],
    }
    loading.value = false
  } catch (err) {
    console.error('Error fetching news:', err)
    toast.error('Failed to load news', {
      position: 'top-right',
      duration: 3000,
    })
    loading.value = false
  }
}

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
    newsData.value.newImage = file
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
    formData.append('content', newsData.value.content)
    formData.append('category', newsData.value.category)
    formData.append('tags', JSON.stringify(newsData.value.tags))
    formData.append('status', newsData.value.status)

    // Append new image if uploaded
    if (newsData.value.newImage) {
      formData.append('image', newsData.value.newImage)
    }

    const token = localStorage.getItem('token')
    const response = await axios.put(`/api/wrestling-news/slug/${route.params.slug}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })

    toast.success('News updated successfully', {
      position: 'top-right',
      duration: 3000,
    })

    // Navigate to the news detail page
    router.push(`/wrestling/news/${response.data.slug}`)
  } catch (error) {
    console.error('Error updating news:', error)
    toast.error(error.response?.data?.message || 'Error updating news', {
      position: 'top-right',
      duration: 3000,
    })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(fetchNews)

// Cleanup
onBeforeUnmount(() => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
})
</script>
