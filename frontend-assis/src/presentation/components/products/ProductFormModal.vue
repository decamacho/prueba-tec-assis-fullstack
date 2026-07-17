<script setup lang="ts">
import { watch } from 'vue'
import { productFormFields } from '../../config/productColumns'
import { useProductForm } from '../../composables/useProductForm'
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

const { formRef, formData, rules, validate, resetForm } = useProductForm(props.visible, props.product)

watch(() => props.visible, (v) => {
  if (v) resetForm()
})

async function handleOk() {
  const valid = await validate()
  if (valid) emit('save', formData.value)
}

function handleCancel() {
  emit('close')
}
</script>

<template>
  <a-modal
    :open="visible"
    :title="product ? 'Editar Producto' : 'Nuevo Producto'"
    :confirm-loading="submitting"
    ok-text="Guardar"
    cancel-text="Cancelar"
    @ok="handleOk"
    @cancel="handleCancel"
    :destroy-on-close="true"
    wrap-class-name="product-form-modal"
    :mask-style="{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }"
  >
    <a-spin :spinning="submitting" tip="Guardando...">
      <a-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        layout="vertical"
        validate-trigger="change"
      >
        <template v-for="field in productFormFields" :key="String(field.name)">
          <a-form-item :label="field.label" :name="String(field.name)">
            <component
              :is="field.component"
              v-model:value="formData[field.name]"
              :placeholder="field.placeholder"
              v-bind="field.props"
              style="width: 100%"
            />
          </a-form-item>
        </template>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<style scoped src="./ProductFormModal.css"></style>
