<script setup lang="ts">
const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <nav class="layout__navbar">
    <button class="layout__navbar-toggle" @click="emit('toggle')">
      <span class="layout__navbar-hamburger"></span>
      <span class="layout__navbar-hamburger"></span>
      <span class="layout__navbar-hamburger"></span>
    </button>
    <div class="layout__navbar-brand">
      <span class="layout__navbar-logo">AP</span>
      <span class="layout__navbar-title">AssisPrex</span>
    </div>
    <div class="layout__navbar-spacer" />
    <div class="layout__navbar-info">
      <span class="layout__navbar-user">Admin</span>
    </div>
  </nav>
</template>

<style scoped src="./AppNavbar.css"></style>
