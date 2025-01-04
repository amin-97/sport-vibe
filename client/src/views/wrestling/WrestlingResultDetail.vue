<!-- // src/views/wrestling/WrestlingResultDetail.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <img
        src="./public/placeholder-image.jpg"
        alt="Event Cover"
        class="w-full h-64 object-cover"
      />

      <div class="p-6">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">AEW Dynamite</h1>
          <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
            AEW
          </span>
        </div>

        <div class="mt-4 text-gray-600">
          <p>January 24, 2024</p>
          <p>Climate Pledge Arena, Seattle</p>
        </div>

        <div class="mt-8 space-y-8">
          <div
            v-for="(match, index) in dummyMatches"
            :key="index"
            class="bg-gray-50 rounded-lg p-6 animate-slideUp"
            :style="{ animationDelay: `${index * 150}ms` }"
          >
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-semibold">{{ match.type }}</h3>
              <span class="text-gray-600">{{ match.duration }}</span>
            </div>

            <div class="space-y-4">
              <p class="text-lg">{{ match.wrestlers }}</p>
              <p class="font-medium text-primary">Winner: {{ match.winner }}</p>
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Highlights</h4>
                <p class="text-gray-700 whitespace-pre-line">{{ match.highlights }}</p>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Analysis</h4>
                <p class="text-gray-700">{{ match.thoughts }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const dummyMatches = [
  {
    type: 'Singles Match',
    wrestlers: 'Kenny Omega vs Bryan Danielson',
    winner: 'Kenny Omega',
    duration: '25:30',
    highlights:
      "- Opening sequence featured intense technical wrestling\n- Multiple V-Trigger attempts\n- Near fall after Danielson's running knee\n- Omega hits the One-Winged Angel for the win",
    thoughts:
      'Outstanding match that lived up to expectations. Both wrestlers showed their technical prowess and storytelling ability.',
  },
  {
    type: 'Tag Team Match',
    wrestlers: 'Young Bucks vs FTR',
    winner: 'FTR',
    duration: '18:45',
    highlights:
      '- Fast-paced opening with quick tags\n- Double team moves from both teams\n- Near falls after superkick party\n- Big Rig finisher for the win',
    thoughts:
      "Classic tag team wrestling with modern elements. Both teams showed why they're considered among the best.",
  },
]
</script>

<style scoped>
.animate-slideUp {
  animation: slideUp 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
