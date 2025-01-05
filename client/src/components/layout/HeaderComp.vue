<template>
  <header class="bg-primary shadow-lg relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <router-link to="/" class="text-2xl font-bold text-white">SportVibe</router-link>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex space-x-8">
          <!-- Admin Navigation -->
          <template v-if="authStore.isAdmin">
            <div class="relative group">
              <button
                class="text-gray-300 hover:text-white relative px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                @mouseenter="showDropdown('write')"
                @mouseleave="hideDropdown"
              >
                Write
                <svg class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span
                  class="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 transform scale-x-0 transition-transform duration-300 ease-out origin-left group-hover:scale-x-100 mt-1"
                ></span>
              </button>
              <div
                v-show="activeDropdown === 'write'"
                class="absolute left-0 top-full min-w-[200px] rounded-md shadow-lg py-1 bg-primary ring-1 ring-black ring-opacity-5 transition-all duration-300 transform translate-y-1 z-10"
                @mouseenter="showDropdown('write')"
                @mouseleave="hideDropdown"
              >
                <router-link
                  to="/admin/write/results"
                  class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                  >Write Wrestling Results</router-link
                >
                <router-link
                  to="/admin/write/news"
                  class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                  >Write Wrestling News</router-link
                >
                <router-link
                  to="/admin/write/editorial"
                  class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                  >Write Wrestling Editorial</router-link
                >
                <router-link
                  to="/admin/write/nba/editorial"
                  class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                  >Write NBA Editorial</router-link
                >
                <router-link
                  to="/admin/write/nba/news"
                  class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                  >Write NBA News</router-link
                >
              </div>
            </div>

            <!-- Admin Dashboard -->
            <div class="relative group">
              <button
                class="text-gray-300 hover:text-white relative px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                @mouseenter="showDropdown('admin')"
                @mouseleave="hideDropdown"
              >
                Admin
                <svg class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span
                  class="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 transform scale-x-0 transition-transform duration-300 ease-out origin-left group-hover:scale-x-100 mt-1"
                ></span>
              </button>
              <div
                v-show="activeDropdown === 'admin'"
                class="absolute left-0 top-full min-w-[200px] rounded-md shadow-lg py-1 bg-primary ring-1 ring-black ring-opacity-5 transition-all duration-300 transform translate-y-1 z-10"
                @mouseenter="showDropdown('admin')"
                @mouseleave="hideDropdown"
              >
                <router-link
                  to="/admin/dashboard"
                  class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                  >Dashboard</router-link
                >
              </div>
            </div>
            <!-- Add this after the Admin Dashboard dropdown in HeaderComp -->
            <router-link
              to="/admin/drafts"
              class="text-gray-300 hover:text-white relative px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
            >
              Saved Drafts
              <span
                class="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 transform scale-x-0 transition-transform duration-300 ease-out origin-left group-hover:scale-x-100 mt-1"
              ></span>
            </router-link>
          </template>

          <!-- NBA Dropdown -->
          <div class="relative group">
            <button
              class="text-gray-300 hover:text-white relative px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
              @mouseenter="showDropdown('nba')"
              @mouseleave="hideDropdown"
            >
              NBA
              <svg class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              <span
                class="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 transform scale-x-0 transition-transform duration-300 ease-out origin-left group-hover:scale-x-100 mt-1"
              ></span>
            </button>
            <div
              v-show="activeDropdown === 'nba'"
              class="absolute left-0 top-full min-w-[200px] rounded-md shadow-lg py-1 bg-primary ring-1 ring-black ring-opacity-5 transition-all duration-300 transform translate-y-1 z-10"
              @mouseenter="showDropdown('nba')"
              @mouseleave="hideDropdown"
            >
              <router-link
                to="/nba/news"
                class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                >News</router-link
              >
              <router-link
                to="/nba/editorials"
                class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                >Editorials</router-link
              >
              <router-link
                to="/nba-stats"
                class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                >Player Stats</router-link
              >
              <router-link
                to="/nba/trade-simulator"
                class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                >Trade Simulator</router-link
              >
              <router-link
                to="/nba/teams"
                class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                >Team Rosters</router-link
              >
            </div>
          </div>

          <!-- Wrestling Dropdown -->
          <div class="relative group">
            <button
              class="text-gray-300 hover:text-white relative px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
              @mouseenter="showDropdown('wrestling')"
              @mouseleave="hideDropdown"
            >
              Wrestling
              <svg class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              <span
                class="absolute left-0 bottom-0 w-full h-0.5 bg-orange-500 transform scale-x-0 transition-transform duration-300 ease-out origin-left group-hover:scale-x-100 mt-1"
              ></span>
            </button>
            <div
              v-show="activeDropdown === 'wrestling'"
              class="absolute left-0 top-full min-w-[200px] rounded-md shadow-lg py-1 bg-primary ring-1 ring-black ring-opacity-5 transition-all duration-300 transform translate-y-1 z-10"
              @mouseenter="showDropdown('wrestling')"
              @mouseleave="hideDropdown"
            >
              <router-link
                to="/wrestling/news"
                class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                >News</router-link
              >
              <router-link
                to="/wrestling/results"
                class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                >Results</router-link
              >
              <router-link
                to="/wrestling/editorials"
                class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                >Editorials</router-link
              >
            </div>
          </div>
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
          <div v-else class="relative">
            <button
              class="flex items-center text-gray-300 hover:text-white"
              @mouseenter="showDropdown('user')"
              @mouseleave="hideDropdown"
            >
              <img :src="authStore.user?.photoURL" alt="Profile" class="w-8 h-8 rounded-full" />
              <span class="ml-2 text-sm">{{ authStore.user?.displayName }}</span>
              <svg class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <div
              v-show="activeDropdown === 'user'"
              class="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10"
              @mouseenter="showDropdown('user')"
              @mouseleave="hideDropdown"
            >
              <div class="px-4 py-2 text-xs text-gray-500">
                {{ authStore.isAdmin ? 'Admin User' : 'User' }}
              </div>
              <button
                @click="handleSignOut"
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
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { signOut } from 'firebase/auth'
import { auth } from '@/config/firebase'

const authStore = useAuthStore()
const activeDropdown = ref(null)
let hideTimer = null

const showDropdown = (dropdown) => {
  clearTimeout(hideTimer)
  activeDropdown.value = dropdown
}

const hideDropdown = () => {
  hideTimer = setTimeout(() => {
    activeDropdown.value = null
  }, 150)
}

const handleSignOut = async () => {
  try {
    await signOut(auth)
    await authStore.signOut()
    activeDropdown.value = null
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
</script>

<style scoped>
.group:hover .absolute {
  transform: translateY(0);
}
</style>
