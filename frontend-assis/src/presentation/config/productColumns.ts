import type { Product } from '../../core/domain/entities/Product'

export interface ColumnDef {
  title: string
  dataIndex?: keyof Product
  key: string
  sorter?: boolean
  width?: number | string
  customRender?: (value: unknown, record: Product) => string
  scopedSlots?: string
  ellipsis?: boolean
}

export interface FormFieldDef {
  name: string
  label: string
  component: 'Input' | 'InputNumber' | 'Textarea'
  rules: { required?: boolean; type?: string; min?: number; max?: number; message: string }[]
  props?: Record<string, unknown>
  placeholder?: string
}

export const productColumns: ColumnDef[] = [
  { title: 'Nombre', dataIndex: 'nombreProducto', key: 'nombreProducto', sorter: true },
  {
    title: 'Descripción',
    dataIndex: 'descripcionProducto',
    key: 'descripcionProducto',
    ellipsis: true,
  },
  {
    title: 'Precio',
    dataIndex: 'precioProducto',
    key: 'precioProducto',
    sorter: true,
    customRender: (value) => `$${Number(value).toFixed(2)}`,
  },
  { title: 'Stock', dataIndex: 'stockProducto', key: 'stockProducto', sorter: true },
  {
    title: 'Estado',
    key: 'estadoProducto',
    scopedSlots: 'estadoProducto',
  },
    {
    title: 'Acciones',
    key: 'acciones',
    width: 200,
    scopedSlots: 'acciones',
  },
]

export const productFormFields: FormFieldDef[] = [
  {
    name: 'nombreProducto',
    label: 'Nombre',
    component: 'Input',
    placeholder: 'Nombre del producto',
    rules: [
      { required: true, message: 'El nombre es obligatorio' },
      { max: 100, message: 'Máximo 100 caracteres' },
    ],
    props: { maxlength: 100 },
  },
  {
    name: 'descripcionProducto',
    label: 'Descripción',
    component: 'Textarea',
    placeholder: 'Descripción del producto',
    rules: [
      { required: true, message: 'La descripción es obligatoria' },
    ],
    props: { rows: 3 },
  },
  {
    name: 'precioProducto',
    label: 'Precio',
    component: 'InputNumber',
    placeholder: '0',
    rules: [
      { required: true, message: 'El precio es obligatorio' },
      { type: 'number', min: 0.01, message: 'El precio debe ser mayor a 0' },
    ],
    props: { min: 0.01, precision: 0, step: 1 },
  },
  {
    name: 'stockProducto',
    label: 'Stock',
    component: 'InputNumber',
    placeholder: '0',
    rules: [
      { required: true, message: 'El stock es obligatorio' },
      { type: 'number', min: 0, message: 'El stock debe ser mayor o igual a 0' },
    ],
    props: { min: 0, precision: 0 },
  },
]
