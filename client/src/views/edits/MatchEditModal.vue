<!-- src/views/admin/MatchEditModal.vue -->
<template>
  <div
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="$emit('close')"
      ></div>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Edit Match</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Match Type</label>
              <input
                v-model="editedMatch.type"
                class="w-full border rounded-md p-2 focus:border-primary"
                placeholder="Match Type"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Wrestlers</label>
              <input
                v-model="editedMatch.wrestlers"
                class="w-full border rounded-md p-2 focus:border-primary"
                placeholder="Wrestlers (comma-separated)"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Winner</label>
              <select
                v-model="editedMatch.winner"
                class="w-full border rounded-md p-2 focus:border-primary"
              >
                <option
                  v-for="wrestler in editedMatch.wrestlers.split(',')"
                  :key="wrestler.trim()"
                  :value="wrestler.trim()"
                >
                  {{ wrestler.trim() }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                v-model="editedMatch.duration"
                class="w-full border rounded-md p-2 focus:border-primary"
                placeholder="Match Duration"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Highlights</label>
              <textarea
                v-model="editedMatch.highlights"
                class="w-full border rounded-md p-2 focus:border-primary"
                rows="3"
                placeholder="Match highlights"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Analysis</label>
              <textarea
                v-model="editedMatch.thoughts"
                class="w-full border rounded-md p-2 focus:border-primary"
                rows="3"
                placeholder="Match analysis"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            @click="saveMatch"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
          >
            Save Match
          </button>
          <button
            @click="$emit('close')"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  match: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['save', 'close'])

// Create a reactive copy of the match to avoid directly mutating the prop
const editedMatch = ref({ ...props.match })

// Watch for changes in the original match prop
watch(
  () => props.match,
  (newMatch) => {
    editedMatch.value = { ...newMatch }
  },
  { deep: true },
)

const saveMatch = () => {
  // Validate match data before saving
  if (
    !editedMatch.value.type ||
    !editedMatch.value.wrestlers ||
    !editedMatch.value.winner ||
    !editedMatch.value.highlights ||
    !editedMatch.value.thoughts
  ) {
    alert('Please fill in all match details')
    return
  }

  // Ensure wrestlers is an array if comma-separated string
  if (typeof editedMatch.value.wrestlers === 'string') {
    editedMatch.value.wrestlers = editedMatch.value.wrestlers
      .split(',')
      .map((wrestler) => wrestler.trim())
  }

  emit('save', editedMatch.value)
}
</script>
