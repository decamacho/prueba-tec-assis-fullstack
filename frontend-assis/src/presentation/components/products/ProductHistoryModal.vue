<script setup lang="ts">
import { watch } from 'vue'
import { useProductStore } from '../../stores/productStore'
import { ClockCircleOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  visible: boolean
  productId: string | null
}>()

const emit = defineEmits<{ close: [] }>()

const store = useProductStore()

watch(
  () => props.visible,
  (visible) => {
    if (visible && props.productId) {
      store.fetchHistory(props.productId)
    }
  },
)

function actionColor(action: string) {
  switch (action) {
    case 'CREATE': return 'green'
    case 'UPDATE': return 'blue'
    case 'DELETE': return 'red'
    case 'STATUS_CHANGE': return 'orange'
    default: return 'gray'
  }
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
        <template #dot>
          <ClockCircleOutlined />
        </template>
        <template #default>
          <strong>{{ item.action }}</strong>
          <p>{{ item.description }}</p>
          <small>{{ new Date(item.createdAt).toLocaleString('es-CO') }}</small>
        </template>
      </a-timeline-item>
    </a-timeline>

    <a-empty v-else-if="!store.isHistoryLoading && store.history.length === 0" description="Sin historial" />

    <div v-if="store.isHistoryLoading" style="text-align: center; padding: 24px">
      <a-spin />
    </div>
  </a-modal>
</template>
