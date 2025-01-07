<template>
  <div class="relative group">
    <button
      class="text-gray-300 hover:text-white relative px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
      @mouseenter="$emit('show')"
      @mouseleave="$emit('hide')"
    >
      {{ text }}
      <svg class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        />
      </svg>
      <span class="desktop-underline"></span>
    </button>
    <div
      v-show="isActive"
      class="desktop-dropdown"
      @mouseenter="$emit('show')"
      @mouseleave="$emit('hide')"
    >
      <router-link v-for="item in items" :key="item.to" :to="item.to" class="dropdown-item">
        {{ item.text }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  text: String,
  items: Array,
  isActive: Boolean,
})
defineEmits(['show', 'hide'])
</script>
