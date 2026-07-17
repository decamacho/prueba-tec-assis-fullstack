import type { ProductRepository } from '../../core/domain/ports/ProductRepository'
import type { Product, ProductFormData, ProductListResponse, ProductQueryParams } from '../../core/domain/entities/Product'
import type { ProductHistory } from '../../core/domain/entities/ProductHistory'
import api from '../http/api'

interface ApiResponse<T> {
  statusCode: number
  message: string
  data: T
  status: 'success' | 'error'
}

export class AxiosProductRepository implements ProductRepository {
  async getAll(params: ProductQueryParams): Promise<ProductListResponse> {
    const response = await api.get<unknown, ApiResponse<ProductListResponse>>('/products', { params })
    return response.data
  }

  async getById(id: string): Promise<Product> {
    const response = await api.get<unknown, ApiResponse<Product>>(`/products/${id}`)
    return response.data
  }

  async create(data: ProductFormData): Promise<Product> {
    const response = await api.post<unknown, ApiResponse<Product>>('/products', data)
    return response.data
  }

  async update(id: string, data: Partial<ProductFormData>): Promise<Product> {
    const response = await api.put<unknown, ApiResponse<Product>>(`/products/${id}`, data)
    return response.data
  }

  async remove(id: string): Promise<{ id: string }> {
    const response = await api.delete<unknown, ApiResponse<{ id: string }>>(`/products/${id}`)
    return response.data
  }

  async changeStatus(id: string, estadoProducto: boolean): Promise<Product> {
    const response = await api.patch<unknown, ApiResponse<Product>>(`/products/${id}/status`, { estadoProducto })
    return response.data
  }

  async getHistory(id: string): Promise<ProductHistory[]> {
    const response = await api.get<unknown, ApiResponse<ProductHistory[]>>(`/products/${id}/history`)
    return response.data
  }
}
