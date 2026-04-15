import axios from 'axios'

// Quick type declaration to fix 'process' error
declare const process: {
  env: {
    NODE_ENV: string
  }
}

const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development' ? 'http://localhost:4000/' : '/',
  headers: {
    'Content-type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  async (config) => {
    // Safely check for localStorage (avoids errors in Node.js)
    if (typeof localStorage !== 'undefined' && localStorage.getItem('userInfo')) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo')!)
      config.headers.authorization = `Bearer ${userInfo.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default apiClient