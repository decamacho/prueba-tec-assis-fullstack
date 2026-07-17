import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { ProductHistory } from './ProductHistory.js';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: false, name: 'nombre_producto' })
  nombreProducto!: string;

  @Column({ type: 'text', nullable: true, name: 'descripcion_producto' })
  descripcionProducto!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, name: 'precio_producto' })
  precioProducto!: number;

  @Column({ type: 'int', nullable: false, default: 0, name: 'stock_producto' })
  stockProducto!: number;

  @Column({ type: 'boolean', nullable: false, default: true, name: 'estado_producto' })
  estadoProducto!: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'fecha_creacion' })
  fechaCreacion!: Date;

  @OneToMany(() => ProductHistory, (history) => history.product, {
    cascade: true,
  })
  history!: ProductHistory[];
}
