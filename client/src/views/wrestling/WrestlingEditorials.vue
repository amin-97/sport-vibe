// src/views/wrestling/EditorialsView.vue
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
      <button class="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90">
        All Topics
      </button>
      <button class="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50">WWE</button>
      <button class="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50">AEW</button>
      <button class="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50">Industry</button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Featured Editorial -->
      <div class="lg:col-span-2">
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            src="/placeholder-image.png"
            alt="Featured Editorial"
            class="w-full h-64 object-cover"
          />
          <div class="p-6">
            <span class="text-sm text-primary font-medium">Featured</span>
            <h2 class="mt-2 text-2xl font-bold text-gray-900">The Evolution of Modern Wrestling</h2>
            <p class="mt-4 text-gray-600">
              An in-depth analysis of how professional wrestling has evolved over the past decade,
              examining the impact of new promotions, changing audience expectations, and the rise
              of social media...
            </p>
            <div class="mt-6 flex items-center">
              <img src="/placeholder-image.png" alt="Author" class="w-10 h-10 rounded-full" />
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">John Doe</p>
                <p class="text-sm text-gray-500">Senior Wrestling Analyst</p>
              </div>
              <span class="ml-auto text-sm text-gray-500">5 min read</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Editorials Sidebar -->
      <div class="space-y-6">
        <h2 class="text-xl font-bold text-gray-900">Recent Editorials</h2>

        <div v-for="i in 4" :key="i" class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="p-4">
            <span class="text-xs text-primary font-medium">WWE</span>
            <h3 class="mt-1 text-lg font-semibold text-gray-900">
              The Future of Championship Storylines
            </h3>
            <p class="mt-2 text-sm text-gray-600 line-clamp-2">
              Analyzing the current championship landscape and predicting future developments...
            </p>
            <div class="mt-4 flex items-center justify-between">
              <div class="flex items-center">
                <img src="/placeholder-image.png" alt="Author" class="w-8 h-8 rounded-full" />
                <span class="ml-2 text-sm text-gray-600">Jane Smith</span>
              </div>
              <span class="text-sm text-gray-500">3 min read</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Editorial Grid -->
    <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="i in 6" :key="i" class="bg-white shadow-lg rounded-lg overflow-hidden">
        <img src="/placeholder-image.png" alt="Editorial Image" class="w-full h-48 object-cover" />
        <div class="p-6">
          <span class="text-sm text-primary font-medium">AEW</span>
          <h3 class="mt-2 text-xl font-semibold text-gray-900">Editorial Title {{ i }}</h3>
          <p class="mt-2 text-gray-600">
            A thoughtful analysis of recent developments in professional wrestling...
          </p>
          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center">
              <img src="/placeholder-image.png" alt="Author" class="w-8 h-8 rounded-full" />
              <span class="ml-2 text-sm text-gray-600">Author Name</span>
            </div>
            <span class="text-sm text-gray-500">4 min read</span>
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
