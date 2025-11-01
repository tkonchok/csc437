import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        signup: resolve(__dirname, 'signup.html'),
        profile: resolve(__dirname, 'profile.html'),
        upload: resolve(__dirname, 'upload.html'),
        collaboration: resolve(__dirname, 'collaboration.html'),
        feedback: resolve(__dirname, 'feedback.html'),
        locked: resolve(__dirname, 'locked.html'),
        loggedin: resolve(__dirname, 'logged-in.html'),
        audiopost: resolve(__dirname, 'audiopost.html')
      }
    }
  }
})
