<!-- //src/components/shared/LoadingOverlay.vue -->
<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-1"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-1"
  >
    <div
      v-if="authStore.signOutLoading"
      class="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center"
    >
      <div class="absolute inset-0 bg-black/50"></div>
      <div
        class="relative bg-white rounded-lg p-8 flex flex-col items-center shadow-xl transform transition-all"
      >
        <div class="relative">
          <!-- Outer spinning circle -->
          <div class="absolute inset-0 rounded-full border-4 border-primary/30"></div>
          <!-- Inner spinning circle -->
          <div
            class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
          ></div>
        </div>
        <p class="mt-4 text-lg font-medium text-gray-900">Signing out...</p>
        <p class="mt-2 text-sm text-gray-500">Please wait</p>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
</style>
