<template>
  <section class="py-12 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
        Explore Our Features
      </h2>

      <FeaturesCategory title="NBA Coverage" color-class="primary" :features="nbaFeatures" />

      <FeaturesCategory
        title="Wrestling Coverage"
        color-class="accent"
        :features="wrestlingFeatures"
        class="mt-16"
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import FeaturesCategory from './FeatureCategory.vue'

const nbaFeatures = ref([
  {
    title: 'Player Stats',
    description: 'Interactive graphs and detailed statistics for every NBA player',
    link: '/nba-stats',
  },
  {
    title: 'Team Rosters',
    description: 'Complete team rosters with detailed player information',
    link: '/nba/teams',
  },
  {
    title: 'Latest News',
    description: 'Breaking news and updates from around the league',
    link: '/nba/news',
  },
  {
    title: 'Editorials',
    description: 'Opinion pieces and analysis from NBA fans',
    link: '/nba/editorials',
  },
  // {
  //   title: 'Trade Simulator',
  //   description: 'Extensive NBA trade machine to create your own trades',
  //   link: '/nba/trade-simulator',
  // },
])

const wrestlingFeatures = ref([
  {
    title: 'Latest News',
    description: 'Breaking news and updates from WWE and AEW',
    link: '/wrestling/news',
  },
  {
    title: 'Event Results',
    description: 'Comprehensive coverage of wrestling events and matches',
    link: '/wrestling/results',
  },
  {
    title: 'Editorials',
    description: 'In-depth analysis and opinion pieces from our experts',
    link: '/wrestling/editorials',
  },
])
</script>
