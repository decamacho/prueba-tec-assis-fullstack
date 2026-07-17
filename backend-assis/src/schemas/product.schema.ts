import { z } from 'zod';

export const createProductSchema = z.object({
  nombreProducto: z
    .string()
    .min(1, 'El nombre del producto es obligatorio')
    .max(100, 'El nombre del producto excedió el máximo de 100 caracteres'),
  descripcionProducto: z.string().optional().nullable(),
  precioProducto: z
    .number()
    .positive('El precio del producto debe ser un número mayor que 0'),
  stockProducto: z
    .number()
    .int()
    .min(0, 'El stock del producto debe ser un número mayor o igual a 0'),
}).strict();

export const updateProductSchema = z.object({
  nombreProducto: z
    .string()
    .min(1, 'El nombre del producto es obligatorio')
    .max(100, 'El nombre del producto excedió el máximo de 100 caracteres')
    .optional(),
  descripcionProducto: z.string().optional().nullable(),
  precioProducto: z
    .number()
    .positive('El precio del producto debe ser un número mayor que 0')
    .optional(),
  stockProducto: z
    .number()
    .int()
    .min(0, 'El stock del producto debe ser un número mayor o igual a 0')
    .optional(),
}).strict();

export const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z
    .enum(['nombreProducto', 'precioProducto', 'stockProducto', 'fechaCreacion'])
    .default('fechaCreacion'),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type QueryInput = z.infer<typeof querySchema>;
