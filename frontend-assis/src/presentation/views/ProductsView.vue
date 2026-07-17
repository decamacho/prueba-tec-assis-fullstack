<script setup lang="ts">
import { ref } from 'vue'
import { useProductStore } from '../stores/productStore'
import ProductTable from '../components/products/ProductTable.vue'
import ProductFormModal from '../components/products/ProductFormModal.vue'
import ProductHistoryModal from '../components/products/ProductHistoryModal.vue'
import type { Product, ProductFormData } from '../../core/domain/entities/Product'

const store = useProductStore()
const showForm = ref(false)
const selectedProduct = ref<Product | null>(null)
const showHistory = ref(false)
const historyProductId = ref<string | null>(null)

function openCreate() {
  selectedProduct.value = null
  showForm.value = true
}

function openEdit(product: Product) {
  selectedProduct.value = product
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  selectedProduct.value = null
}

async function handleSave(data: ProductFormData) {
  const success = selectedProduct.value
    ? await store.updateProduct(selectedProduct.value.id, data)
    : await store.createProduct(data)
  if (success) closeForm()
}

function openHistory(product: Product) {
  historyProductId.value = product.id
  showHistory.value = true
}

function closeHistory() {
  showHistory.value = false
  historyProductId.value = null
}
</script>

<template>
  <div>
    <h1 class="layout__content-title">Productos</h1>
    <ProductTable @edit="openEdit" @show-history="openHistory" @create="openCreate" />
    <ProductFormModal
      :visible="showForm"
      :product="selectedProduct"
      :submitting="store.isSubmitting"
      @close="closeForm"
      @save="handleSave"
    />
    <ProductHistoryModal
      :visible="showHistory"
      :product-id="historyProductId"
      @close="closeHistory"
    />
  </div>
</template>

<style scoped src="./ProductsView.css"></style>
