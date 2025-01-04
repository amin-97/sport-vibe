// src/views/admin/CreateWrestlingResults.vue
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="bg-white shadow rounded-lg p-6">
      <!-- Event Details -->
      <div class="space-y-4">
        <h2 class="text-lg font-medium text-gray-900">Event Details</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Event Name</label>
            <input
              v-model="formData.name"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Date</label>
            <input
              v-model="formData.date"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Venue</label>
            <input
              v-model="formData.venue"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Promotion</label>
            <select
              v-model="formData.promotion"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
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
      <div class="mt-8 space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900">Matches</h2>
          <button
            type="button"
            @click="addMatch"
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Add Match
          </button>
        </div>

        <TransitionGroup name="list" tag="div" class="space-y-4">
          <div
            v-for="(match, index) in formData.matches"
            :key="index"
            class="bg-gray-50 p-4 rounded-lg relative"
          >
            <button
              type="button"
              @click="removeMatch(index)"
              class="absolute top-2 right-2 text-red-600 hover:text-red-800"
            >
              Remove Match
            </button>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Match Type</label>
                <input
                  v-model="match.type"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Winner</label>
                <input
                  v-model="match.winner"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>

            <!-- Wrestlers -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700">Wrestlers</label>
              <div class="space-y-2">
                <div v-for="(wrestler, wIndex) in match.wrestlers" :key="wIndex" class="flex gap-2">
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
                    class="text-red-600 hover:text-red-800 px-2"
                  >
                    ×
                  </button>
                </div>
                <button
                  type="button"
                  @click="addWrestler(match)"
                  class="text-primary hover:text-primary/90 text-sm"
                >
                  + Add Wrestler
                </button>
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700">Match Highlights</label>
              <textarea
                v-model="match.highlights"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              ></textarea>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700">Match Thoughts</label>
              <textarea
                v-model="match.thoughts"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              ></textarea>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Images Section -->
      <div class="mt-8 space-y-4">
        <h2 class="text-lg font-medium text-gray-900">Images</h2>

        <div>
          <label class="block text-sm font-medium text-gray-700">Cover Image</label>
          <input
            type="file"
            @change="handleCoverImage"
            accept="image/*"
            class="mt-1 block w-full"
            required
          />
          <img
            v-if="coverImagePreview"
            :src="coverImagePreview"
            class="mt-2 h-32 w-auto object-cover rounded"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Additional Images</label>
          <input
            type="file"
            @change="handleAdditionalImages"
            accept="image/*"
            multiple
            class="mt-1 block w-full"
          />
          <div class="mt-2 grid grid-cols-3 gap-4">
            <img
              v-for="(preview, index) in additionalImagePreviews"
              :key="index"
              :src="preview"
              class="h-24 w-auto object-cover rounded"
            />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="mt-8 flex justify-end">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {{ isSubmitting ? 'Submitting...' : 'Create Result' }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const isSubmitting = ref(false)
const coverImagePreview = ref(null)
const additionalImagePreviews = ref([])
const coverImage = ref(null)
const additionalImages = ref([])

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
  })
}

const removeMatch = (index) => {
  formData.value.matches.splice(index, 1)
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

const handleSubmit = async () => {
  try {
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

    const response = await axios.post('/api/wrestling-results/create', formDataToSubmit, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    console.log('Success:', response.data)
    // Redirect to the newly created result
    router.push(`/wrestling/results/`)
  } catch (error) {
    console.error('Error:', error)
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
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
