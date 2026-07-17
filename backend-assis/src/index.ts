import 'reflect-metadata';
import app from './app.js';
import { AppDataSource } from './config/database.js';
import { env } from './config/env.js';

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
