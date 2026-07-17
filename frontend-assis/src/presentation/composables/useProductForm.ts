import { ref, watch, nextTick } from 'vue'
import { productFormFields } from '../config/productColumns'
import type { Product, ProductFormData } from '../../core/domain/entities/Product'

export function useProductForm(visible: boolean, product: Product | null) {
  const formRef = ref()
  const formData = ref<Record<string, any>>({
    nombreProducto: '',
    descripcionProducto: null,
    precioProducto: null,
    stockProducto: null,
  })

  const rules = Object.fromEntries(
    productFormFields.map((f: { name: string; rules: any[] }) => [f.name, f.rules]),
  )

  watch(
    () => visible,
    (v) => {
      if (v && product) {
        formData.value = {
          nombreProducto: product.nombreProducto,
          descripcionProducto: product.descripcionProducto,
          precioProducto: product.precioProducto,
          stockProducto: product.stockProducto,
        }
      } else if (v) {
        formData.value = {
          nombreProducto: '',
          descripcionProducto: null,
          precioProducto: null,
          stockProducto: null,
        }
      }
    },
  )

  async function validate(): Promise<boolean> {
    try {
      await formRef.value?.validate()
      return true
    } catch {
      return false
    }
  }

  async function resetForm() {
    await nextTick()
    formRef.value?.clearValidate()
  }

  return { formRef, formData, rules, validate, resetForm }
}
