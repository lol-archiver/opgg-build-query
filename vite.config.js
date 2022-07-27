import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'vite';
import pluginVue from '@vitejs/plugin-vue';



const dirPackage = dirname(fileURLToPath(import.meta.url));


export default defineConfig({
	plugins: [
		pluginVue({
			template: {
				compilerOptions: {
					isCustomElement: tag => /^((module-|comp-|p-).+?|module)$/.test(tag)
				}
			}
		}),
	],
	root: resolve(dirPackage, 'src'),
	base: './',
	build: {
		outDir: resolve(dirPackage, 'dist'),
		emptyOutDir: true,
		chunkSizeWarningLimit: 1024
	},
	publicDir: resolve(dirPackage, 'src', 'public'),
	clearScreen: false,
	server: {
		port: 4754,
		proxy: {
			'^/api/': {
				target: 'http://127.0.0.1:14754',
				changeOrigin: true,
			},
			'/wock': {
				target: 'ws://127.0.0.1:14754/wock',
				ws: true
			},
		}
	}
});
