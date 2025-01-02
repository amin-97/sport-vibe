// src/App.vue
<template>
  <div class="min-h-screen bg-gray-50">
    <nav>
      <HeaderComp />
    </nav>

    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <FooterComp />
  </div>
</template>

<script setup>
import HeaderComp from './components/layout/HeaderComp.vue'
import FooterComp from './components/layout/FooterComp.vue'
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Base styles */
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>
