import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens or headers here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data)
    }
    return Promise.reject(error)
  }
)

export interface ConvertRequest {
  file: File
  approach: string
  outputFolder?: string
}

export interface ConvertResponse {
  filename: string
  filepath: string
  download_url: string
  success: boolean
  message: string
}

export interface PredictionRequest {
  file?: File
  temperature?: number
  weight?: number
  pressure?: number
  dayOfWeek?: number
  humidity?: number
}

export interface PredictionResponse {
  predicted_temperature: number
  confidence: number
  recommendations: string[]
  report_url?: string
  success: boolean
  message: string
}

export const apiService = {
  // Convert PDF/DOCX to Excel
  async convertToExcel(data: ConvertRequest): Promise<ConvertResponse> {
    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('approach', data.approach)
    
    if (data.outputFolder) {
      formData.append('output_folder', data.outputFolder)
    }

    const response = await api.post<ConvertResponse>('/convert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  },

  // Get prediction results
  async getPrediction(data: PredictionRequest): Promise<PredictionResponse> {
    if (data.file) {
      // File-based prediction
      const formData = new FormData()
      formData.append('file', data.file)

      const response = await api.post<PredictionResponse>('/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data
    } else {
      // Parameter-based prediction
      const response = await api.post<PredictionResponse>('/predict', {
        temperature: data.temperature,
        weight: data.weight,
        pressure: data.pressure,
        day_of_week: data.dayOfWeek,
        humidity: data.humidity,
      })

      return response.data
    }
  },

  // Download file
  async downloadFile(url: string, filename: string): Promise<void> {
    const response = await api.get(url, {
      responseType: 'blob',
    })

    // Create blob link to download
    const blob = new Blob([response.data])
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  },

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await api.get('/health')
      return true
    } catch {
      return false
    }
  },
}

export default api

