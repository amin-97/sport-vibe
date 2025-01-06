<template>
  <BaseEditorialForm
    type="wrestling"
    title="Create Wrestling Editorial"
    api-endpoint="/api/wrestling-editorials"
  >
    <template #additional-fields>
      <!-- Any wrestling-specific fields can go here -->
    </template>
  </BaseEditorialForm>
</template>

<script setup>
import BaseEditorialForm from '@/components/editorial/BaseEditorialForm.vue'
</script>
