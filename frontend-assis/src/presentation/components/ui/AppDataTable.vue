<script setup lang="ts">
import { computed } from 'vue'
import type { ColumnDef } from '../../config/productColumns'

const props = withDefaults(defineProps<{
  columns: ColumnDef[]
  dataSource: Record<string, unknown>[]
  loading: boolean
  rowKey?: string
  pagination?: Record<string, unknown>
  searchValue?: string
}>(), {
  rowKey: 'id',
})

const emit = defineEmits<{
  change: [pagination: unknown, filters: unknown, sorter: unknown]
  search: [value: string]
}>()

function defaultShowTotal(total: number): string {
  return `Total ${total} registros`
}

const paginationConfig = computed(() => ({
  showTotal: defaultShowTotal,
  ...(props.pagination || {}),
}))

function handleTableChange(pagination: unknown, filters: unknown, sorter: unknown) {
  emit('change', pagination, filters, sorter)
}

function handleSearch(value: string) {
  emit('search', value)
}
</script>

<template>
  <div class="app-table">
    <div class="app-table__header">
      <a-input-search
        v-if="searchValue !== undefined"
        v-model:value="searchValue"
        placeholder="Buscar..."
        @search="handleSearch"
        class="app-table__search"
        allow-clear
      />
      <slot name="header-actions" />
    </div>
    <a-table
      :data-source="dataSource"
      :columns="columns"
      :loading="loading"
      :pagination="paginationConfig"
      :row-key="rowKey"
      @change="handleTableChange"
    >
      <template v-for="(_, slot) in ($slots as Record<string, any>)" :key="slot" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </a-table>
  </div>
</template>

<style scoped src="./AppDataTable.css"></style>
