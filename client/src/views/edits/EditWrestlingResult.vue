<!-- src/views/admin/EditWrestlingResult.vue -->
<template>
  <div v-if="loading" class="text-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
  </div>

  <div v-else-if="error" class="text-center py-12 text-red-600">
    {{ error }}
  </div>

  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Cover Image Upload -->
      <div class="relative">
        <img
          :src="coverImagePreview || result.coverImage?.url || '/placeholder-image.png'"
          alt="Event Cover"
          class="w-full h-64 object-cover"
        />
        <input
          type="file"
          ref="coverImageInput"
          @change="handleCoverImageUpload"
          accept="image/*"
          class="hidden"
        />
        <button
          @click="$refs.coverImageInput.click()"
          class="absolute top-4 right-4 bg-primary text-white px-3 py-2 rounded-md hover:bg-primary-dark"
        >
          Change Cover Image
        </button>
      </div>

      <div class="p-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <input
            v-model="result.name"
            class="text-3xl font-bold text-gray-900 w-full border-b border-gray-300 focus:border-primary"
            placeholder="Event Name"
          />

          <select
            v-model="result.promotion"
            class="px-3 py-1 rounded-full text-sm font-medium"
            :class="
              result.promotion === 'WWE' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            "
          >
            <option value="WWE">WWE</option>
            <option value="AEW">AEW</option>
          </select>
        </div>

        <!-- Event Info -->
        <div class="mt-4 space-y-2">
          <input
            type="date"
            v-model="formattedDate"
            class="text-gray-600 border-b border-gray-300 focus:border-primary"
          />
          <input
            v-model="result.venue"
            placeholder="Venue"
            class="text-gray-600 w-full border-b border-gray-300 focus:border-primary"
          />
        </div>

        <!-- Matches -->
        <div class="mt-8 space-y-8">
          <div
            v-for="(match, index) in result.matches"
            :key="index"
            class="bg-gray-50 rounded-lg p-6 relative"
          >
            <!-- Edit Match Button -->
            <button
              @click="editMatch(index)"
              class="absolute top-4 right-4 text-primary hover:text-primary-dark"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="{2}"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            <div class="flex justify-between items-center mb-4">
              <input
                v-model="match.type"
                placeholder="Match Type"
                class="text-xl font-semibold w-full border-b border-gray-300 focus:border-primary"
              />
              <input
                v-model="match.duration"
                placeholder="Duration"
                class="text-gray-600 border-b border-gray-300 focus:border-primary"
              />
            </div>

            <div class="space-y-4">
              <input
                :value="
                  Array.isArray(match.wrestlers) ? match.wrestlers.join(', ') : match.wrestlers
                "
                @input="match.wrestlers = $event.target.value.split(',').map((w) => w.trim())"
                placeholder="Wrestlers (comma-separated)"
                class="text-lg w-full border-b border-gray-300 focus:border-primary"
              />

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Winner</label>
                <select
                  v-model="match.winner"
                  class="w-full border-b border-gray-300 focus:border-primary"
                >
                  <option
                    v-for="wrestler in Array.isArray(match.wrestlers)
                      ? match.wrestlers
                      : match.wrestlers.split(',')"
                    :key="wrestler.trim()"
                    :value="wrestler.trim()"
                  >
                    {{ wrestler.trim() }}
                  </option>
                </select>
              </div>

              <!-- Highlights -->
              <div>
                <label class="font-medium text-gray-900 mb-2 block">Highlights</label>
                <textarea
                  v-model="match.highlights"
                  class="w-full border rounded-md p-2 focus:border-primary"
                  rows="3"
                  placeholder="Match highlights"
                ></textarea>
              </div>

              <!-- Analysis -->
              <div>
                <label class="font-medium text-gray-900 mb-2 block">Analysis</label>
                <textarea
                  v-model="match.thoughts"
                  class="w-full border rounded-md p-2 focus:border-primary"
                  rows="3"
                  placeholder="Match analysis"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Add Match Button -->
          <button
            @click="addNewMatch"
            class="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark"
          >
            Add New Match
          </button>
        </div>

        <!-- Additional Images -->
        <div class="mt-8">
          <h3 class="text-xl font-semibold mb-4">Event Gallery</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="(image, index) in result.additionalImages" :key="index" class="relative">
              <img
                :src="image.url"
                :alt="`Event image ${index + 1}`"
                class="rounded-lg w-full h-48 object-cover"
              />
              <button
                @click="removeAdditionalImage(index)"
                class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              >
                ✕
              </button>
            </div>

            <div
              @click="$refs.additionalImagesInput.click()"
              class="rounded-lg w-full h-48 border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
            >
              <span class="text-gray-500">Add Images</span>
            </div>
          </div>
          <input
            type="file"
            ref="additionalImagesInput"
            @change="handleAdditionalImagesUpload"
            accept="image/*"
            multiple
            class="hidden"
          />
        </div>

        <!-- Save Changes Button -->
        <div class="mt-8 flex justify-end">
          <button
            @click="saveChanges"
            class="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <!-- Match Edit Modal -->
    <MatchEditModal
      v-if="editingMatchIndex !== null"
      :match="result.matches[editingMatchIndex]"
      @save="updateMatch"
      @close="editingMatchIndex = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/utils/axios'
