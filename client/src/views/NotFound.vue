// src/views/NotFoundView.vue
<template>
  <div class="min-h-[50vh] flex items-center justify-center px-4 py-12">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-primary">404</h1>
      <h2 class="mt-4 text-2xl font-bold text-gray-900">Page Not Found</h2>
      <p class="mt-2 text-gray-600">Sorry, we couldn't find the page you're looking for.</p>
      <router-link
        to="/"
        class="mt-6 inline-flex items-center text-primary hover:text-primary/90 font-medium"
      >
        Go back home →
      </router-link>
    </div>
  </div>
</template>

<script setup>
// No additional logic needed
</script>
