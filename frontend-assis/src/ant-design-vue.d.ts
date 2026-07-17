declare module 'ant-design-vue' {
  import type { App, Plugin } from 'vue'

  const Antd: Plugin
  export default Antd

  export const message: {
    success(content: string): void
    error(content: string): void
    info(content: string): void
    warning(content: string): void
    loading(content: string): () => void
  }

  export const Modal: {
    confirm(options: {
      title: string
      content: string
      okText?: string
      okType?: string
      cancelText?: string
      onOk?: () => void | Promise<void>
      onCancel?: () => void
    }): void
  }
}
