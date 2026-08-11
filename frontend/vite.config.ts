import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/video_feed': 'http://localhost:5001',
      '/capture': 'http://localhost:5001',
      '/screenshots': 'http://localhost:5001',
      '/saved_images': 'http://localhost:5001',
      '/download_image': 'http://localhost:5001',
      '/download_video': 'http://localhost:5001',
      '/start_recording': 'http://localhost:5001',
      '/stop_recording': 'http://localhost:5001',
      '/recording_status': 'http://localhost:5001',
      '/delete_image': 'http://localhost:5001',
      '/stop_camera': 'http://localhost:5001',
    }
  }
})
