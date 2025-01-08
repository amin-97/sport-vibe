// components/nba/SearchFilter.vue
<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  search: String,
  team: String,
  teams: Array,
  disabled: Boolean,
})

const emit = defineEmits(['update:search', 'update:team'])
</script>

<template>
  <div class="flex flex-wrap gap-4 items-center">
    <!-- Search Input -->
    <div class="relative flex-1 min-w-[200px]">
      <input
        :value="search"
        @input="$emit('update:search', $event.target.value)"
        type="text"
        placeholder="Search players..."
        :disabled="disabled"
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      />
    </div>

    <!-- Team Filter -->
    <div class="min-w-[150px]">
      <select
        :value="team"
        @change="$emit('update:team', $event.target.value)"
        :disabled="disabled"
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      >
        <option v-for="team in teams" :key="team" :value="team">
          {{ team }}
        </option>
      </select>
    </div>
  </div>
</template>
