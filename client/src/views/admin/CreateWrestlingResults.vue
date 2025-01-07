<template>
  <form @submit.prevent="handleSubmit" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Progress Tabs -->
    <div class="mb-8">
      <nav class="flex space-x-4" aria-label="Progress">
        <button
          v-for="(tab, index) in ['Event Details', 'Matches', 'Images']"
          :key="index"
          type="button"
          class="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
          :class="[
            activeTab === index
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
          @click="activeTab = index"
        >
          {{ tab }}
        </button>
      </nav>
    </div>

    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <!-- Event Details Section -->
      <Transition name="fade" mode="out-in">
        <div v-if="activeTab === 0" class="p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Event Name</label>
              <input
                v-model="formData.name"
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary transition-colors duration-200"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Date</label>
              <input
                v-model="formData.date"
                type="date"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary transition-colors duration-200"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Venue</label>
              <input
                v-model="formData.venue"
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary transition-colors duration-200"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Promotion</label>
              <select
                v-model="formData.promotion"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary transition-colors duration-200"
                required
              >
                <option value="">Select Promotion</option>
                <option value="WWE">WWE</option>
                <option value="AEW">AEW</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Matches Section -->
        <div v-else-if="activeTab === 1" class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Matches</h2>
            <button
              type="button"
              @click="addMatch"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transform hover:scale-105 transition-all duration-200"
            >
              Add Match
            </button>
          </div>

          <TransitionGroup name="match-list" tag="div" class="space-y-6">
            <div
              v-for="(match, index) in formData.matches"
              :key="index"
              class="relative bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <!-- Match Header -->
              <div class="bg-gradient-to-r from-gray-700 to-gray-900 p-4 text-white">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-semibold">Match #{{ match.matchOrder }}</h3>
                  <button
                    type="button"
                    @click="removeMatch(index)"
                    class="text-red-400 hover:text-red-300 transform hover:scale-110 transition-all duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <!-- Match Content -->
              <div class="p-4 space-y-4">
                <!-- Match Order and Type -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Match Order</label>
                    <input
                      v-model="match.matchOrder"
                      type="number"
                      min="1"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Match Type</label>
                    <input
                      v-model="match.type"
                      type="text"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <!-- Stipulation and Title -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Stipulation</label>
                    <input
                      v-model="match.stipulation"
                      type="text"
                      placeholder="Regular Match"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700"
                      >Title (if title match)</label
                    >
                    <input
                      v-model="match.title"
                      type="text"
                      placeholder="Optional - enter title name if a title match"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>

                <!-- Wrestlers -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Wrestlers</label>
                  <TransitionGroup name="wrestler-list" tag="div" class="space-y-2">
                    <div
                      v-for="(wrestler, wIndex) in match.wrestlers"
                      :key="wIndex"
                      class="flex gap-2"
                    >
                      <input
                        v-model="match.wrestlers[wIndex]"
                        type="text"
                        class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        placeholder="Wrestler name"
                        required
                      />
                      <button
                        type="button"
                        @click="removeWrestler(match, wIndex)"
                        class="text-red-600 hover:text-red-800 px-2 transform hover:scale-110 transition-all duration-200"
                      >
                        ×
                      </button>
                    </div>
                  </TransitionGroup>
                  <button
                    type="button"
                    @click="addWrestler(match)"
                    class="text-primary hover:text-primary/90 text-sm transform hover:translate-x-1 transition-all duration-200"
                  >
                    + Add Wrestler
                  </button>
                </div>

                <!-- Winner and Finish -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Winner</label>
                    <input
                      v-model="match.winner"
                      type="text"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Method of Victory</label>
                    <select
                      v-model="match.method"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    >
                      <option value="">Select Method</option>
                      <option value="Pinfall">Pinfall</option>
                      <option value="Submission">Submission</option>
                      <option value="DQ">DQ</option>
                      <option value="Count Out">Count Out</option>
                      <option value="No Contest">No Contest</option>
                      <option value="Draw">Draw</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <!-- Match Details -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Match Highlights</label>
                  <textarea
                    v-model="match.highlights"
                    rows="3"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  ></textarea>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Match Thoughts</label>
                  <textarea
                    v-model="match.thoughts"
                    rows="3"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- Images Section -->
        <div v-else class="p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Images</h2>

          <div class="space-y-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Cover Image</label>
              <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary transition-colors duration-200"
              >
                <input
                  type="file"
                  @change="handleCoverImage"
                  accept="image/*"
                  class="w-full"
                  required
                />
                <div v-if="coverImagePreview" class="mt-4">
                  <img
                    :src="coverImagePreview"
                    class="h-48 w-full object-cover rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Additional Images</label>
              <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary transition-colors duration-200"
              >
                <input
                  type="file"
                  @change="handleAdditionalImages"
                  accept="image/*"
                  multiple
                  class="w-full"
                />
                <div
                  v-if="additionalImagePreviews.length"
                  class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  <TransitionGroup name="image-grid">
                    <div
                      v-for="(preview, index) in additionalImagePreviews"
                      :key="index"
                      class="relative group"
                    >
                      <img :src="preview" class="h-32 w-full object-cover rounded-lg shadow-md" />
                    </div>
                  </TransitionGroup>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Navigation and Submit Buttons -->
      <div class="bg-gray-50 px-6 py-4 flex justify-between items-center">
        <button
          type="button"
          @click="activeTab--"
          class="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
          :disabled="activeTab === 0"
        >
          Previous
        </button>

        <div class="flex gap-4">
          <button
            v-if="activeTab === 2"
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors duration-200"
          >
            {{ isSubmitting ? 'Publishing...' : 'Publish Result' }}
          </button>
          <button
            v-else
            type="button"
            @click="activeTab++"
            class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import api from '@/utils/axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const isSubmitting = ref(false)
