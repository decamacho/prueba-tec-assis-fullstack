import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/database.js';
import { env } from './config/env.js';
import productRoutes from './routes/product.routes.js';
import { errorHandler } from './middlewares/error-handler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log('Conexión a PostgreSQL establecida correctamente');
    app.listen(env.port, () => {
      console.log(`Servidor corriendo en puerto ${env.port}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  });

export default app;
