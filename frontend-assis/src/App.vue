<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from './presentation/components/layout/AppSidebar.vue'
import AppNavbar from './presentation/components/layout/AppNavbar.vue'

const sidebarOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  sidebarOpen.value = false
}
</script>

<template>
  <div class="layout">
    <AppSidebar :open="sidebarOpen" @close="closeSidebar" />
    <div v-if="sidebarOpen" class="layout__sidebar-overlay" @click="closeSidebar" />
    <div class="layout__main">
      <AppNavbar @toggle="toggleSidebar" />
      <main class="layout__content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
</style>
