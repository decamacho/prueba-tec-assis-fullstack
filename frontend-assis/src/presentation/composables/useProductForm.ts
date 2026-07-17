import { ref, watch, nextTick, toRef, type Ref } from 'vue'
import { productFormFields } from '../config/productColumns'
import type { Product, ProductFormData } from '../../core/domain/entities/Product'

export function useProductForm(
  visibleRef: Ref<boolean> | boolean,
  productRef: Ref<Product | null> | Product | null,
) {
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

  const watchVisible = typeof visibleRef === 'boolean' ? ref(visibleRef) : visibleRef
  const watchProduct = typeof productRef === 'object' && productRef !== null && 'value' in productRef
    ? productRef as Ref<Product | null>
    : ref(productRef as Product | null)

  watch(watchVisible, (visible) => {
    if (visible) {
      const product = watchProduct.value
      if (product) {
        formData.value = {
          nombreProducto: product.nombreProducto,
          descripcionProducto: product.descripcionProducto,
          precioProducto: product.precioProducto,
          stockProducto: product.stockProducto,
        }
      } else {
        formData.value = {
          nombreProducto: '',
          descripcionProducto: null,
          precioProducto: null,
          stockProducto: null,
        }
      }
    }
  })

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
