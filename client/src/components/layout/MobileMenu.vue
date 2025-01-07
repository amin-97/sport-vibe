// MobileMenu.vue
<template>
  <div class="absolute top-0 inset-x-0 p-2 transition transform origin-top-right">
    <div
      class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-primary divide-y divide-gray-700"
    >
      <div class="pt-5 pb-6 px-5">
        <div class="flex items-center justify-end">
          <button @click="$emit('close')" class="rounded-md p-2 text-gray-400 hover:text-gray-500">
            <span class="sr-only">Close menu</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav class="mt-6 grid gap-y-8">
          <div v-for="(items, section) in menuItems" :key="section" class="mobile-section">
            <button @click="$emit('section-toggle', section)" class="mobile-section-button">
              <span>{{ section }}</span>
              <svg
                class="w-5 h-5 transform transition-transform duration-200"
                :class="{ 'rotate-180': activeSection === section }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                />
              </svg>
            </button>
            <div v-show="activeSection === section" class="mobile-section-content">
              <router-link
                v-for="item in items"
                :key="item.to"
                :to="item.to"
                class="mobile-link"
                @click="$emit('close')"
              >
                {{ item.text }}
              </router-link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  menuItems: Object,
  activeSection: String,
})
defineEmits(['section-toggle', 'close'])
</script>
