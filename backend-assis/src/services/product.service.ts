import { AppDataSource } from '../config/database.js';
import { Product } from '../entities/Product.js';
import { ProductHistory } from '../entities/ProductHistory.js';
import { CreateProductInput, UpdateProductInput, QueryInput } from '../schemas/product.schema.js';
import { Like } from 'typeorm';

const productRepository = () => AppDataSource.getRepository(Product);
const historyRepository = () => AppDataSource.getRepository(ProductHistory);

export const productService = {
  async getAll(query: QueryInput) {
    const { page, limit, search, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? { nombreProducto: Like(`%${search}%`) }
      : {};

    const [products, total] = await productRepository().findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip,
      take: limit,
    });

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getById(id: string) {
    const product = await productRepository().findOneBy({ id });
    if (!product) {
      throw Object.assign(new Error('Producto no encontrado'), { statusCode: 404 });
    }
    return product;
  },

  async create(data: CreateProductInput) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = queryRunner.manager.create(Product, data);
      const savedProduct = await queryRunner.manager.save(product);

      const history = queryRunner.manager.create(ProductHistory, {
        productId: savedProduct.id,
        action: 'CREATE',
        description: `Producto "${savedProduct.nombreProducto}" creado con precio ${savedProduct.precioProducto} y stock ${savedProduct.stockProducto}`,
      });
      await queryRunner.manager.save(history);

      await queryRunner.commitTransaction();
      return savedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  },

  async update(id: string, data: UpdateProductInput) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager.findOneBy(Product, { id });
      if (!product) {
        throw Object.assign(new Error('Producto no encontrado'), { statusCode: 404 });
      }

      const changes: string[] = [];
      if (data.nombreProducto !== undefined) changes.push(`nombre: "${product.nombreProducto}" → "${data.nombreProducto}"`);
      if (data.precioProducto !== undefined) changes.push(`precio: ${product.precioProducto} → ${data.precioProducto}`);
      if (data.stockProducto !== undefined) changes.push(`stock: ${product.stockProducto} → ${data.stockProducto}`);
      if (data.descripcionProducto !== undefined) changes.push('descripción actualizada');

      queryRunner.manager.merge(Product, product, data);
      const updatedProduct = await queryRunner.manager.save(product);

      const history = queryRunner.manager.create(ProductHistory, {
        productId: updatedProduct.id,
        action: 'UPDATE',
        description: `Producto "${updatedProduct.nombreProducto}" actualizado: ${changes.join('; ')}`,
      });
      await queryRunner.manager.save(history);

      await queryRunner.commitTransaction();
      return updatedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  },

  async remove(id: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager.findOneBy(Product, { id });
      if (!product) {
        throw Object.assign(new Error('Producto no encontrado'), { statusCode: 404 });
      }

      const history = queryRunner.manager.create(ProductHistory, {
        productId: product.id,
        action: 'DELETE',
        description: `Producto "${product.nombreProducto}" eliminado`,
      });
      await queryRunner.manager.save(history);

      await queryRunner.manager.remove(product);

      await queryRunner.commitTransaction();
      return { id };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  },

  async changeStatus(id: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager.findOneBy(Product, { id });
      if (!product) {
        throw Object.assign(new Error('Producto no encontrado'), { statusCode: 404 });
      }

      const estadoAnterior = product.estadoProducto;
      product.estadoProducto = !estadoAnterior;
      const updatedProduct = await queryRunner.manager.save(product);

      const history = queryRunner.manager.create(ProductHistory, {
        productId: updatedProduct.id,
        action: 'STATUS_CHANGE',
        description: `Estado cambiado de "${estadoAnterior ? 'Activo' : 'Inactivo'}" a "${updatedProduct.estadoProducto ? 'Activo' : 'Inactivo'}"`,
      });
      await queryRunner.manager.save(history);

      await queryRunner.commitTransaction();
      return updatedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  },

  async getHistory(productId: string) {
    const history = await historyRepository().find({
      where: { productId },
      order: { createdAt: 'DESC' },
    });
    return history;
  },
};
