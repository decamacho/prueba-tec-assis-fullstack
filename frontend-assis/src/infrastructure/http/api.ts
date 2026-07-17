import axios from 'axios'
import { message } from 'ant-design-vue'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      if (status === 400 && data?.message) {
        message.error(data.message)
      } else if (status === 404) {
        message.error(data?.message || 'Recurso no encontrado')
      } else if (status >= 500) {
        message.error('Error interno del servidor')
      }
    } else if (error.request) {
      message.error('Error de conexión con el servidor')
    }

    return Promise.reject(error)
  },
)

export default api
