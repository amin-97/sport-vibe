<template>
  <div class="col-span-1">
    <h4 class="text-white text-md font-semibold mb-4">Connect</h4>
    <div class="flex space-x-4">
      <SocialLink v-for="social in socials" :key="social.name" v-bind="social" />
    </div>
  </div>
</template>

<script setup>
import { defineComponent, h } from 'vue'
import SocialLink from './SocialLink.vue'

const socials = [
  {
    name: 'Twitter',
    href: '#',
    icon: 'twitter',
  },
  {
    name: 'GitHub',
    href: '#',
    icon: 'github',
  },
]
</script>