import { format } from 'date-fns'
import MatchEditModal from './MatchEditModal.vue'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const toast = useToast()
const route = useRoute()
const router = useRouter()

const result = ref(null)
const loading = ref(true)
const error = ref(null)
const coverImagePreview = ref(null)
const editingMatchIndex = ref(null)

// Computed property to handle date formatting
const formattedDate = computed({
  get() {
    return result.value ? format(new Date(result.value.date), 'yyyy-MM-dd') : ''
  },
  set(newValue) {
    if (result.value) {
      result.value.date = new Date(newValue)
    }
  },
})

const fetchResult = async () => {
  try {
    loading.value = true
    const { data } = await api.get(`/api/wrestling-results/slug/${route.params.slug}`)

    // Ensure wrestlers are always arrays
    data.matches = data.matches.map((match) => ({
      ...match,
      wrestlers: Array.isArray(match.wrestlers)
        ? match.wrestlers
        : (match.wrestlers || '').split(',').map((w) => w.trim()),
    }))

    result.value = data
  } catch (err) {
    console.error('Error fetching result:', err)
    error.value = 'Failed to load event results'
  } finally {
    loading.value = false
  }
}

const handleCoverImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    coverImagePreview.value = URL.createObjectURL(file)
    result.value.newCoverImage = file
  }
}

const handleAdditionalImagesUpload = (event) => {
  const files = Array.from(event.target.files)
  result.value.newAdditionalImages = files
}

const removeAdditionalImage = (index) => {
  result.value.additionalImages.splice(index, 1)
}

const addNewMatch = () => {
  result.value.matches.push({
    type: '',
    wrestlers: [], // Initialize as an array
    winner: '',
    duration: '',
    highlights: '',
    thoughts: '',
  })
}

const editMatch = (index) => {
  editingMatchIndex.value = index
}

const updateMatch = (updatedMatch) => {
  if (editingMatchIndex.value !== null) {
    result.value.matches[editingMatchIndex.value] = updatedMatch
    editingMatchIndex.value = null
  }
}

const saveChanges = async () => {
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      toast.error('You must be logged in to save changes', {
        position: 'top-right',
        duration: 3000,
      })
      return
    }

    const formData = new FormData()

    // Append basic fields
    formData.append('name', result.value.name)
    formData.append('date', result.value.date)
    formData.append('venue', result.value.venue)
    formData.append('promotion', result.value.promotion)

    // Prepare matches exactly as expected by the backend
    const processedMatches = result.value.matches.map((match) => ({
      type: match.type,
      wrestlers: match.wrestlers,
      winner: match.winner,
      duration: match.duration,
      highlights: match.highlights,
      thoughts: match.thoughts,
    }))

    formData.append('matches', JSON.stringify(processedMatches))

    // Handle cover image
    if (result.value.newCoverImage) {
      formData.append('coverImage', result.value.newCoverImage)
    }

    // Handle additional images
    if (result.value.newAdditionalImages) {
      result.value.newAdditionalImages.forEach((file, index) => {
        formData.append(`additionalImages`, file)
      })
    }

    const { data } = await api.put(`/api/wrestling-results/slug/${result.value.slug}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })

    // Show success toast
    toast.success('Wrestling result updated successfully', {
      position: 'top-right',
      duration: 3000,
    })

    // Refresh the result
    // fetchResult()
    router.push(`/wrestling/results/${data.slug}`)
  } catch (err) {
    console.error('Full Error Object:', err)
    console.error('Error Response:', err.response)

    // More detailed error handling with toasts
    if (err.response) {
      if (err.response.status === 400) {
        toast.error(`Validation Error: ${err.response.data.errors[0].msg}`, {
          position: 'top-right',
          duration: 3000,
        })
      } else if (err.response.status === 401) {
        toast.error(`Unauthorized: ${err.response.data.message}`, {
          position: 'top-right',
          duration: 3000,
        })
      } else {
        toast.error(err.response.data.message || 'Failed to save changes', {
          position: 'top-right',
          duration: 3000,
        })
      }
    } else if (err.request) {
      toast.error('No response from server. Please check your connection.', {
        position: 'top-right',
        duration: 3000,
      })
    } else {
      toast.error('Error setting up the request', {
        position: 'top-right',
        duration: 3000,
      })
    }
  }
}

onMounted(fetchResult)
</script>

<style scoped>
.animate-slideUp {
  animation: slideUp 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
