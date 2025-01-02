// src/views/wrestling/ResultsView.vue
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900">Wrestling Results</h1>
      <p class="mt-4 text-xl text-gray-600">Latest match results and event coverage</p>
    </div>

    <!-- Results Filter -->
    <div class="mb-8 flex flex-wrap gap-4">
      <button class="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90">
        All Events
      </button>
      <button class="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50">WWE</button>
      <button class="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50">AEW</button>
      <button class="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50">
        PPV Events
      </button>
      <button class="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50">
        Weekly Shows
      </button>
    </div>

    <!-- Results List -->
    <div class="space-y-8">
      <!-- Event Card -->
      <div v-for="i in 5" :key="i" class="bg-white shadow-lg rounded-lg overflow-hidden">
        <!-- Event Header -->
        <div class="bg-gray-50 p-6 border-b">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Event Name {{ i }}</h2>
              <div class="mt-2 flex items-center gap-4 text-gray-600">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  January {{ i + 20 }}, 2024
                </span>
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Arena Location
                </span>
              </div>
            </div>
            <span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >WWE</span
            >
          </div>
        </div>

        <!-- Match Results -->
        <div class="p-6 space-y-6">
          <!-- Main Event -->
          <div class="border-b pb-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-primary">Main Event</span>
              <span class="text-sm text-gray-500">Championship Match</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Roman Reigns vs Seth Rollins</h3>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Winner: Roman Reigns</span>
              <span class="text-gray-500 text-sm">22:45</span>
            </div>
            <p class="mt-2 text-gray-600 text-sm">Via pinfall after a Spear</p>
          </div>

          <!-- Other Matches -->
          <div v-for="j in 3" :key="j" class="border-b last:border-0 pb-4 last:pb-0">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Match {{ j }}</span>
              <span class="text-sm text-gray-500">Singles Match</span>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Wrestler A vs Wrestler B</h3>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Winner: Wrestler A</span>
              <span class="text-gray-500 text-sm">15:30</span>
            </div>
            <p class="mt-2 text-gray-600 text-sm">Clean victory via submission</p>
          </div>
        </div>

        <!-- Event Footer -->
        <div class="bg-gray-50 px-6 py-4 border-t">
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-600">Attendance: 15,000</div>
            <button class="text-primary hover:text-primary/90 font-medium text-sm">
              Full Event Coverage →
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
