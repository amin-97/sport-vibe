// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NBAStats from '@/views/nba/NBAStats.vue'
import TradeSimulator from '@/views/nba/TradeSimulator.vue'
import TeamsView from '@/views/nba/TeamsView.vue'
import NBANews from '@/views/nba/NBANews.vue'
import NBAEditorials from '@/views/nba/NBAEditorials.vue'
import WrestlingNews from '@/views/wrestling/WrestlingNews.vue'
import WrestlingResults from '@/views/wrestling/WrestlingResults.vue'
import WrestlingEditorials from '@/views/wrestling/WrestlingEditorials.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // NBA Routes
    {
      path: '/nba/stats',
      name: 'nbaStats',
      component: NBAStats,
    },
    {
      path: '/nba/trade-simulator',
      name: 'tradeSimulator',
      component: TradeSimulator,
    },
    {
      path: '/nba/teams',
      name: 'teams',
      component: TeamsView,
    },
    {
      path: '/nba/news',
      name: 'nbaNews',
      component: NBANews,
    },
    {
      path: '/nba/editorials',
      name: 'nbaEditorials',
      component: NBAEditorials,
    },
    // Wrestling Routes
    {
      path: '/wrestling/news',
      name: 'wrestlingNews',
      component: WrestlingNews,
    },
    {
      path: '/wrestling/results',
      name: 'wrestlingResults',
      component: WrestlingResults,
    },
    {
      path: '/wrestling/editorials',
      name: 'wrestlingEditorials',
      component: WrestlingEditorials,
    },
    // 404 Route
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFound,
    },
  ],
})

export default router
