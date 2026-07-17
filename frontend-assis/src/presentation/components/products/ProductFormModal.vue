<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Product, ProductFormData } from '../../../core/domain/entities/Product'

const props = defineProps<{
  visible: boolean
  product: Product | null
  submitting: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [data: ProductFormData]
}>()

const formRef = ref()
const formData = ref<ProductFormData>({
  nombreProducto: '',
  descripcionProducto: null,
  precioProducto: 0,
  stockProducto: 0,
})

const rules: Record<string, any[]> = {
  nombreProducto: [
    { required: true, message: 'El nombre es obligatorio' },
    { max: 100, message: 'Máximo 100 caracteres' },
  ],
  precioProducto: [
    { required: true, message: 'El precio es obligatorio' },
    { type: 'number', min: 0.01, message: 'El precio debe ser mayor a 0' },
  ],
  stockProducto: [
    { required: true, message: 'El stock es obligatorio' },
    { type: 'number', min: 0, message: 'El stock debe ser mayor o igual a 0' },
  ],
}

const isEditing = ref(false)

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      isEditing.value = !!props.product
      if (props.product) {
        formData.value = {
          nombreProducto: props.product.nombreProducto,
          descripcionProducto: props.product.descripcionProducto,
          precioProducto: props.product.precioProducto,
          stockProducto: props.product.stockProducto,
        }
      } else {
        formData.value = {
          nombreProducto: '',
          descripcionProducto: null,
          precioProducto: 0,
          stockProducto: 0,
        }
      }
    }
  },
)

async function handleOk() {
  try {
    await formRef.value.validate()
    emit('save', formData.value)
  } catch {
    // validation failed
  }
}

function handleCancel() {
  emit('close')
}
</script>

<template>
  <a-modal
    :open="visible"
    :title="isEditing ? 'Editar Producto' : 'Nuevo Producto'"
    :confirm-loading="submitting"
    ok-text="Guardar"
    cancel-text="Cancelar"
    @ok="handleOk"
    @cancel="handleCancel"
    :destroy-on-close="true"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      layout="vertical"
    >
      <a-form-item label="Nombre" name="nombreProducto">
        <a-input
          v-model:value="formData.nombreProducto"
          placeholder="Nombre del producto"
          :maxlength="100"
        />
      </a-form-item>

      <a-form-item label="Descripción" name="descripcionProducto">
        <a-textarea
          v-model:value="formData.descripcionProducto"
          placeholder="Descripción (opcional)"
          :rows="3"
        />
      </a-form-item>

      <a-form-item label="Precio" name="precioProducto">
        <a-input-number
          v-model:value="formData.precioProducto"
          :min="0.01"
          :precision="2"
          :step="0.5"
          style="width: 100%"
          placeholder="0.00"
        />
      </a-form-item>

      <a-form-item label="Stock" name="stockProducto">
        <a-input-number
          v-model:value="formData.stockProducto"
          :min="0"
          :precision="0"
          style="width: 100%"
          placeholder="0"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
