import { Request, Response } from 'express';
import { productService } from '../services/product.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const productController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const query = (req as any).validatedQuery;
      const result = await productService.getAll(query);
      sendSuccess(res, result, 'Productos obtenidos correctamente');
    } catch (error: any) {
      sendError(res, error.message || 'Error al obtener productos', error.statusCode || 500);
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const product = await productService.getById(id);
      sendSuccess(res, product, 'Producto obtenido correctamente');
    } catch (error: any) {
      sendError(res, error.message || 'Error al obtener el producto', error.statusCode || 500);
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const product = await productService.create(req.body);
      sendSuccess(res, product, 'Producto creado exitosamente', 201);
    } catch (error: any) {
      sendError(res, error.message || 'Error al crear el producto', error.statusCode || 500);
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const product = await productService.update(id, req.body);
      sendSuccess(res, product, 'Producto actualizado exitosamente');
    } catch (error: any) {
      sendError(res, error.message || 'Error al actualizar el producto', error.statusCode || 500);
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await productService.remove(id);
      sendSuccess(res, result, 'Producto eliminado exitosamente');
    } catch (error: any) {
      sendError(res, error.message || 'Error al eliminar el producto', error.statusCode || 500);
    }
  },

  async changeStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const product = await productService.changeStatus(id);
      sendSuccess(res, product, 'Estado del producto actualizado exitosamente');
    } catch (error: any) {
      sendError(res, error.message || 'Error al cambiar el estado', error.statusCode || 500);
    }
  },

  async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const history = await productService.getHistory(id);
      sendSuccess(res, history, 'Historial obtenido correctamente');
    } catch (error: any) {
      sendError(res, error.message || 'Error al obtener el historial', error.statusCode || 500);
    }
  },
};
