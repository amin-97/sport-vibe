// src/views/nba/EditorialsView.vue
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900">NBA Editorials</h1>
      <p class="mt-4 text-xl text-gray-600">Analysis and opinions from our NBA experts</p>
    </div>

    <!-- Categories -->
    <div class="mb-8 flex flex-wrap gap-4">
      <button class="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90">
        All Topics
      </button>
      <button class="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50">Analysis</button>
      <button class="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50">
        Player Focus
      </button>
      <button class="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50">
        Team Strategy
      </button>
      <button class="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50">
        League Trends
      </button>
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
            <div class="flex items-center gap-2 mb-3">
              <span class="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full"
                >Featured Analysis</span
              >
              <span class="text-sm text-gray-500">10 min read</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-3">
              The Evolution of Modern NBA Offense
            </h2>
            <p class="text-gray-600 mb-4">
              An in-depth analysis of how NBA offensive strategies have transformed over the past
              decade, from the rise of the three-point shot to the modern spacing revolution...
            </p>
            <div class="flex items-center justify-between mt-6">
              <div class="flex items-center">
                <img src="/placeholder-image.png" alt="Author" class="w-10 h-10 rounded-full" />
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Mike Johnson</p>
                  <p class="text-sm text-gray-500">Senior NBA Analyst</p>
                </div>
              </div>
              <router-link to="#" class="text-primary hover:text-primary/90 font-medium">
                Read Article →
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-lg font-bold mb-4">Popular Editorials</h2>
          <div class="space-y-4">
            <div
              v-for="i in 4"
              :key="i"
              class="group cursor-pointer border-b last:border-0 pb-4 last:pb-0"
            >
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs text-primary">5 min read</span>
                <span class="text-xs text-gray-500">Analysis</span>
              </div>
              <h3 class="text-sm font-medium group-hover:text-primary">
                The Impact of Load Management on Team Success
              </h3>
            </div>
          </div>
        </div>

        <!-- Featured Authors -->
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-lg font-bold mb-4">Featured Authors</h2>
          <div class="space-y-4">
            <div v-for="i in 3" :key="i" class="flex items-center gap-3">
              <img src="/placeholder-image.png" alt="Author" class="w-10 h-10 rounded-full" />
              <div>
                <p class="text-sm font-medium text-gray-900">Author Name</p>
                <p class="text-xs text-gray-500">NBA Strategy Expert</p>
              </div>
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
          <div class="flex items-center gap-2 mb-3">
            <span class="text-sm text-primary">Analysis</span>
            <span class="text-sm text-gray-500">7 min read</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">NBA Editorial Title {{ i }}</h3>
          <p class="text-gray-600 text-sm mb-4">
            A detailed analysis of current NBA trends and strategies...
          </p>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <img src="/placeholder-image.png" alt="Author" class="w-8 h-8 rounded-full" />
              <span class="ml-2 text-sm text-gray-600">Author Name</span>
            </div>
            <router-link to="#" class="text-primary hover:text-primary/90 text-sm font-medium">
              Read More →
            </router-link>
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
