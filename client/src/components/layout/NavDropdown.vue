//components/layout/NavDropdown.vue
<script setup>
import { ref, onBeforeUnmount } from 'vue'

const props = defineProps({
  text: String,
  items: Array,
  isActive: Boolean,
})

const emit = defineEmits(['show', 'hide'])

const hideTimeout = ref(null)
const showTimeout = ref(null)

const handleMouseEnter = () => {
  if (hideTimeout.value) {
    clearTimeout(hideTimeout.value)
    hideTimeout.value = null
  }

  if (showTimeout.value) {
    clearTimeout(showTimeout.value)
  }

  showTimeout.value = setTimeout(() => {
    emit('show')
  }, 100) // Small delay before showing
}

const handleMouseLeave = () => {
  if (showTimeout.value) {
    clearTimeout(showTimeout.value)
    showTimeout.value = null
  }

  hideTimeout.value = setTimeout(() => {
    emit('hide')
  }, 300) // Longer delay before hiding
}

// Clean up timeouts
onBeforeUnmount(() => {
  if (hideTimeout.value) clearTimeout(hideTimeout.value)
  if (showTimeout.value) clearTimeout(showTimeout.value)
})
</script>

<template>
  <div class="relative group" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <button
      class="text-gray-300 hover:text-white relative px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
      :class="{ 'text-white': isActive }"
    >
      {{ text }}
      <svg
        class="ml-1 h-4 w-4 transition-transform duration-200"
        :class="{ 'rotate-180': isActive }"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        />
      </svg>
      <span
        class="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform origin-left"
        :class="{ 'scale-x-100': isActive }"
      ></span>
    </button>

    <div
      v-show="isActive"
      class="absolute z-10 left-0 mt-1 w-56 origin-top-left transform transition-all duration-200"
    >
      <div class="rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1">
        <router-link
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
          v-slot="{ isActive: isLinkActive }"
        >
          <div :class="{ 'text-primary font-medium': isLinkActive }">
            {{ item.text }}
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group:hover .scale-x-0 {
  transform: scaleX(0.5);
}
</style>
