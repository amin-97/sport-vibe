//components/layout/AuthSection.vue
<script setup>
import { useAuthStore } from '@/stores/auth'

defineProps({
  isDesktop: Boolean,
  isSigningOut: Boolean,
})
defineEmits(['sign-out'])

const authStore = useAuthStore()
</script>

<template>
  <div :class="isDesktop ? 'hidden md:flex items-center' : ''">
    <button
      v-if="!authStore.isAuthenticated"
      @click="authStore.signInWithGoogle"
      class="flex items-center px-4 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-100"
      :disabled="authStore.loading"
    >
      <img src="/google-icon.png" alt="Google" class="w-5 h-5 mr-2" />
      {{ authStore.loading ? 'Signing in...' : 'Sign in with Google' }}
    </button>

    <div v-else class="flex items-center">
      <template v-if="isSigningOut">
        <span class="text-sm text-gray-300">Signing out...</span>
      </template>
      <template v-else>
        <img :src="authStore.user?.photoURL" alt="Profile" class="w-8 h-8 rounded-full" />
        <span class="ml-2 text-sm text-gray-300">{{ authStore.user?.displayName }}</span>
        <button
          @click="$emit('sign-out')"
          class="ml-4 text-gray-300 hover:text-white transition-colors duration-200"
        >
          Sign Out
        </button>
      </template>
    </div>
  </div>
</template>
