import type { ProductRepository } from '../../domain/ports/ProductRepository'
import type { Product, ProductFormData, ProductListResponse, ProductQueryParams } from '../../domain/entities/Product'
import type { ProductHistory } from '../../domain/entities/ProductHistory'

export class ProductUseCases {
  constructor(private readonly repository: ProductRepository) {}

  async getAll(params: ProductQueryParams): Promise<ProductListResponse> {
    return this.repository.getAll(params)
  }

  async getById(id: string): Promise<Product> {
    return this.repository.getById(id)
  }

  async create(data: ProductFormData): Promise<Product> {
    return this.repository.create(data)
  }

  async update(id: string, data: Partial<ProductFormData>): Promise<Product> {
    return this.repository.update(id, data)
  }

  async remove(id: string): Promise<{ id: string }> {
    return this.repository.remove(id)
  }

  async changeStatus(id: string, estadoProducto: boolean): Promise<Product> {
    return this.repository.changeStatus(id, estadoProducto)
  }

  async getHistory(id: string): Promise<ProductHistory[]> {
    return this.repository.getHistory(id)
  }
}
