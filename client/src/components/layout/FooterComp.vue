<template>
  <footer class="bg-primary mt-auto">
    <div class="max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
        <BrandSection />

        <NavSection title="NBA" :links="nbaLinks" />
        <NavSection title="Wrestling" :links="wrestlingLinks" />
        <SocialSection />
      </div>

      <div class="mt-8 border-t border-gray-700 pt-8">
        <p class="text-gray-400 text-sm text-center" v-text="copyrightText" />
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import BrandSection from './BrandSection.vue'
import NavSection from './NavSection.vue'
import SocialSection from './SocialSection.vue'

const nbaLinks = [
  { text: 'Player Stats', to: '/nba-stats' },
  { text: 'Team Rosters', to: '/nba/teams' },
  { text: 'News', to: '/nba/news' },
  { text: 'Editorials', to: '/nba/editorials' },
]

const wrestlingLinks = [
  { text: 'News', to: '/wrestling/news' },
  { text: 'Results', to: '/wrestling/results' },
  { text: 'Editorials', to: '/wrestling/editorials' },
]

const copyrightText = computed(
  () => `© ${new Date().getFullYear()} SportVibe. All rights reserved.`,
)
</script>
