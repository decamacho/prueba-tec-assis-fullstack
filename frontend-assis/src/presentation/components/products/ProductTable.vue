<script setup lang="ts">
import { useProductTable } from '../../composables/useProductTable'
import { productColumns } from '../../config/productColumns'
import type { Product } from '../../../core/domain/entities/Product'
import { Modal } from 'ant-design-vue'
import { EditOutlined, HistoryOutlined, DeleteOutlined } from '@ant-design/icons-vue'

const { store, searchText, handleSearch, handleTableChange, handleStatusToggle } = useProductTable()

const emit = defineEmits<{
  edit: [product: Product]
  showHistory: [product: Product]
  create: []
}>()

function confirmDelete(record: Product) {
  Modal.confirm({
    title: 'Eliminar producto',
    content: `¿Estás seguro de eliminar "${record.nombreProducto}"? Esta acción no se puede deshacer.`,
    okText: 'Eliminar',
    okType: 'danger',
    cancelText: 'Cancelar',
    onOk: () => store.removeProduct(record.id),
  })
}
</script>

<template>
  <div class="product-table">
    <div class="product-table__header">
      <a-input-search
        v-model:value="searchText"
        placeholder="Buscar por nombre..."
        @input="handleSearch"
        class="product-table__search"
        allow-clear
      />
      <a-button type="primary" @click="emit('create')">
        + Nuevo Producto
      </a-button>
    </div>

    <div class="product-table__wrapper">
      <a-table
        :data-source="store.filteredProducts as any"
        :columns="productColumns"
        :loading="store.isLoading"
        :pagination="{
          current: store.page,
          pageSize: store.limit,
          total: store.filteredProducts.length,
          showSizeChanger: false,
          showTotal: (total: number) => `Total ${total} productos`,
        }"
        @change="handleTableChange"
        row-key="id"
        :scroll="{ x: 700 }"
      >
        <template #bodyCell="{ column, record }: { column: any; record: Product }">
          <template v-if="column.key === 'estadoProducto'">
            <a-tooltip
              :title="record.estadoProducto ? 'Desactivar producto' : 'Activar producto'"
            >
              <a-switch
                :checked="record.estadoProducto"
                :loading="store.isSwitching(record.id)"
                @change="(checked: boolean) => handleStatusToggle(record.id, checked)"
              />
            </a-tooltip>
            <span :class="['product-table__status', record.estadoProducto ? 'product-table__status--active' : 'product-table__status--inactive']">
              {{ record.estadoProducto ? 'Activo' : 'Inactivo' }}
            </span>
          </template>
          <template v-if="column.key === 'precioProducto'">
            ${{ Number(record.precioProducto).toFixed(2) }}
          </template>
          <template v-if="column.key === 'acciones'">
            <a-space>
              <a-tooltip title="Editar producto">
                <a-button type="primary" shape="round" size="small" @click="emit('edit', record)">
                  <template #icon><EditOutlined /></template>
                  Editar
                </a-button>
              </a-tooltip>
              <a-tooltip title="Ver historial">
                <a-button shape="round" size="small" class="btn-history" @click="emit('showHistory', record)">
                  <template #icon><HistoryOutlined /></template>
                  Historial
                </a-button>
              </a-tooltip>
              <a-tooltip title="Eliminar producto">
                <a-button danger shape="round" size="small" @click="confirmDelete(record)">
                  <template #icon><DeleteOutlined /></template>
                  Eliminar
                </a-button>
              </a-tooltip>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style scoped src="./ProductTable.css"></style>
