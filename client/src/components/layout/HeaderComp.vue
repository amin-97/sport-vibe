<template>
  <header class="bg-primary shadow-lg">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <router-link to="/" class="text-2xl font-bold text-white">SportVibe</router-link>
        </div>

        <!-- Main Navigation -->
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
          <!-- NBA Dropdown -->
          <div class="relative group">
            <button class="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
              NBA
              <span class="ml-1">▼</span>
            </button>
            <div
              class="absolute z-10 hidden group-hover:block w-48 bg-white rounded-md shadow-lg py-1"
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
              <router-link
                to="/nba/news"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >News</router-link
              >
              <router-link
                to="/nba/editorials"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >Editorials</router-link
              >
            </div>
          </div>

          <!-- Wrestling Dropdown -->
          <div class="relative group">
            <button class="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
              Wrestling
              <span class="ml-1">▼</span>
            </button>
            <div
              class="absolute z-10 hidden group-hover:block w-48 bg-white rounded-md shadow-lg py-1"
            >
              <router-link
                to="/wrestling/news"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >News</router-link
              >
              <router-link
                to="/wrestling/editorials"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >Editorials</router-link
              >
              <router-link
                to="/wrestling/results"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >Results</router-link
              >
              <router-link
                to="/wrestling/roster"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >Roster</router-link
              >
            </div>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center sm:hidden">
          <button @click="isOpen = !isOpen" class="text-gray-300 hover:text-white">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                v-if="!isOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-show="isOpen" class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <router-link
            to="/nba/stats"
            class="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
            >NBA</router-link
          >
          <router-link
            to="/wrestling/news"
            class="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
            >Wrestling</router-link
          >
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
</script>
