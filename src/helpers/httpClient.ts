import axios from 'axios'
import { API_CONFIG } from '@/config/api'

// Create axios instance with base URL for the API
const axiosInstance = axios.create({
  baseURL: API_CONFIG.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

function HttpClient() {
  return {
    get: axiosInstance.get.bind(axiosInstance),
    post: axiosInstance.post.bind(axiosInstance),
    patch: axiosInstance.patch.bind(axiosInstance),
    put: axiosInstance.put.bind(axiosInstance),
    delete: axiosInstance.delete.bind(axiosInstance),
  }
}

export default HttpClient()
