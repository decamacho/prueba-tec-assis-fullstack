import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { ProductUseCases } from '../../core/application/use-cases/ProductUseCases'
import { AxiosProductRepository } from '../../infrastructure/adapters/AxiosProductRepository'
import type { Product, ProductFormData, ProductQueryParams } from '../../core/domain/entities/Product'
import type { ProductHistory } from '../../core/domain/entities/ProductHistory'

const repository = new AxiosProductRepository()
const useCases = new ProductUseCases(repository)

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(10)
  const totalPages = ref(0)
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const currentProduct = ref<Product | null>(null)
  const history = ref<ProductHistory[]>([])
  const isHistoryLoading = ref(false)
  const switchingIds = ref<Set<string>>(new Set())
  const searchQuery = ref('')

  const queryParams = computed<ProductQueryParams>(() => ({
    page: page.value,
    limit: limit.value,
  }))

  const filteredProducts = computed(() => {
    if (!searchQuery.value) return products.value
    const q = searchQuery.value.toLowerCase()
    return products.value.filter((p) =>
      p.nombreProducto.toLowerCase().includes(q),
    )
  })

  async function fetchProducts(params?: ProductQueryParams) {
    isLoading.value = true
    try {
      const result = await useCases.getAll(params || queryParams.value)
      products.value = result.products
      total.value = result.total
      page.value = result.page
      limit.value = result.limit
      totalPages.value = result.totalPages
    } catch {
      products.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProductById(id: string) {
    isLoading.value = true
    try {
      currentProduct.value = await useCases.getById(id)
    } catch {
      currentProduct.value = null
    } finally {
      isLoading.value = false
    }
  }

  async function createProduct(data: ProductFormData) {
    isSubmitting.value = true
    try {
      await useCases.create(data)
      message.success('Producto creado exitosamente')
      await fetchProducts()
      return true
    } catch {
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateProduct(id: string, data: Partial<ProductFormData>) {
    isSubmitting.value = true
    try {
      await useCases.update(id, data)
      message.success('Producto actualizado exitosamente')
      await fetchProducts()
      return true
    } catch {
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  async function removeProduct(id: string) {
    try {
      await useCases.remove(id)
      message.success('Producto eliminado exitosamente')
      await fetchProducts()
      return true
    } catch {
      return false
    }
  }

  async function changeProductStatus(id: string, estadoProducto: boolean) {
    switchingIds.value = new Set(switchingIds.value).add(id)
    try {
      await useCases.changeStatus(id, estadoProducto)
      message.success('Estado actualizado exitosamente')
      await fetchProducts()
      return true
    } catch {
      return false
    } finally {
      const next = new Set(switchingIds.value)
      next.delete(id)
      switchingIds.value = next
    }
  }

  async function fetchHistory(id: string) {
    isHistoryLoading.value = true
    try {
      history.value = await useCases.getHistory(id)
    } catch {
      history.value = []
    } finally {
      isHistoryLoading.value = false
    }
  }

  function setSearch(search: string) {
    searchQuery.value = search
  }

  function setPage(p: number) {
    page.value = p
    return fetchProducts()
  }

  function setSort(sortBy: string, sortOrder: 'ASC' | 'DESC') {
    return fetchProducts({ page: page.value, limit: limit.value, sortBy, sortOrder })
  }

  function isSwitching(id: string): boolean {
    return switchingIds.value.has(id)
  }

  return {
    products,
    filteredProducts,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    isSubmitting,
    currentProduct,
    history,
    isHistoryLoading,
    searchQuery,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    removeProduct,
    changeProductStatus,
    fetchHistory,
    setSearch,
    setPage,
    setSort,
    isSwitching,
  }
})
