<script setup lang="ts">
import { MenuOutlined } from '@ant-design/icons-vue'

const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <nav class="layout__navbar">
    <button class="layout__navbar-toggle" @click="emit('toggle')">
      <MenuOutlined />
    </button>
    <span class="layout__navbar-brand">AssisPrex</span>
  </nav>
</template>
