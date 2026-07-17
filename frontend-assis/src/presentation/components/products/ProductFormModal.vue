<script setup lang="ts">
import { watch, toRef, markRaw } from 'vue'
import { Input, InputNumber } from 'ant-design-vue'
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

const componentMap: Record<string, any> = {
  Input: markRaw(Input),
  InputNumber: markRaw(InputNumber),
  Textarea: markRaw(Input.Textarea || 'textarea'),
}

const visibleRef = toRef(props, 'visible')
const productRef = toRef(props, 'product')

const { formRef, formData, rules, validate, resetForm } = useProductForm(visibleRef, productRef)

watch(visibleRef, (v) => {
  if (v) resetForm()
})

async function handleOk() {
  const valid = await validate()
  if (valid) emit('save', formData.value as ProductFormData)
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
      <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical" validate-trigger="change">
        <template v-for="field in productFormFields" :key="String(field.name)">
          <a-form-item :label="field.label" :name="String(field.name)">
            <component
              :is="componentMap[field.component]"
              v-model:value="formData[field.name]"
              :placeholder="field.placeholder"
              v-bind="field.props"
              class="product-form-input"
            />
          </a-form-item>
        </template>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<style scoped src="./ProductFormModal.css"></style>
