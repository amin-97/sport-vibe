// src/views/nba/TeamsView.vue
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900">NBA Team Rosters</h1>
      <p class="mt-4 text-xl text-gray-600">View complete rosters for all NBA teams</p>
    </div>

    <!-- Team Selection -->
    <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <!-- Team cards will be dynamically generated -->
        <button
          v-for="i in 5"
          :key="i"
          class="p-4 border-2 border-gray-200 rounded-lg hover:border-primary focus:outline-none focus:border-primary transition-colors"
        >
          <div class="text-center">Team {{ i }}</div>
        </button>
      </div>
    </div>

    <!-- Team Roster -->
    <div class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-6">Team Roster</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Player cards will be dynamically generated -->
        <div v-for="i in 6" :key="i" class="border rounded-lg p-4">
          <div class="text-lg font-medium mb-2">Player {{ i }}</div>
          <div class="text-sm text-gray-600">
            <p>Position: Guard</p>
            <p>Number: #{{ i }}</p>
            <p>Experience: 5 years</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component logic will be added later
</script>
