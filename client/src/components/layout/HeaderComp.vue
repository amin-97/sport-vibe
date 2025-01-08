// components/layout/HeaderComp.vue
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { signOut } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useRouter } from 'vue-router'
import { debounce } from '@/utils/performance'
import NavDropdown from './NavDropdown.vue'
import MobileMenu from './MobileMenu.vue'
import AuthSection from './AuthSection.vue'

const router = useRouter()
const authStore = useAuthStore()
const isDesktop = ref(window.innerWidth >= 768)
const isMobileMenuOpen = ref(false)
const activeDropdown = ref(null)
const activeSection = ref(null)

// Menu Items
const writeMenuItems = [
  { text: 'Write Wrestling Results', to: '/admin/write/results' },
  { text: 'Write Wrestling News', to: '/admin/write/news' },
  { text: 'Write Wrestling Editorial', to: '/admin/write/editorial' },
  { text: 'Write NBA Editorial', to: '/admin/write/nba/editorial' },
  { text: 'Write NBA News', to: '/admin/write/nba/news' },
]

const adminMenuItems = [{ text: 'Dashboard', to: '/admin/dashboard' }]

const nbaMenuItems = [
  { text: 'News', to: '/nba/news' },
  { text: 'Editorials', to: '/nba/editorials' },
  { text: 'Player Stats', to: '/nba-stats' },
  { text: 'Team Rosters', to: '/nba/teams' },
]

const wrestlingMenuItems = [
  { text: 'News', to: '/wrestling/news' },
  { text: 'Results', to: '/wrestling/results' },
  { text: 'Editorials', to: '/wrestling/editorials' },
]

const allMenuItems = computed(() => ({
  write: writeMenuItems,
  admin: adminMenuItems,
  nba: nbaMenuItems,
  wrestling: wrestlingMenuItems,
}))

const handleDropdownShow = debounce((dropdownName) => {
  activeDropdown.value = dropdownName
}, 100)

const handleDropdownHide = debounce(() => {
  activeDropdown.value = null
}, 150)

const handleSectionToggle = (sectionName) => {
  activeSection.value = activeSection.value === sectionName ? null : sectionName
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  activeSection.value = null
}

const handleSignOut = async () => {
  try {
    authStore.signOutLoading = true
    await signOut(auth)
    await authStore.signOut()
    activeDropdown.value = null
    closeMobileMenu()

    // Wait for animation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    router.push('/')
  } catch (error) {
    console.error('Error signing out:', error)
  } finally {
    authStore.signOutLoading = false
  }
}

const handleResize = debounce(() => {
  isDesktop.value = window.innerWidth >= 768
  if (isDesktop.value) {
    closeMobileMenu()
  }
}, 250)

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <header class="bg-primary shadow-lg relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="text-2xl font-bold text-white">SportVibe</router-link>
        </div>

        <!-- Mobile Menu Button -->
        <button
          v-show="!isDesktop"
          @click="toggleMobileMenu"
          class="p-2 text-gray-300 hover:text-white focus:outline-none"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              v-if="!isMobileMenuOpen"
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

        <!-- Desktop Navigation -->
        <nav v-show="isDesktop" class="flex space-x-8">
          <!-- Admin Navigation -->
          <template v-if="authStore.isAdmin">
            <NavDropdown
              text="Write"
              :items="writeMenuItems"
              @show="handleDropdownShow('write')"
              @hide="handleDropdownHide"
              :is-active="activeDropdown === 'write'"
            />
            <NavDropdown
              text="Admin"
              :items="adminMenuItems"
              @show="handleDropdownShow('admin')"
              @hide="handleDropdownHide"
              :is-active="activeDropdown === 'admin'"
            />
          </template>

          <!-- Main Navigation -->
          <NavDropdown
            text="NBA"
            :items="nbaMenuItems"
            @show="handleDropdownShow('nba')"
            @hide="handleDropdownHide"
            :is-active="activeDropdown === 'nba'"
          />
          <NavDropdown
            text="Wrestling"
            :items="wrestlingMenuItems"
            @show="handleDropdownShow('wrestling')"
            @hide="handleDropdownHide"
            :is-active="activeDropdown === 'wrestling'"
          />
        </nav>

        <!-- Auth Section -->
        <AuthSection :is-desktop="isDesktop" @sign-out="handleSignOut" />
      </div>
    </div>

    <!-- Mobile Menu -->
    <MobileMenu
      v-if="!isDesktop"
      v-show="isMobileMenuOpen"
      :menu-items="allMenuItems"
      :active-section="activeSection"
      @section-toggle="handleSectionToggle"
      @close="closeMobileMenu"
    />
  </header>
</template>
