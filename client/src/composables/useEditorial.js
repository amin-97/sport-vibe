// src/composables/useEditorial.js
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { debounce } from 'lodash'

export function useEditorial(type = 'wrestling') {
  const router = useRouter()
  const isSubmitting = ref(false)
  const isSaving = ref(false)
  const lastSaved = ref(null)
  const hasUnsavedChanges = ref(false)
  const draftId = ref(null)
  const saveError = ref(null)

  const editorialData = ref({
    title: '',
    summary: '',
    content: '',
    image: null,
    keyArguments: [''],
    topics: [],
    status: 'draft',
    readingTime: 0, // Added this required field
  })

  // Add sport-specific fields
  if (type === 'nba') {
    editorialData.value.teams = []
    editorialData.value.players = []
  }

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date)
  }

  // Calculate reading time based on content length
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const autoSave = debounce(async () => {
    if (!editorialData.value.title.trim()) return // Don't save if no title

    try {
      isSaving.value = true
      hasUnsavedChanges.value = true
      saveError.value = null

      const formData = new FormData()

      // Calculate reading time before saving
      editorialData.value.readingTime = calculateReadingTime(editorialData.value.content || '')

      // Ensure status is a string
      const status = 'draft'

      // Log what we're sending
      const debugData = {
        title: editorialData.value.title,
        summary: editorialData.value.summary,
        content: editorialData.value.content,
        keyArguments: editorialData.value.keyArguments,
        topics: editorialData.value.topics,
        status: status,
        readingTime: editorialData.value.readingTime,
      }
      // console.log('Autosaving with data:', debugData)

      // Append all fields
      Object.keys(editorialData.value).forEach((key) => {
        if (key === 'image' && editorialData.value[key]) {
          formData.append('image', editorialData.value[key])
        } else if (key === 'status') {
          formData.append('status', status)
        } else if (Array.isArray(editorialData.value[key])) {
          const filteredArray = editorialData.value[key].filter(
            (item) => item && item.trim() !== '',
          )
          formData.append(key, JSON.stringify(filteredArray))
        } else if (editorialData.value[key] !== null && editorialData.value[key] !== undefined) {
          formData.append(key, editorialData.value[key])
        }
      })

      const endpoint = `/${type}-editorials${draftId.value ? `/${draftId.value}` : ''}`
      const method = draftId.value ? 'put' : 'post'

      const token = localStorage.getItem('token')
      const response = await axios[method](endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })

      // Rest of the method remains the same
    } catch (error) {
      // Error handling remains the same
    }
  }, 2000)

  const handleContentChange = () => {
    hasUnsavedChanges.value = true
    autoSave()
  }

  const publish = async () => {
    // Calculate final reading time before publishing
    editorialData.value.readingTime = calculateReadingTime(editorialData.value.content || '')

    // Validate all required fields
    if (!editorialData.value.title.trim()) {
      alert('Please enter a title')
      return
    }
    if (!editorialData.value.summary.trim()) {
      alert('Please enter a summary')
      return
    }
    if (!editorialData.value.content.trim()) {
      alert('Please enter content')
      return
    }
    if (!editorialData.value.image) {
      alert('Please upload an image')
      return
    }
    if (!editorialData.value.keyArguments[0]) {
      alert('Please enter at least one key argument')
      return
    }

    try {
      isSubmitting.value = true

      const formData = new FormData()
      Object.keys(editorialData.value).forEach((key) => {
        if (key === 'image' && editorialData.value[key]) {
          formData.append('image', editorialData.value[key])
        } else if (Array.isArray(editorialData.value[key])) {
          const filteredArray = editorialData.value[key].filter(
            (item) => item && item.trim() !== '',
          )
          formData.append(key, JSON.stringify(filteredArray))
        } else if (editorialData.value[key] !== null && editorialData.value[key] !== undefined) {
          formData.append(key, editorialData.value[key])
        }
      })
      formData.set('status', 'published')

      const token = localStorage.getItem('token')
      await axios.put(`/api/${type}-editorials/${draftId.value}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })

      router.push(`/${type}/editorials`)
    } catch (error) {
      console.error('Error publishing:', error)
      if (error.response?.data?.errors) {
        alert(error.response.data.errors.join('\n'))
      } else {
        alert(error.response?.data?.message || 'Error publishing editorial')
      }
    } finally {
      isSubmitting.value = false
    }
  }

  const loadDraft = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`/api/${type}-editorials/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      editorialData.value = { ...editorialData.value, ...response.data }
      draftId.value = id
    } catch (error) {
      console.error('Error loading draft:', error)
      alert('Error loading draft')
    }
  }

  return {
    editorialData,
    isSubmitting,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    saveError,
    handleContentChange,
    publish,
    loadDraft,
    formatTime,
  }
}
