<script setup lang="ts">
import { watch } from 'vue'
import { useProductStore } from '../../stores/productStore'

const props = defineProps<{
  visible: boolean
  productId: string | null
}>()

const emit = defineEmits<{ close: [] }>()

const store = useProductStore()

watch(
  () => props.visible,
  (visible) => {
    if (visible && props.productId) store.fetchHistory(props.productId)
  },
)

function actionColor(action: string): string {
  const colors: Record<string, string> = {
    CREATE: 'green',
    UPDATE: 'blue',
    DELETE: 'red',
    STATUS_CHANGE: 'orange',
  }
  return colors[action] || 'gray'
}
</script>

<template>
  <a-modal
    :open="visible"
    title="Historial de Cambios"
    :footer="null"
    @cancel="emit('close')"
    :destroy-on-close="true"
  >
    <a-timeline v-if="!store.isHistoryLoading && store.history.length > 0">
      <a-timeline-item
        v-for="item in store.history"
        :key="item.id"
        :color="actionColor(item.action)"
      >
        <strong>{{ item.action }}</strong>
        <p>{{ item.description }}</p>
        <small>{{ new Date(item.createdAt).toLocaleString('es-CO') }}</small>
      </a-timeline-item>
    </a-timeline>
    <a-empty v-else-if="!store.isHistoryLoading" description="Sin historial" />
    <div v-if="store.isHistoryLoading" class="history-modal__loading">
      <a-spin />
    </div>
  </a-modal>
</template>

<style scoped src="./ProductHistoryModal.css"></style>
