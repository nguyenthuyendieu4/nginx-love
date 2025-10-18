<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import LandingPage from './components/LandingPage.vue'

const { frontmatter } = useData()

const isLanding = () => frontmatter.value.layout === 'landing'
</script>

<template>
  <DefaultTheme.Layout>
    <template #layout-top v-if="isLanding()">
      <LandingPage />
    </template>
  </DefaultTheme.Layout>
</template>

<style scoped>
/* Ensure landing page is full width */
:deep(.VPContent) {
  max-width: 100% !important;
  padding: 0 !important;
}
</style>
