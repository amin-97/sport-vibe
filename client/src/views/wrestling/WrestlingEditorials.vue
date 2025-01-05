<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { format } from 'date-fns'

const editorials = ref([])
const selectedCategory = ref('all')
const loading = ref(false)
const error = ref(null)

const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy')
}

// Get featured editorial (most recent with featured flag)
const featuredEditorial = computed(
  () => editorials.value.find((ed) => ed.featured) || editorials.value[0],
)

// Get recent editorials excluding the featured one
const recentEditorials = computed(() =>
  editorials.value.filter((ed) => ed._id !== featuredEditorial.value?._id).slice(0, 4),
)

// Filter editorials for the grid
const filteredEditorials = computed(() => {
  const nonFeatured = editorials.value
    .filter((ed) => ed._id !== featuredEditorial.value?._id)
    .slice(4) // Exclude the ones shown in recent

  if (selectedCategory.value === 'all') return nonFeatured
  return nonFeatured.filter((ed) => ed.topics.includes(selectedCategory.value.toLowerCase()))
})

const fetchEditorials = async () => {
  try {
    loading.value = true
    const { data } = await axios.get('/api/wrestling-editorials')
    editorials.value = data
  } catch (err) {
    error.value = 'Failed to fetch editorials'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchEditorials)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900">Wrestling Editorials</h1>
      <p class="mt-4 text-xl text-gray-600">
        In-depth analysis and opinion pieces from our experts
      </p>
    </div>

    <!-- Category Filter -->
    <div class="mb-8 flex space-x-4">
      <button
        v-for="category in ['all', 'wwe', 'aew', 'industry']"
        :key="category"
        @click="selectedCategory = category"
        :class="[
          'px-4 py-2 rounded-md',
          selectedCategory === category
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50',
        ]"
      >
        {{ category === 'all' ? 'All Topics' : category.toUpperCase() }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 text-red-600">
      {{ error }}
    </div>

    <template v-else>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Featured Editorial -->
        <div v-if="featuredEditorial" class="lg:col-span-2">
          <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              :src="featuredEditorial.image?.url || '/placeholder-image.png'"
              :alt="featuredEditorial.title"
              class="w-full h-64 object-cover"
            />
            <div class="p-6">
              <span class="text-sm text-primary font-medium">Featured</span>
              <h2 class="mt-2 text-2xl font-bold text-gray-900">{{ featuredEditorial.title }}</h2>
              <p class="mt-4 text-gray-600">{{ featuredEditorial.summary }}</p>
              <div class="mt-6 flex items-center">
                <img
                  :src="featuredEditorial.author?.photoURL || '/placeholder-image.png'"
                  :alt="featuredEditorial.author?.displayName"
                  class="w-10 h-10 rounded-full"
                />
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    {{ featuredEditorial.author?.displayName }}
                  </p>
                  <p class="text-sm text-gray-500">{{ formatDate(featuredEditorial.createdAt) }}</p>
                </div>
                <span class="ml-auto text-sm text-gray-500"
                  >{{ featuredEditorial.readingTime }} min read</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Editorials Sidebar -->
        <div class="space-y-6">
          <h2 class="text-xl font-bold text-gray-900">Recent Editorials</h2>
          <div
            v-for="editorial in recentEditorials"
            :key="editorial._id"
            class="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <div class="p-4">
              <div class="flex flex-wrap gap-2 mb-2">
                <span
                  v-for="topic in editorial.topics"
                  :key="topic"
                  class="text-xs text-primary font-medium"
                >
                  {{ topic }}
                </span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">{{ editorial.title }}</h3>
              <p class="mt-2 text-sm text-gray-600 line-clamp-2">{{ editorial.summary }}</p>
              <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center">
                  <img
                    :src="editorial.author?.photoURL || '/placeholder-image.png'"
                    :alt="editorial.author?.displayName"
                    class="w-8 h-8 rounded-full"
                  />
                  <span class="ml-2 text-sm text-gray-600">{{
                    editorial.author?.displayName
                  }}</span>
                </div>
                <span class="text-sm text-gray-500">{{ editorial.readingTime }} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Editorial Grid -->
      <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="editorial in filteredEditorials"
          :key="editorial._id"
          class="bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <img
            :src="editorial.image?.url || '/placeholder-image.png'"
            :alt="editorial.title"
            class="w-full h-48 object-cover"
          />
          <div class="p-6">
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="topic in editorial.topics"
                :key="topic"
                class="text-sm text-primary font-medium"
              >
                {{ topic }}
              </span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">{{ editorial.title }}</h3>
            <p class="mt-2 text-gray-600">{{ editorial.summary }}</p>
            <div class="mt-4 flex items-center justify-between">
              <div class="flex items-center">
                <img
                  :src="editorial.author?.photoURL || '/placeholder-image.png'"
                  :alt="editorial.author?.displayName"
                  class="w-8 h-8 rounded-full"
                />
                <span class="ml-2 text-sm text-gray-600">{{ editorial.author?.displayName }}</span>
              </div>
              <span class="text-sm text-gray-500">{{ editorial.readingTime }} min read</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
