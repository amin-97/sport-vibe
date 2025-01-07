<template>
  <div class="min-h-screen">
    <HeroSection />
    <FeaturesSection />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const HeroSection = defineAsyncComponent(() => import('./home/HeroSection.vue'))
const FeaturesSection = defineAsyncComponent(() => import('./home/FeaturesSection.vue'))
</script>
