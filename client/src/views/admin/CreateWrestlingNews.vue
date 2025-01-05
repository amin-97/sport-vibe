<!-- src/views/admin/CreateNews.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Create News Article</h1>

      <form id="newsForm" class="space-y-6">
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
              <!-- <option value="nba">NBA</option> -->
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
      </form>

      <!-- Submit Buttons -->
      <div class="flex justify-end gap-4 mt-6">
        <button
          type="button"
          @click="handleSaveAsDraft"
          :disabled="isSubmitting"
          class="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          {{ isSubmitting ? 'Saving...' : 'Save as Draft' }}
        </button>
        <button
          type="button"
          @click="handlePublish"
          :disabled="isSubmitting"
          class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {{ isSubmitting ? 'Publishing...' : 'Publish News' }}
        </button>
      </div>
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
  status: 'published',
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

const handlePublish = async () => {
  // Validate form
  const form = document.getElementById('newsForm')
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  try {
    isSubmitting.value = true
    const formData = new FormData()

    formData.append('title', newsData.value.title)
    formData.append('category', newsData.value.category)
    formData.append('description', newsData.value.description)
    formData.append('content', newsData.value.content)
    formData.append('tags', JSON.stringify(newsData.value.tags))
    formData.append('status', 'published')

    if (newsData.value.image) {
      formData.append('image', newsData.value.image)
    }

    const token = localStorage.getItem('token')

    const response = await axios.post('/api/wrestling-news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      baseURL: 'http://localhost:5000',
    })

    console.log('News created:', response.data)

    if (response.data._id) {
      router.push('/wrestling/news/')
    }
  } catch (error) {
    console.error('Error creating news:', error.response?.data || error)
    alert(error.response?.data?.message || 'Error creating news article')
  } finally {
    isSubmitting.value = false
  }
}

const handleSaveAsDraft = async () => {
  // Validate required fields for draft
  if (!newsData.value.title || !newsData.value.category) {
    alert('Title and category are required even for drafts')
    return
  }

  try {
    isSubmitting.value = true
    const formData = new FormData()

    formData.append('title', newsData.value.title)
    formData.append('category', newsData.value.category)
    formData.append('description', newsData.value.description)
    formData.append('content', newsData.value.content)
    formData.append('tags', JSON.stringify(newsData.value.tags))
    formData.append('status', 'draft')

    if (newsData.value.image) {
      formData.append('image', newsData.value.image)
    }

    const token = localStorage.getItem('token')

    const response = await axios.post('/api/wrestling-news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      baseURL: 'http://localhost:5000',
    })

    console.log('Draft saved:', response.data)
    alert('Draft saved successfully!')
    router.push('/admin/drafts')
  } catch (error) {
    console.error('Error saving draft:', error.response?.data || error)
    alert(error.response?.data?.message || 'Error saving draft')
  } finally {
    isSubmitting.value = false
  }
}

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
