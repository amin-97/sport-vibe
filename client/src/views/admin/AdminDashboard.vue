<!-- src/views/admin/AdminDashboard.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <!-- Content Type Tabs -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="currentTab = tab.value"
            :class="[
              currentTab === tab.value
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap pb-4 px-1 border-b-2 font-medium transition-colors duration-200',
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12 text-red-600">
        {{ error }}
      </div>

      <!-- Content Table -->
      <div v-else class="overflow-x-auto">
        <!-- Table Controls -->
        <div class="mb-4 flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Search by title..."
              class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
            <select
              v-model="sortBy"
              class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        <div class="mb-4 text-sm text-gray-500">
          Total items: {{ filteredAndSortedItems.length }}
        </div>

        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Image
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created At
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredAndSortedItems.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                No items found for {{ currentTab }}
              </td>
            </tr>
            <tr v-else v-for="item in filteredAndSortedItems" :key="item._id">
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link :to="getDetailRoute(item)">
                  <img
                    :src="item.image?.url || item.coverImage?.url || '/placeholder-image.png'"
                    :alt="item.title || item.name"
                    class="h-16 w-16 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity duration-200"
                  />
                </router-link>
              </td>
              <td class="px-6 py-4">
                <router-link
                  :to="getDetailRoute(item)"
                  class="text-sm font-medium text-gray-900 hover:text-primary transition-colors duration-200"
                >
                  {{ item.title || item.name }}
                </router-link>
                <div
                  v-if="item.description || item.venue"
                  class="text-sm text-gray-500 truncate max-w-md"
                >
                  {{ item.description || item.venue }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(item.createdAt || item.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  @click="handleEdit(item)"
                  class="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  @click="handleDelete(item)"
                  class="text-red-600 hover:text-red-900 transition-colors duration-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import api from '@/utils/axios'

const router = useRouter()

const tabs = [
  { label: 'NBA News', value: 'nbaNews' },
  { label: 'NBA Editorials', value: 'nbaEditorials' },
  { label: 'Wrestling Results', value: 'wrestlingResults' },
  { label: 'Wrestling News', value: 'wrestlingNews' },
  { label: 'Wrestling Editorials', value: 'wrestlingEditorials' },
]

const currentTab = ref('nbaNews')
const items = ref([])
const loading = ref(false)
const error = ref(null)
const searchTerm = ref('')
const sortBy = ref('newest')

const filteredAndSortedItems = computed(() => {
  // First ensure items array exists and filter out any undefined/null items
  let validItems = items.value?.filter((item) => item && (item.title || item.name)) || []

  // Then perform the search filtering
  let filtered = validItems.filter((item) => {
    const searchString = (item.title || item.name || '').toLowerCase()
    return searchString.includes((searchTerm.value || '').toLowerCase())
  })

  return filtered.sort((a, b) => {
    if (sortBy.value === 'newest') {
      return new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)
    }
    if (sortBy.value === 'oldest') {
      return new Date(a.createdAt || a.date || 0) - new Date(b.createdAt || b.date || 0)
    }
    if (sortBy.value === 'title') {
      const aString = (a.title || a.name || '').toLowerCase()
      const bString = (b.title || b.name || '').toLowerCase()
      return aString.localeCompare(bString)
    }
    return 0
  })
})

const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy')
}

const apiEndpoints = {
  nbaNews: '/api/nba-news',
  nbaEditorials: '/api/nba-editorials',
  wrestlingResults: '/api/wrestling-results',
  wrestlingNews: '/api/wrestling-news',
  wrestlingEditorials: '/api/wrestling-editorials',
}

const getDetailRoute = (item) => {
  const routes = {
    nbaNews: `/nba/news/${item.slug}`,
    nbaEditorials: `/nba/editorials/${item.slug}`,
    wrestlingResults: `/wrestling/results/${item.slug}`,
    wrestlingNews: `/wrestling/news/${item.slug}`,
    wrestlingEditorials: `/wrestling/editorials/${item.slug}`,
  }
  return routes[currentTab.value]
}

async function fetchItems() {
  try {
    loading.value = true
    console.log('Current tab:', currentTab.value)
    console.log('Fetching from endpoint:', apiEndpoints[currentTab.value])

    const { data } = await api.get(apiEndpoints[currentTab.value])
    console.log('Received data:', data)

    items.value = data
  } catch (err) {
    console.error('Error fetching items:', err.response?.data || err)
    error.value = 'Failed to load items'
  } finally {
    loading.value = false
  }
}

const handleEdit = (item) => {
  const editRoutes = {
    nbaNews: `/admin/edit/nba/news/${item.slug}`,
    nbaEditorials: `/admin/edit/nba/editorial/${item.slug}`,
    wrestlingResults: `/admin/edit/wrestling/results/${item.slug}`,
    wrestlingNews: `/admin/edit/wrestling/news/${item.slug}`,
    wrestlingEditorials: `/admin/edit/wrestling/editorial/${item.slug}`,
  }
  router.push(editRoutes[currentTab.value])
}

const handleDelete = async (item) => {
  if (!confirm('Are you sure you want to delete this item?')) return

  try {
    await api.delete(`${apiEndpoints[currentTab.value]}/slug/${item.slug}`)
    items.value = items.value.filter((i) => i.slug !== item.slug)
  } catch (err) {
    console.error('Error deleting item:', err)
    if (err.response?.status === 404) {
      alert('The item you are trying to delete was not found. It may have already been deleted.')
    } else {
      alert('Failed to delete item. Please try again later.')
    }
  }
}

watch(currentTab, fetchItems)

onMounted(fetchItems)
</script>

<style scoped>
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.hover\:opacity-75:hover {
  opacity: 0.75;
}

.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
