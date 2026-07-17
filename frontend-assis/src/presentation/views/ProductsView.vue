<script setup lang="ts">
import { ref } from 'vue'
import { useProductStore } from '../stores/productStore'
import ProductTable from '../components/products/ProductTable.vue'
import ProductFormModal from '../components/products/ProductFormModal.vue'
import ProductHistoryModal from '../components/products/ProductHistoryModal.vue'
import type { Product, ProductFormData } from '../../core/domain/entities/Product'

const store = useProductStore()

const showFormModal = ref(false)
const selectedProduct = ref<Product | null>(null)
const showHistoryModal = ref(false)
const historyProductId = ref<string | null>(null)

function openCreate() {
  selectedProduct.value = null
  showFormModal.value = true
}

function openEdit(product: Product) {
  selectedProduct.value = product
  showFormModal.value = true
}

function closeForm() {
  showFormModal.value = false
  selectedProduct.value = null
}

async function handleSave(data: ProductFormData) {
  let success: boolean
  if (selectedProduct.value) {
    success = await store.updateProduct(selectedProduct.value.id, data)
  } else {
    success = await store.createProduct(data)
  }
  if (success) {
    closeForm()
  }
}

function openHistory(product: Product) {
  historyProductId.value = product.id
  showHistoryModal.value = true
}

function closeHistory() {
  showHistoryModal.value = false
  historyProductId.value = null
}
</script>

<template>
  <div>
    <h1 class="layout__content-title">Productos</h1>
    <ProductTable
      @edit="openEdit"
      @create="openCreate"
      @show-history="openHistory"
    />
    <ProductFormModal
      :visible="showFormModal"
      :product="selectedProduct"
      :submitting="store.isSubmitting"
      @close="closeForm"
      @save="handleSave"
    />
    <ProductHistoryModal
      :visible="showHistoryModal"
      :product-id="historyProductId"
      @close="closeHistory"
    />
  </div>
</template>
