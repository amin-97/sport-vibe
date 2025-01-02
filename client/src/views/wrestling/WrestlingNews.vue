// src/views/wrestling/NewsView.vue
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900">Wrestling News</h1>
      <p class="mt-4 text-xl text-gray-600">Latest updates from WWE and AEW</p>
    </div>

    <!-- News Filter -->
    <div class="mb-8 flex space-x-4">
      <button class="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90">
        All News
      </button>
      <button class="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50">WWE</button>
      <button class="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50">AEW</button>
    </div>

    <!-- News Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="i in 6" :key="i" class="bg-white shadow-lg rounded-lg overflow-hidden">
        <img src="/placeholder-image.png" alt="News Image" class="w-full h-48 object-cover" />
        <div class="p-6">
          <span class="text-sm text-primary font-medium">WWE</span>
          <h2 class="mt-2 text-xl font-semibold text-gray-900">News Headline {{ i }}</h2>
          <p class="mt-2 text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <div class="mt-4 flex items-center justify-between">
            <span class="text-sm text-gray-500">2 hours ago</span>
            <button class="text-primary hover:text-primary/90">Read More →</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-12 flex justify-center">
      <nav class="flex items-center space-x-2">
        <button class="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-50">
          Previous
        </button>
        <button class="px-3 py-1 rounded-md bg-primary text-white">1</button>
        <button class="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-50">2</button>
        <button class="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-50">3</button>
        <button class="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-50">Next</button>
      </nav>
    </div>
  </div>
</template>

<script setup>
// Component logic will be added later
</script>
