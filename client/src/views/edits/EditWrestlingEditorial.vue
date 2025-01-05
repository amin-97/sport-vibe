<!-- src/views/edits/EditWrestlingEditorial.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Edit Wrestling Editorial</h1>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Details -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              v-model="editorialData.title"
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Summary</label>
            <textarea
              v-model="editorialData.summary"
              rows="3"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
            <input type="file" @change="handleImageUpload" accept="image/*" class="w-full" />
            <img
              :src="imagePreview || editorialData.image?.url"
              class="mt-2 h-32 w-auto object-cover rounded"
            />
          </div>
        </div>

        <!-- Content -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            v-model="editorialData.content"
            rows="6"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          ></textarea>
        </div>

        <!-- Key Arguments -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Key Arguments</label>
          <div class="space-y-2">
            <div
              v-for="(argument, index) in editorialData.keyArguments"
              :key="index"
              class="flex gap-2"
            >
              <input
                v-model="editorialData.keyArguments[index]"
                type="text"
                class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                placeholder="Enter key argument"
                required
              />
              <button
                @click="removeArgument(index)"
                type="button"
                class="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
            <button
              type="button"
              @click="addArgument"
              class="text-sm text-primary hover:text-primary/90"
            >
              + Add Key Argument
            </button>
          </div>
        </div>

        <!-- Topics -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Topics</label>
          <div class="flex flex-wrap gap-2">
            <input
              v-model="topicInput"
              @keydown.enter.prevent="addTopic"
              type="text"
              class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="Press enter to add topic"
            />
            <div
              v-for="(topic, index) in editorialData.topics"
              :key="index"
              class="bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1"
            >
              <span>{{ topic }}</span>
              <button
                @click="removeTopic(index)"
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
            {{ isSubmitting ? 'Updating...' : 'Update Editorial' }}
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
const topicInput = ref('')

const editorialData = ref({
  title: '',
  summary: '',
  content: '',
  image: null,
  keyArguments: [''],
  topics: [],
  status: 'published',
})

const fetchEditorial = async () => {
  try {
    const { data } = await axios.get(`/api/wrestling-editorials/slug/${route.params.slug}`)
    editorialData.value = {
      ...data,
      image: data.image || null,
      keyArguments: data.keyArguments?.length ? data.keyArguments : [''],
      topics: data.topics || [],
    }
    loading.value = false
  } catch (err) {
    console.error('Error fetching editorial:', err)
    toast.error('Failed to load editorial', {
      position: 'top-right',
      duration: 3000,
    })
    loading.value = false
  }
}

const addArgument = () => {
  editorialData.value.keyArguments.push('')
}

const removeArgument = (index) => {
  if (editorialData.value.keyArguments.length > 1) {
    editorialData.value.keyArguments.splice(index, 1)
  }
}

const addTopic = () => {
  if (topicInput.value.trim()) {
    editorialData.value.topics.push(topicInput.value.trim())
    topicInput.value = ''
  }
}

const removeTopic = (index) => {
  editorialData.value.topics.splice(index, 1)
}

// Rest of the script remains the same

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    editorialData.value.newImage = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const saveAsDraft = async () => {
  editorialData.value.status = 'draft'
  await handleSubmit()
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    const formData = new FormData()

    // Append basic fields
    formData.append('title', editorialData.value.title)
    formData.append('summary', editorialData.value.summary)
    formData.append('content', editorialData.value.content)
    formData.append('category', 'wrestling')
    formData.append('keyArguments', JSON.stringify(editorialData.value.keyArguments))
    formData.append('topics', JSON.stringify(editorialData.value.topics))
    formData.append('status', editorialData.value.status)
    formData.append('featured', 'false')

    // Append new image if uploaded
    if (editorialData.value.newImage) {
      formData.append('image', editorialData.value.newImage)
    }

    const token = localStorage.getItem('token')
    const response = await axios.put(
      `/api/wrestling-editorials/slug/${route.params.slug}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    toast.success('Editorial updated successfully', {
      position: 'top-right',
      duration: 3000,
    })

    // Navigate to the editorial detail page
    router.push(`/wrestling/editorials/${response.data.slug}`)
  } catch (error) {
    console.error('Full Error Object:', error)
    console.error('Error Response:', error.response?.data)

    toast.error(error.response?.data?.message || 'Error updating editorial', {
      position: 'top-right',
      duration: 3000,
    })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(fetchEditorial)

// Cleanup
onBeforeUnmount(() => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
})
</script>
