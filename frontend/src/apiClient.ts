import axios from 'axios'

// Used vite's environment variable: `import.meta.env.DEV` is true during development
const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? 'http://localhost:4000/' : '/',
  headers: {
    'Content-type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  async (config) => {
    const userInfoRaw = localStorage.getItem('userInfo')
    if (userInfoRaw) {
      const userInfo = JSON.parse(userInfoRaw)
      config.headers.authorization = `Bearer ${userInfo.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)   
  }
)

export default apiClient