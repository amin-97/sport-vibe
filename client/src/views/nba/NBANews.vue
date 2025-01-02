<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900">NBA News</h1>
      <p class="mt-4 text-xl text-gray-600">Latest updates from around the league</p>
    </div>

    <!-- News Categories -->
    <div class="mb-8 flex flex-wrap gap-4">
      <button class="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90">
        All News
      </button>
      <button class="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50">
        Trade News
      </button>
      <button class="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50">Injuries</button>
      <button class="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50">
        Game Recaps
      </button>
      <button class="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50">
        Team News
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Featured News -->
      <div class="lg:col-span-2">
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <img src="/placeholder-image.png" alt="Featured News" class="w-full h-64 object-cover" />
          <div class="p-6">
            <div class="flex items-center gap-2 mb-3">
              <span class="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full"
                >Breaking News</span
              >
              <span class="text-sm text-gray-500">2 hours ago</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-3">
              Major Trade Deadline Deal Shakes Up Eastern Conference
            </h2>
            <p class="text-gray-600 mb-4">
              Multiple teams have agreed to a blockbuster trade involving All-Star players and
              future draft picks...
            </p>
            <router-link
              to="#"
              class="inline-flex items-center text-primary hover:text-primary/90 font-medium"
            >
              Read Full Story →
            </router-link>
          </div>
        </div>

        <!-- Recent News Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div v-for="i in 4" :key="i" class="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src="/placeholder-image.png" alt="News Image" class="w-full h-48 object-cover" />
            <div class="p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-sm text-primary">Team News</span>
                <span class="text-sm text-gray-500">5 hours ago</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">NBA News Headline {{ i }}</h3>
              <p class="text-sm text-gray-600 mb-3">
                Quick summary of the latest NBA news and updates...
              </p>
              <router-link to="#" class="text-sm text-primary hover:text-primary/90 font-medium">
                Read More →
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- News Sidebar -->
      <div class="space-y-6">
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-lg font-bold mb-4">Trending Stories</h2>
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="border-b last:border-0 pb-4 last:pb-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs text-primary">{{ i }}h ago</span>
                <span class="text-xs text-gray-500">Team Updates</span>
              </div>
              <h3 class="text-sm font-medium hover:text-primary cursor-pointer">
                Trending NBA story headline {{ i }}...
              </h3>
            </div>
          </div>
        </div>

        <!-- Tags/Topics -->
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-lg font-bold mb-4">Popular Topics</h2>
          <div class="flex flex-wrap gap-2">
            <button
              class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
            >
              Trade Deadline
            </button>
            <button
              class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
            >
              Playoffs
            </button>
            <button
              class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
            >
              Draft
            </button>
            <button
              class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
            >
              Free Agency
            </button>
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
