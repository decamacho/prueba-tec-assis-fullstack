<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProductStore } from '../../stores/productStore'
import type { Product } from '../../../core/domain/entities/Product'

const store = useProductStore()

const searchText = ref('')
const sortBy = ref<string>('fechaCreacion')
const sortOrder = ref<'ASC' | 'DESC'>('DESC')

const emit = defineEmits<{
  edit: [product: Product]
  showHistory: [product: Product]
  create: []
}>()

onMounted(() => {
  store.fetchProducts()
})

function handleSearch() {
  store.setSearch(searchText.value)
}

function handleStatusChange(record: Product, checked: boolean) {
  store.changeProductStatus(record.id, checked)
}

function handleTableChange(pagination: any, _filters: any, sorter: any) {
  if (pagination.current) {
    store.setPage(pagination.current)
  }
  if (sorter.field) {
    const order = sorter.order === 'ascend' ? 'ASC' : 'DESC'
    sortBy.value = sorter.field
    sortOrder.value = order
    store.setSort(sorter.field, order)
  }
}

function confirmDelete(record: Product) {
  const { Modal } = window as any
  if (Modal) {
    Modal.confirm({
      title: 'Eliminar producto',
      content: `¿Estás seguro de eliminar "${record.nombreProducto}"?`,
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => store.removeProduct(record.id),
    })
  }
}

const columns = [
  { title: 'Nombre', dataIndex: 'nombreProducto', key: 'nombreProducto', sorter: true },
  {
    title: 'Precio',
    dataIndex: 'precioProducto',
    key: 'precioProducto',
    sorter: true,
    customRender: ({ value }: { value: number }) =>
      `$${Number(value).toFixed(2)}`,
  },
  { title: 'Stock', dataIndex: 'stockProducto', key: 'stockProducto', sorter: true },
  {
    title: 'Estado',
    dataIndex: 'estadoProducto',
    key: 'estadoProducto',
    customRender: ({ value }: { value: boolean }) =>
      value ? 'Activo' : 'Inactivo',
  },
  {
    title: 'Acciones',
    key: 'acciones',
    width: 280,
  },
]
</script>

<template>
  <div class="product-table">
    <div class="product-table__header">
      <a-input-search
        v-model:value="searchText"
        placeholder="Buscar por nombre..."
        @search="handleSearch"
        class="product-table__search"
        allow-clear
      />
      <a-button type="primary" @click="emit('create')">
        + Nuevo Producto
      </a-button>
    </div>

    <a-table
      :dataSource="store.products"
      :columns="columns"
      :loading="store.isLoading"
      :pagination="{
        current: store.page,
        pageSize: store.limit,
        total: store.total,
        showSizeChanger: false,
        showTotal: (total: number) => `Total ${total} productos`,
      }"
      @change="handleTableChange"
      rowKey="id"
    >
      <template #bodyCell="{ column, record }: { column: any; record: Product }">
        <template v-if="column.key === 'estadoProducto'">
          <a-switch
            :checked="record.estadoProducto"
            @change="(checked: boolean) => handleStatusChange(record, checked)"
          />
        </template>
        <template v-if="column.key === 'acciones'">
          <a-space>
            <a-button size="small" @click="emit('edit', record)">
              Editar
            </a-button>
            <a-button size="small" @click="emit('showHistory', record)">
              Historial
            </a-button>
            <a-popconfirm
              title="¿Eliminar este producto?"
              ok-text="Eliminar"
              cancel-text="Cancelar"
              @confirm="store.removeProduct(record.id)"
            >
              <a-button size="small" danger>
                Eliminar
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
.product-table {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
}

.product-table__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: wrap;
}

.product-table__search {
  max-width: 320px;
}

@media (max-width: 767px) {
  .product-table__header {
    flex-direction: column;
    align-items: stretch;
  }

  .product-table__search {
    max-width: 100%;
  }
}
</style>
