<!-- src/components/news/BaseNewsForm.vue -->
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
              v-model="newsData.title"
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              v-model="newsData.category"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="">Select Category</option>
              <option v-for="category in categories" :key="category.value" :value="category.value">
                {{ category.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <textarea
              v-model="newsData.description"
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

        <!-- Slot for additional fields (like teams and players for NBA) -->
        <slot name="additional-fields"></slot>

        <!-- Submit Buttons -->
        <div class="flex justify-end gap-4 mt-6">
          <!-- <button
            type="button"
            @click="handleSaveAsDraft"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            {{ isSubmitting ? 'Saving...' : 'Save as Draft' }}
          </button> -->
          <button
            type="button"
            @click="handlePublish"
            :disabled="isSubmitting || isSaving"
            class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {{ isSubmitting ? 'Publishing...' : 'Publish News' }}
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
  categories: {
    type: Array,
    required: true,
  },
  apiEndpoint: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const isSubmitting = ref(false)
const imagePreview = ref(null)
const tagInput = ref('')
const lastSaved = ref(null)
const isSaving = ref(false)
// const draftId = ref(null)
const draftSlug = ref(null)

const saveStatus = ref('Saved')
const hasUnsavedChanges = ref(false)

const newsData = ref({
  title: '',
  category: '',
  description: '',
  content: '',
  image: null,
  tags: [],
})

const formatTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date)
}

// Tags Management
const addTag = () => {
  if (tagInput.value.trim()) {
    newsData.value.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const autoSave = debounce(async () => {
  if (!newsData.value.title.trim()) return // Don't save if no title

  try {
    isSaving.value = true
    saveStatus.value = 'Saving...'

    console.log('Attempting to save with data:', {
      title: newsData.value.title,
      category: newsData.value.category,
      description: newsData.value.description,
      content: newsData.value.content,
      tags: newsData.value.tags,
      image: newsData.value.image ? 'Image Present' : 'No Image',
    })

    const formData = new FormData()

    // Append all fields
    formData.append('title', newsData.value.title)

    // Only append category if it has a non-empty value
    if (newsData.value.category) {
      formData.append('category', newsData.value.category)
    }

    formData.append('description', newsData.value.description || '')
    formData.append('content', newsData.value.content || '')
    formData.append('tags', JSON.stringify(newsData.value.tags))
    formData.append('status', 'draft')

    // Only append image if it's new or changed
    if (newsData.value.image && !draftSlug.value) {
      formData.append('image', newsData.value.image)
    }

    const token = localStorage.getItem('token')
    const endpoint = draftSlug.value
      ? `${props.apiEndpoint}/slug/${draftSlug.value}`
      : props.apiEndpoint
    const method = draftSlug.value ? 'put' : 'post'

    console.log('Endpoint:', endpoint)
    console.log('Method:', method)
    console.log('FormData contents:', Object.fromEntries(formData))

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

// const autoSave = debounce(async () => {
//   if (!newsData.value.title.trim()) return // Don't save if no title

//   try {
//     isSaving.value = true
//     saveStatus.value = 'Saving...'

//     const formData = new FormData()

//     // Append all fields
//     formData.append('title', newsData.value.title)
//     formData.append('category', newsData.value.category || '')
//     formData.append('description', newsData.value.description || '')
//     formData.append('content', newsData.value.content || '')
//     formData.append('tags', JSON.stringify(newsData.value.tags))
//     formData.append('status', 'draft')

//     // Only append image if it's new or changed
//     if (newsData.value.image && !draftId.value) {
//       formData.append('image', newsData.value.image)
//     }

//     const token = localStorage.getItem('token')
//     const endpoint = draftId.value ? `${props.apiEndpoint}/${draftId.value}` : props.apiEndpoint
//     const method = draftId.value ? 'put' : 'post'

//     const response = await axios[method](endpoint, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         Authorization: `Bearer ${token}`,
//       },
//       baseURL: 'http://localhost:5000',
//     })

//     // Update draftId if this was the first save
//     if (!draftId.value && response.data._id) {
//       draftId.value = response.data._id
//     }

//     lastSaved.value = new Date()
//     hasUnsavedChanges.value = false
//     saveStatus.value = `Last saved at ${formatTime(lastSaved.value)}`
//   } catch (error) {
//     console.error('Error auto-saving:', error)
//     saveStatus.value = 'Error saving'
//   } finally {
//     isSaving.value = false
//   }
// }, 2000)

const removeTag = (index) => {
  newsData.value.tags.splice(index, 1)
}

watch(
  () => ({
    title: newsData.value.title,
    category: newsData.value.category,
    description: newsData.value.description,
    content: newsData.value.content,
    tags: newsData.value.tags,
  }),
  () => {
    hasUnsavedChanges.value = true
    autoSave()
  },
  { deep: true },
)

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    newsData.value.image = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const handlePublish = async () => {
  // Validate required fields for publishing
  if (!newsData.value.title.trim()) {
    alert('Please write a title')
    return
  }

  if (!newsData.value.category) {
    alert('Please select a category')
    return
  }

  if (!newsData.value.description.trim()) {
    alert('Please write a description')
    return
  }

  if (!newsData.value.content.trim()) {
    alert('Please write some content')
    return
  }

  if (!newsData.value.image) {
    alert('Please upload an image')
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

    const response = await axios.post(props.apiEndpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      baseURL: 'http://localhost:5000',
    })

    console.log('News published:', response.data)

    if (response.data._id) {
      router.push(`/${props.type}/news/`)
    }
  } catch (error) {
    console.error('Error publishing news:', error.response?.data || error)
    alert(error.response?.data?.message || 'Error publishing news article')
  } finally {
    isSubmitting.value = false
  }
}

const handleSaveAsDraft = async () => {
  // Only validate title and category for drafts
  if (!newsData.value.title.trim()) {
    alert('Please write a title before saving')
    return
  }

  if (!newsData.value.category) {
    alert('Please select a category before saving')
    return
  }

  try {
    isSubmitting.value = true
    const formData = new FormData()

    formData.append('title', newsData.value.title)
    formData.append('category', newsData.value.category)
    formData.append('description', newsData.value.description || '')
    formData.append('content', newsData.value.content || '')
    formData.append('tags', JSON.stringify(newsData.value.tags))
    formData.append('status', 'draft')

    if (newsData.value.image) {
      formData.append('image', newsData.value.image)
    }

    const token = localStorage.getItem('token')

    const response = await axios.post(props.apiEndpoint, formData, {
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

// Expose methods and data to parent
defineExpose({
  newsData,
  isSubmitting,
})

onMounted(() => {
  window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges.value) {
      e.preventDefault()
      e.returnValue = ''
    }
  })
})

onBeforeUnmount(() => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
})
</script>
