export interface ProductHistory {
  id: string
  productId: string
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE'
  description: string
  createdAt: string
}
