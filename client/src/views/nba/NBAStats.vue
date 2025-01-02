// src/views/nba/StatsView.vue
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900">NBA Player Stats</h1>
      <p class="mt-4 text-xl text-gray-600">Track performance metrics for every NBA player</p>
    </div>

    <div class="bg-white shadow-lg rounded-lg p-6">
      <!-- Stats Filter Section -->
      <div class="mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Season Select -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Season</label>
            <select
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option>2023-24</option>
              <option>2022-23</option>
              <option>2021-22</option>
            </select>
          </div>

          <!-- Team Select -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Team</label>
            <select
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option>All Teams</option>
              <option>Los Angeles Lakers</option>
              <option>Golden State Warriors</option>
              <!-- Add more teams -->
            </select>
          </div>

          <!-- Position Select -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Position</label>
            <select
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option>All Positions</option>
              <option>Guard</option>
              <option>Forward</option>
              <option>Center</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Stats Table Placeholder -->
      <div class="overflow-x-auto">
        <p class="text-gray-600 text-center py-12">Player stats will be displayed here</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component logic will be added later
</script>
