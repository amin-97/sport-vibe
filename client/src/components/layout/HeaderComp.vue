// src/components/layout/HeaderComp.vue
<template>
  <header class="bg-primary shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <router-link to="/" class="text-2xl font-bold text-white">SportVibe</router-link>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex space-x-8">
          <!-- NBA Dropdown -->
          <div class="relative group">
            <button
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
            >
              NBA
              <svg class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <div
              class="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
            >
              <router-link
                to="/nba/stats"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >Player Stats</router-link
              >
              <router-link
                to="/nba/trade-simulator"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >Trade Simulator</router-link
              >
              <router-link
                to="/nba/teams"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >Team Rosters</router-link
              >
            </div>
          </div>

          <!-- Wrestling Dropdown -->
          <div class="relative group">
            <button
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
            >
              Wrestling
              <svg class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <div
              class="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
            >
              <router-link
                to="/wrestling/news"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >News</router-link
              >
              <router-link
                to="/wrestling/results"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >Results</router-link
              >
              <router-link
                to="/wrestling/editorials"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >Editorials</router-link
              >
            </div>
          </div>

          <!-- Admin Navigation -->
          <template v-if="authStore.isAdmin">
            <div class="relative group">
              <button
                class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
              >
                Write
                <svg class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <div
                class="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
              >
                <router-link
                  to="/admin/write/results"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >Write Results</router-link
                >
                <router-link
                  to="/admin/write/article"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >Write Article</router-link
                >
                <router-link
                  to="/admin/write/editorial"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >Write Editorial</router-link
                >
              </div>
            </div>
          </template>
        </nav>

        <!-- Auth Button -->
        <div class="flex items-center">
          <button
            v-if="!authStore.isAuthenticated"
            @click="authStore.signInWithGoogle"
            class="flex items-center px-4 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-100"
            :disabled="authStore.loading"
          >
            <img src="/google-icon.png" alt="Google" class="w-5 h-5 mr-2" />
            {{ authStore.loading ? 'Signing in...' : 'Sign in with Google' }}
          </button>

          <!-- User Menu -->
          <div v-else class="relative group">
            <button class="flex items-center text-gray-300 hover:text-white">
              <img :src="authStore.user?.photoURL" alt="Profile" class="w-8 h-8 rounded-full" />
              <span class="ml-2 text-sm">{{ authStore.user?.displayName }}</span>
              <svg class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <div
              class="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
            >
              <div class="px-4 py-2 text-xs text-gray-500">
                {{ authStore.isAdmin ? 'Admin User' : 'User' }}
              </div>
              <button
                @click="authStore.signOut"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
