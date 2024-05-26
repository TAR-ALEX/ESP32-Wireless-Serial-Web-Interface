import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'
import { ViteMinifyPlugin } from 'vite-plugin-minify'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        viteSingleFile(),
        ViteMinifyPlugin({})
        
    ],
    build: {
        outDir: './toESP32/'
    }
})
