// src/views/HomeView.vue
<template>
  <div class="min-h-screen">
    <!-- Hero Section with Slideshow -->
    <div class="relative bg-primary py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <!-- Text Content -->
          <div class="text-center lg:text-left">
            <h1 class="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span class="block xl:inline">Your Ultimate Source for</span>
              <span class="block text-accent xl:inline"> Sports Entertainment</span>
            </h1>
            <p
              class="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
            >
              From NBA statistics and analysis to wrestling results and editorials, SportVibe brings
              you comprehensive coverage of your favorite sports.
            </p>
          </div>

          <!-- Slideshow -->
          <div class="lg:ml-8">
            <HeroSlideshow />
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Explore Our Features</h2>
        </div>

        <!-- NBA Section -->
        <div class="mt-12">
          <h3 class="text-2xl font-bold text-primary mb-6 flex items-center">
            <span class="bg-primary/10 text-primary px-4 py-2 rounded-lg">NBA Coverage</span>
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="feature in nbaFeatures"
              :key="feature.title"
              class="card group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary"
            >
              <div class="space-y-4">
                <h3
                  class="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors"
                >
                  {{ feature.title }}
                </h3>
                <p class="text-gray-600">
                  {{ feature.description }}
                </p>
                <router-link
                  :to="feature.link"
                  class="inline-flex items-center text-primary font-medium group-hover:text-primary/80 transition-colors"
                >
                  Explore
                  <svg
                    class="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Wrestling Section -->
        <div class="mt-16">
          <h3 class="text-2xl font-bold text-accent mb-6 flex items-center">
            <span class="bg-accent/10 text-accent px-4 py-2 rounded-lg">Wrestling Coverage</span>
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="feature in wrestlingFeatures"
              :key="feature.title"
              class="card group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-accent"
            >
              <div class="space-y-4">
                <h3
                  class="text-xl font-semibold text-gray-900 group-hover:text-accent transition-colors"
                >
                  {{ feature.title }}
                </h3>
                <p class="text-gray-600">
                  {{ feature.description }}
                </p>
                <router-link
                  :to="feature.link"
                  class="inline-flex items-center text-accent font-medium group-hover:text-accent/80 transition-colors"
                >
                  Explore
                  <svg
                    class="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeroSlideshow from '@/components/HeroSlideshow.vue'

const nbaFeatures = [
  {
    title: 'Player Stats',
    description: 'Interactive graphs and detailed statistics for every NBA player',
    link: '/nba/stats',
  },
  {
    title: 'Trade Simulator',
    description: 'Create and analyze potential NBA trades with our advanced simulator',
    link: '/nba/trade-simulator',
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
]

const wrestlingFeatures = [
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
]
</script>
