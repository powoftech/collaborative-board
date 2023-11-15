import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/backend": {
				target: "http://localhost:5000",
				changeOrigin: true,
				secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/backend/, ''),
			},
		},
	},
});
