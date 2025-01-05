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
import { useAuthStore } from '@/stores/auth'
import CreateEditorial from '@/views/admin/CreateWrestlingEditorial.vue'
import CreateWrestlingResults from '@/views/admin/CreateWrestlingResults.vue'
import CreateNews from '@/views/admin/CreateWrestlingNews.vue'
import WrestlingResultDetail from '@/views/wrestling/WrestlingResultDetail.vue'
import CreateNBAEditorial from '@/views/nba/CreateNBAEditorial.vue'
import CreateNBANews from '@/views/nba/CreateNBANews.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import NBANewsDetail from '@/views/nba/NBANewsDetail.vue'
import NBAEditorialDetail from '@/views/nba/NBAEditorialDetail.vue'
import WrestlingNewsDetail from '@/views/wrestling/WrestlingNewsDetail.vue'
import WrestlingEditorialDetail from '@/views/wrestling/WrestlingEditorialDetail.vue'
import EditWrestlingResult from '@/views/edits/EditWrestlingResult.vue'
import EditNBANews from '@/views/edits/EditNBANews.vue'
import EditNBAEditorial from '@/views/edits/EditNBAEditorial.vue'
import EditWrestlingNews from '@/views/edits/EditWrestlingNews.vue'
import EditWrestlingEditorial from '@/views/edits/EditWrestlingEditorial.vue'
import PlayerStats from '@/views/nba/PlayerStats.vue'

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
      path: '/nba-stats',
      name: 'nbaStats',
      component: NBAStats,
    },
    {
      path: '/nba-stats/:playerName',
      name: 'PlayerStats',
      component: PlayerStats,
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
    // src/router/index.js
    {
      path: '/nba/news/:slug',
      name: 'nbaNewsDetail',
      component: NBANewsDetail,
    },
    {
      path: '/nba/editorials/:slug',
      name: 'nbaEditorialDetail',
      component: NBAEditorialDetail,
    },
    // Wrestling Routes
    {
      path: '/wrestling/news',
      name: 'wrestlingNews',
      component: WrestlingNews,
    },
    {
      path: '/wrestling/news/:slug',
      name: 'wrestlingNewsDetail',
      component: WrestlingNewsDetail,
    },
    {
      path: '/wrestling/results',
      name: 'wrestlingResults',
      component: WrestlingResults,
    },
    {
      path: '/wrestling/results/:slug',
      name: 'wrestlingResultDetail',
      component: WrestlingResultDetail,
    },
    {
      path: '/wrestling/editorials',
      name: 'wrestlingEditorials',
      component: WrestlingEditorials,
    },
    {
      path: '/wrestling/editorials/:slug',
      name: 'wrestlingEditorialDetail',
      component: WrestlingEditorialDetail,
    },
    // Admin Routes
    {
      path: '/admin/drafts',
      name: 'savedDrafts',
      component: () => import('@/views/admin/SavedDrafts.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/dashboard',
      name: 'adminDashboard',
      component: AdminDashboard,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/write/results',
      name: 'createWrestlingResult',
      component: CreateWrestlingResults,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/edit/wrestling/results/:slug',
      name: 'editWrestlingResult',
      component: EditWrestlingResult,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/write/news',
      name: 'writeNews',
      component: CreateNews,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/write/editorial',
      name: 'writeEditorial',
      component: CreateEditorial,
      meta: { requiresAdmin: true },
    },
    // src/router/index.js
    {
      path: '/admin/write/nba/editorial',
      name: 'createNBAEditorial',
      component: CreateNBAEditorial,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/edit/nba/editorial/:slug',
      name: 'editNBAEditorial',
      component: EditNBAEditorial,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/write/nba/news',
      name: 'createNBANews',
      component: CreateNBANews,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/edit/nba/news/:slug',
      name: 'editNBANews',
      component: EditNBANews,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/edit/wrestling/news/:slug',
      name: 'editWrestlingNews',
      component: EditWrestlingNews,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/edit/wrestling/editorial/:slug',
      name: 'editWrestlingEditorial',
      component: EditWrestlingEditorial,
      meta: { requiresAdmin: true },
    },
    // 404 Route
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFound,
    },
  ],
})

// Navigation guard for admin routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'home' }) // Redirect non-admin users to home
  } else {
    next()
  }
})

export default router
