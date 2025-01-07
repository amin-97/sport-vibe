<!-- NavSection.vue -->
<template>
  <div class="col-span-1">
    <h4 class="text-white text-md font-semibold mb-4">{{ title }}</h4>
    <ul class="space-y-2">
      <li v-for="link in links" :key="link.to">
        <router-link :to="link.to" class="text-gray-300 hover:text-white text-sm transition-colors">
          {{ link.text }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  links: Array,
})
</script>
