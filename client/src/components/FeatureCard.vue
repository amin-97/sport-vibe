// src/components/FeatureCard.vue
<template>
  <div
    class="card group hover:shadow-xl transition-all duration-300"
    :class="`border-2 border-transparent hover:border-${colorClass}`"
  >
    <div class="space-y-4">
      <h3
        class="text-xl font-semibold text-gray-900 transition-colors"
        :class="`group-hover:text-${colorClass}`"
      >
        {{ title }}
      </h3>

      <p class="text-gray-600">
        {{ description }}
      </p>

      <router-link
        :to="link"
        class="inline-flex items-center font-medium transition-colors"
        :class="`text-${colorClass} group-hover:text-${colorClass}/80`"
      >
        Explore
        <svg
          class="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  link: String,
  colorClass: String,
})
</script>
