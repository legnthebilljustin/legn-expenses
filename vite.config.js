import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            /* this tells Vite how to build import paths
                also need to tell typescript how to resolve import paths - tsconfig.json
                changes here must reflect in tsconfig.json
            */
            "@": "/src",
            "@apis": "/src/apis",
            "@components": "/src/components",
            "@constants": "/src/constants",
            "@hooks": "/src/hooks",
            "@pages": "/src/pages",
            "@state": "/src/state",
            "@utils": "/src/utils",
            "@types": "/src/types",
        },
    },
    plugins: [react()],
    server: {
        /**
         * this proxy acts as a middleman, making a request to the local dev server then forwards it to the API:
         * bypassing same-origin policy which prevents cross-origin requests (CORS issue) during development
         */
		proxy: {
			'/api': {
				target: 'https://legn-backend-proxy.onrender.com',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
});
