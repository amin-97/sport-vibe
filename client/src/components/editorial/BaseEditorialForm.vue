<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow p-6">
      <header class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <span>{{ saveStatus }}</span>
        </div>
      </header>

      <div class="space-y-6">
        <!-- Basic Details -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              v-model="editorialData.title"
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Summary</label>
            <textarea
              v-model="editorialData.summary"
              rows="2"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
            <input type="file" @change="handleImageUpload" accept="image/*" class="w-full" />
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

        <!-- Slot for additional fields (like teams and players for NBA) -->
        <slot name="additional-fields"></slot>

        <!-- Submit Buttons -->
        <div class="flex justify-end gap-4 mt-6">
          <button
            type="button"
            @click="handlePublish"
            :disabled="isSubmitting || isSaving"
            class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {{ isSubmitting ? 'Publishing...' : 'Publish Editorial' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import EditorForm from '@/components/EditorForm.vue'
import axios from 'axios'
import { debounce } from 'lodash'
import { useEditorial } from '@/composables/useEditorial'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['wrestling', 'nba'].includes(value),
  },
  apiEndpoint: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const imagePreview = ref(null)
const topicInput = ref('')
const draftSlug = ref(null)

const { editorialData, isSubmitting, isSaving, lastSaved, hasUnsavedChanges, handleContentChange } =
  useEditorial(props.type)

const saveStatus = ref('Saved')

const formatTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date)
}

const addArgument = () => {
  editorialData.value.keyArguments.push('')
  handleContentChange()
}

const removeArgument = (index) => {
  editorialData.value.keyArguments.splice(index, 1)
  handleContentChange()
}

const addTopic = () => {
  if (topicInput.value.trim()) {
    editorialData.value.topics.push(topicInput.value.trim())
    topicInput.value = ''
    handleContentChange()
  }
}

const removeTopic = (index) => {
  editorialData.value.topics.splice(index, 1)
  handleContentChange()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    editorialData.value.image = file
    imagePreview.value = URL.createObjectURL(file)
    handleContentChange()
  }
}

const autoSave = debounce(async () => {
  if (!editorialData.value.title.trim()) return // Don't save if no title

  try {
    isSaving.value = true
    saveStatus.value = 'Saving...'

    const formData = new FormData()

    // Append all fields
    formData.append('title', editorialData.value.title)
    formData.append('summary', editorialData.value.summary || '')
    formData.append('content', editorialData.value.content || '')
    formData.append('keyArguments', JSON.stringify(editorialData.value.keyArguments))
    formData.append('topics', JSON.stringify(editorialData.value.topics))
    formData.append('status', 'draft')

    // Only append image if it's new or changed
    if (editorialData.value.image && !draftSlug.value) {
      formData.append('image', editorialData.value.image)
    }

    const token = localStorage.getItem('token')
    const endpoint = draftSlug.value
      ? `${props.apiEndpoint}/slug/${draftSlug.value}`
      : props.apiEndpoint
    const method = draftSlug.value ? 'put' : 'post'

    const response = await axios[method](endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      baseURL: 'http://localhost:5000',
    })

    // Update draftSlug if this was the first save
    if (!draftSlug.value && response.data.slug) {
      draftSlug.value = response.data.slug
    }

    lastSaved.value = new Date()
    hasUnsavedChanges.value = false
    saveStatus.value = `Last saved at ${formatTime(lastSaved.value)}`
  } catch (error) {
    console.error('Full error details:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    })
    saveStatus.value = 'Error saving'
  } finally {
    isSaving.value = false
  }
}, 2000)

const handlePublish = async () => {
  // Validate required fields for publishing
  if (!editorialData.value.title.trim()) {
    alert('Please write a title')
    return
  }

  // Automatically set category based on type
  if (props.type === 'wrestling') {
    editorialData.value.category = 'wrestling'
  } else if (props.type === 'nba') {
    editorialData.value.category = 'news'
  }

  if (!editorialData.value.category) {
    alert('Please select a category')
    return
  }

  if (!editorialData.value.summary.trim()) {
    alert('Please write a summary')
    return
  }

  if (!editorialData.value.content.trim()) {
    alert('Please write some content')
    return
  }

  if (!editorialData.value.image) {
    alert('Please upload an image')
    return
  }

  try {
    isSubmitting.value = true
    const formData = new FormData()

    formData.append('title', editorialData.value.title)
    formData.append('category', editorialData.value.category)
    formData.append('summary', editorialData.value.summary)
    formData.append('content', editorialData.value.content)
    formData.append('keyArguments', JSON.stringify(editorialData.value.keyArguments))
    formData.append('topics', JSON.stringify(editorialData.value.topics))
    formData.append('status', 'published')

    if (editorialData.value.image) {
      formData.append('image', editorialData.value.image)
    }

    const token = localStorage.getItem('token')

    const response = await axios.post(props.apiEndpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      baseURL: 'http://localhost:5000',
    })

    console.log('Editorial published:', response.data)

    if (response.data._id) {
      router.push(`/${props.type}/editorials/`)
    }
  } catch (error) {
    console.error('Error publishing editorial:', error.response?.data || error)
    alert(error.response?.data?.message || 'Error publishing editorial')
  } finally {
    isSubmitting.value = false
  }
}

watch(
  () => ({
    title: editorialData.value.title,
    summary: editorialData.value.summary,
    content: editorialData.value.content,
    keyArguments: editorialData.value.keyArguments,
    topics: editorialData.value.topics,
  }),
  () => {
    hasUnsavedChanges.value = true
    autoSave()
  },
  { deep: true },
)

// Expose methods and data to parent
defineExpose({
  editorialData,
  isSubmitting,
})

onBeforeUnmount(() => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
})
</script>
