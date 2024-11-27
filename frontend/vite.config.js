import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/fetch_data_test': 'http://localhost:8000',  // Proxy API requests to FastAPI server
      '/fetch_data': 'http://localhost:8000',      // Proxy other API requests
    },
  },
})
