import dotenv from 'dotenv';
dotenv.config();

export const env = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'admin_password',
    name: process.env.DB_NAME || 'database_prueba_tecnica',
  },
  port: parseInt(process.env.PORT || '3000', 10),
};
