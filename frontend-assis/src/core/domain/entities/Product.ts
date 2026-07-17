export interface Product {
  id: string
  nombreProducto: string
  descripcionProducto: string | null
  precioProducto: number
  stockProducto: number
  estadoProducto: boolean
  fechaCreacion: string
}

export interface ProductFormData {
  nombreProducto: string
  descripcionProducto?: string | null
  precioProducto: number
  stockProducto: number
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ProductQueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}
