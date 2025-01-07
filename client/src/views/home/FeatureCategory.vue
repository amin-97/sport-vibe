<!-- FeatureCategory.vue -->
<template>
  <div :class="containerClass">
    <h3 class="text-2xl font-bold mb-6 flex items-center">
      <span :class="titleClass">{{ title }}</span>
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <FeatureCard
        v-for="feature in features"
        :key="feature.title"
        v-bind="feature"
        :color-class="colorClass"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import FeatureCard from '@/components/FeatureCard.vue'

const props = defineProps({
  title: String,
  colorClass: String,
  features: Array,
})

const containerClass = computed(() => ['mt-12', props.class])
const titleClass = computed(() => [
  `bg-${props.colorClass}/10`,
  `text-${props.colorClass}`,
  'px-4 py-2 rounded-lg',
])
</script>
