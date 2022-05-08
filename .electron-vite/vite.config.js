const { join } = require("path")
const vuePlugin = require("@vitejs/plugin-vue")
const vueJsx = require("@vitejs/plugin-vue-jsx");
const { defineConfig } = require("vite")
const userConfig = require("../config")
const IsWeb = process.env.BUILD_TARGET === 'web'

function resolve(dir) {
    return join(__dirname, '..', dir)
}
userConfig.build.env.is_web = IsWeb
userConfig.dev.env.is_web = IsWeb

const root = resolve('src/renderer')

const config = defineConfig({
    mode: process.env.NODE_ENV,
    root,
    define: {
        'process.env': process.env.NODE_ENV === 'production' ? userConfig.build.env : userConfig.dev.env
    },
    resolve: {
        alias: {
            '@renderer': root,
            '@store': join(root, '/store/modules'),
        }
    },
    base: './',
    build: {
        outDir: IsWeb ? resolve('dist/web') : resolve('dist/electron/renderer'),
        emptyOutDir: true,
        target: 'esnext',
        minify: 'esbuild',
        rollupOptions: {
            output: {
                entryFileNames: `assets/js/[name]-[hash].js`,
                chunkFileNames: `assets/js/[name]-[hash].js`,
                assetFileNames:  `assets/[ext]/[name]-[hash][extname]`,
                compact: true,
                manualChunks: {
                    vue: ['vue', 'vue-router', 'vuex'],
                },
            },
        },
        terserOptions: {
            compress: {
                drop_console: false,
                drop_debugger: true,
            },
            ie8: true,
            output: {
                comments: true,
            },
        },
    },
    server: {
    },
    plugins: [
        vueJsx(),
        vuePlugin({
            script: {
                refSugar: true
            }
        })
    ],
    optimizeDeps: {
    },
    publicDir: resolve('static')
})

module.exports = config