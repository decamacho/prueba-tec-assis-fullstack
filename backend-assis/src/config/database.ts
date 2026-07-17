import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env.js';
import { Product } from '../entities/Product.js';
import { ProductHistory } from '../entities/ProductHistory.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.user,
  password: env.db.password,
  database: env.db.name,
  synchronize: false,
  logging: false,
  entities: [Product, ProductHistory],
  migrations: [],
  subscribers: [],
});
