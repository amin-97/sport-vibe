<!-- //src/App.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading Overlay -->
    <LoadingOverlay />

    <Suspense>
      <template #default>
        <nav>
          <LazyHeaderComp />
        </nav>
      </template>
      <template #fallback>
        <div class="h-16 bg-primary"></div>
      </template>
    </Suspense>

    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <Suspense>
          <template #default>
            <transition name="fade" mode="out-in">
              <component :is="Component" :key="$route.path" />
            </transition>
          </template>
          <template #fallback>
            <div class="loading-placeholder"></div>
          </template>
        </Suspense>
      </router-view>
    </main>

    <Suspense>
      <template #default>
        <LazyFooterComp />
      </template>
      <template #fallback>
        <div class="h-16 bg-gray-100"></div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import LoadingOverlay from './shared/LoadingOverlay.vue'

const LazyHeaderComp = defineAsyncComponent(() => import('./components/layout/HeaderComp.vue'))
const LazyFooterComp = defineAsyncComponent(() => import('./components/layout/FooterComp.vue'))
</script>
