import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { watch } from 'vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  // NBA Routes
  {
    path: '/nba-stats',
    name: 'nbaStats',
    component: () => import('@/views/nba/NBAStats.vue'),
  },
  {
    path: '/nba-stats/:playerName',
    name: 'PlayerStats',
    component: () => import('@/views/nba/PlayerStats.vue'),
  },
  {
    path: '/nba/trade-simulator',
    name: 'tradeSimulator',
    component: () => import('@/views/nba/TradeSimulator.vue'),
  },
  {
    path: '/nba/teams',
    name: 'teams',
    component: () => import('@/views/nba/TeamsView.vue'),
  },
  {
    path: '/nba/news',
    name: 'nbaNews',
    component: () => import('@/views/nba/NBANews.vue'),
  },
  {
    path: '/nba/editorials',
    name: 'nbaEditorials',
    component: () => import('@/views/nba/NBAEditorials.vue'),
  },
  {
    path: '/nba/news/:slug',
    name: 'nbaNewsDetail',
    component: () => import('@/views/nba/NBANewsDetail.vue'),
  },
  {
    path: '/nba/editorials/:slug',
    name: 'nbaEditorialDetail',
    component: () => import('@/views/nba/NBAEditorialDetail.vue'),
  },
  // Wrestling Routes
  {
    path: '/wrestling/news',
    name: 'wrestlingNews',
    component: () => import('@/views/wrestling/WrestlingNews.vue'),
  },
  {
    path: '/wrestling/news/:slug',
    name: 'wrestlingNewsDetail',
    component: () => import('@/views/wrestling/WrestlingNewsDetail.vue'),
  },
  {
    path: '/wrestling/results',
    name: 'wrestlingResults',
    component: () => import('@/views/wrestling/WrestlingResults.vue'),
  },
  {
    path: '/wrestling/results/:slug',
    name: 'wrestlingResultDetail',
    component: () => import('@/views/wrestling/WrestlingResultDetail.vue'),
  },
  {
    path: '/wrestling/editorials',
    name: 'wrestlingEditorials',
    component: () => import('@/views/wrestling/WrestlingEditorials.vue'),
  },
  {
    path: '/wrestling/editorials/:slug',
    name: 'wrestlingEditorialDetail',
    component: () => import('@/views/wrestling/WrestlingEditorialDetail.vue'),
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
    component: () => import('@/views/admin/AdminDashboard.vue'),
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/write/results',
    name: 'createWrestlingResult',
    component: () => import('@/views/admin/CreateWrestlingResults.vue'),
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/edit/wrestling/results/:slug',
    name: 'editWrestlingResult',
    component: () => import('@/views/edits/EditWrestlingResult.vue'),
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/write/news',
    name: 'writeNews',
    component: () => import('@/views/admin/CreateWrestlingNews.vue'),
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/write/editorial',
    name: 'writeEditorial',
    component: () => import('@/views/admin/CreateWrestlingEditorial.vue'),
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/write/nba/editorial',
    name: 'createNBAEditorial',
    component: () => import('@/views/nba/CreateNBAEditorial.vue'),
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/edit/nba/editorial/:slug',
    name: 'editNBAEditorial',
    component: () => import('@/views/edits/EditNBAEditorial.vue'),
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/write/nba/news',
    name: 'createNBANews',
    component: () => import('@/views/nba/CreateNBANews.vue'),
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/edit/nba/news/:slug',
    name: 'editNBANews',
    component: () => import('@/views/edits/EditNBANews.vue'),
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/edit/wrestling/news/:slug',
    name: 'editWrestlingNews',
    component: () => import('@/views/edits/EditWrestlingNews.vue'),
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/edit/wrestling/editorial/:slug',
    name: 'editWrestlingEditorial',
    component: () => import('@/views/edits/EditWrestlingEditorial.vue'),
    meta: { requiresAdmin: true },
  },
  // 404 Route
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

// Navigation guard for admin routes
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Wait for auth to initialize if it's loading
  if (authStore.loading) {
    await new Promise((resolve) => {
      const unwatch = watch(
        () => authStore.loading,
        (loading) => {
          if (!loading) {
            unwatch()
            resolve()
          }
        },
      )
    })
  }

  // Check admin access
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    // Redirect to home if trying to access admin route without admin privileges
    next({ name: 'home' })
  } else {
    // Allow navigation
    next()
  }
})

export default router
