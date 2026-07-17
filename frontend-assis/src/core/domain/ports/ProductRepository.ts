import type { Product, ProductFormData, ProductListResponse, ProductQueryParams } from '../entities/Product'
import type { ProductHistory } from '../entities/ProductHistory'

export interface ProductRepository {
  getAll(params: ProductQueryParams): Promise<ProductListResponse>
  getById(id: string): Promise<Product>
  create(data: ProductFormData): Promise<Product>
  update(id: string, data: Partial<ProductFormData>): Promise<Product>
  remove(id: string): Promise<{ id: string }>
  changeStatus(id: string, estadoProducto: boolean): Promise<Product>
  getHistory(id: string): Promise<ProductHistory[]>
}
