import { ref, onMounted } from 'vue'
import { useProductStore } from '../stores/productStore'

export function useProductTable() {
  const store = useProductStore()
  const searchText = ref('')

  onMounted(() => {
    store.fetchProducts()
  })

  function handleSearch() {
    store.setSearch(searchText.value)
  }

  function handleTableChange(pagination: any, _filters: any, sorter: any) {
    if (sorter.field && sorter.order) {
      const order = sorter.order === 'ascend' ? 'ASC' as const : 'DESC' as const
      store.setSort(sorter.field, order)
    }
  }

  function handleStatusToggle(id: string, checked: boolean) {
    store.changeProductStatus(id, checked)
  }

  return { store, searchText, handleSearch, handleTableChange, handleStatusToggle }
}
