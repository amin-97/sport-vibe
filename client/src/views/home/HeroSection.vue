<template>
  <section class="relative bg-primary py-8 md:py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-center">
        <HeroContent />
        <div class="mt-6 lg:mt-0 lg:ml-8">
          <Suspense>
            <template #fallback>
              <div class="animate-pulse bg-gray-700 h-64 rounded-lg"></div>
            </template>
          </Suspense>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import HeroContent from './HeroContent.vue'
</script>
