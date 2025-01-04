<!-- src/views/admin/CreateEditorial.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Create Editorial</h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              v-model="editorialData.category"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            >
              <option value="">Select Category</option>
              <option value="nba">NBA</option>
              <option value="wrestling">Wrestling</option>
            </select>
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
          <EditorForm v-model="editorialData.content" placeholder="Write your editorial..." />
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
            {{ isSubmitting ? 'Publishing...' : 'Publish Editorial' }}
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
const topicInput = ref('')

const editorialData = ref({
  title: '',
  category: '',
  summary: '',
  content: '',
  image: null,
  keyArguments: [''], // Initialize with one empty argument
  topics: [],
  status: 'published',
})

const addArgument = () => {
  editorialData.value.keyArguments.push('')
}

const removeArgument = (index) => {
  editorialData.value.keyArguments.splice(index, 1)
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

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    editorialData.value.image = file
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

    // Log the data being sent for debugging
    console.log('Submitting editorial data:', {
      title: editorialData.value.title,
      category: editorialData.value.category,
      summary: editorialData.value.summary,
      content: editorialData.value.content,
      keyArguments: editorialData.value.keyArguments,
      topics: editorialData.value.topics,
      status: editorialData.value.status,
    })

    // Validate before sending
    if (!editorialData.value.keyArguments.length) {
      throw new Error('At least one key argument is required')
    }

    // Remove empty key arguments
    const validKeyArguments = editorialData.value.keyArguments.filter((arg) => arg.trim() !== '')

    // Append basic fields
    formData.append('title', editorialData.value.title)
    formData.append('category', editorialData.value.category)
    formData.append('summary', editorialData.value.summary)
    formData.append('content', editorialData.value.content)
    formData.append('keyArguments', JSON.stringify(validKeyArguments))
    formData.append('topics', JSON.stringify(editorialData.value.topics))
    formData.append('status', editorialData.value.status || 'published')
    // formData.append('featured', false) // Default to not featured

    // Append image if it exists
    if (editorialData.value.image) {
      formData.append('image', editorialData.value.image)
    }

    // Get token from localStorage
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Authentication token not found')
    }

    const response = await axios.post('/api/editorials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      baseURL: 'http://localhost:5000',
    })

    console.log('Editorial created:', response.data)

    // Show success message and redirect
    alert('Editorial created successfully!')
    router.push('/wrestling/editorials')
  } catch (error) {
    console.error('Error creating editorial:', error.response?.data || error)

    // Show specific error message to user
    if (error.response?.data?.errors) {
      alert(error.response.data.errors[0]) // Show first error from array
    } else {
      alert(error.message || 'Error creating editorial')
    }
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
