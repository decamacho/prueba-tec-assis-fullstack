import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes.js';
import { errorHandler } from './middlewares/error-handler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

app.use(errorHandler);

export default app;