const coverImagePreview = ref(null)
const additionalImagePreviews = ref([])
const coverImage = ref(null)
const additionalImages = ref([])
const activeTab = ref(0)

const formData = ref({
  name: '',
  date: '',
  venue: '',
  promotion: '',
  matches: [
    {
      type: '',
      wrestlers: [''],
      winner: '',
      highlights: '',
      thoughts: '',
      matchOrder: 1, // Default to 1 for first match
      stipulation: 'Regular Match', // Default value
      method: '', // Required field
      title: '', // Optional
    },
  ],
})

const addMatch = () => {
  formData.value.matches.push({
    type: '',
    wrestlers: [''],
    winner: '',
    highlights: '',
    thoughts: '',
    matchOrder: formData.value.matches.length + 1, // Automatically increment
    stipulation: 'Regular Match',
    method: '',
    title: '',
  })
}

const removeMatch = (index) => {
  formData.value.matches.splice(index, 1)
  // Update match orders after removal
  formData.value.matches.forEach((match, i) => {
    match.matchOrder = i + 1
  })
}

const addWrestler = (match) => {
  match.wrestlers.push('')
}

const removeWrestler = (match, wIndex) => {
  match.wrestlers.splice(wIndex, 1)
}

const handleCoverImage = (e) => {
  const file = e.target.files[0]
  if (file) {
    coverImage.value = file
    coverImagePreview.value = URL.createObjectURL(file)
  }
}

const handleAdditionalImages = (e) => {
  const files = Array.from(e.target.files)
  additionalImages.value = files
  additionalImagePreviews.value = files.map((file) => URL.createObjectURL(file))
}

const prepareFormData = () => {
  const formDataToSubmit = new FormData()

  // Append basic fields
  formDataToSubmit.append('name', formData.value.name)
  formDataToSubmit.append('date', formData.value.date)
  formDataToSubmit.append('venue', formData.value.venue)
  formDataToSubmit.append('promotion', formData.value.promotion)
  formDataToSubmit.append('matches', JSON.stringify(formData.value.matches))

  // Append files
  if (coverImage.value) {
    formDataToSubmit.append('coverImage', coverImage.value)
  }
  if (additionalImages.value.length) {
    additionalImages.value.forEach((image) => {
      formDataToSubmit.append('additionalImages', image)
    })
  }

  return formDataToSubmit
}

const handleSubmit = async () => {
  try {
    // Check if token exists
    if (!authStore.token) {
      console.error('No authentication token found')
      // You might want to redirect to login or show a login modal
      router.push('/login')
      return
    }

    isSubmitting.value = true
    const formDataToSubmit = prepareFormData()

    // console.log('Token being used:', authStore.token) // Debug log

    const response = await api.post('/api/wrestling-results', formDataToSubmit, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    // console.log('Success:', response.data)
    router.push(`/wrestling/results/`)
  } catch (error) {
    console.error('Submission Error:', error)

    // More detailed error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error Response Data:', error.response.data)
      console.error('Error Response Status:', error.response.status)

      if (error.response.status === 401) {
        // Token is invalid or expired
        console.error('Authentication failed. Please log in again.')
        // Clear the token and redirect to login
        authStore.logout()
        router.push('/login')
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request)
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message)
    }
  } finally {
    isSubmitting.value = false
  }
}
// Cleanup URLs when component is unmounted
onBeforeUnmount(() => {
  if (coverImagePreview.value) {
    URL.revokeObjectURL(coverImagePreview.value)
  }
  additionalImagePreviews.value.forEach((preview) => {
    URL.revokeObjectURL(preview)
  })
})
</script>

<style scoped>
/* Transitions for tab content */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transitions for match cards */
.match-list-move,
.match-list-enter-active,
.match-list-leave-active {
  transition: all 0.5s ease;
}

.match-list-enter-from,
.match-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.match-list-leave-active {
  position: absolute;
}

/* Transitions for wrestler inputs */
.wrestler-list-move,
.wrestler-list-enter-active,
.wrestler-list-leave-active {
  transition: all 0.3s ease;
}

.wrestler-list-enter-from,
.wrestler-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Transitions for image grid */
.image-grid-move,
.image-grid-enter-active,
.image-grid-leave-active {
  transition: all 0.3s ease;
}

.image-grid-enter-from,
.image-grid-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
