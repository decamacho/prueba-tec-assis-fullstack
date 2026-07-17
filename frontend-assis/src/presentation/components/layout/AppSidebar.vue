<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const router = useRouter()
const route = useRoute()

function navigate(path: string) {
  router.push(path)
  emit('close')
}
</script>

<template>
  <aside :class="['layout__sidebar', { 'layout__sidebar--open': open }]">
    <div class="layout__sidebar-logo">AssisPrex</div>
    <div class="layout__sidebar-menu">
      <a-menu
        theme="dark"
        mode="inline"
        :selected-keys="[route.path]"
        :style="{ background: 'transparent', borderInlineEnd: 'none' }"
      >
        <a-menu-item key="/products" @click="navigate('/products')">
          Productos
        </a-menu-item>
      </a-menu>
    </div>
  </aside>
</template>

<style scoped src="./AppSidebar.css"></style>
