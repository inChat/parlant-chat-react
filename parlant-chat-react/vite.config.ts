/* eslint-disable no-undef */
import react from "@vitejs/plugin-react";
import path, { resolve } from "node:path";
import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts';


// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss(),dts({ insertTypesEntry: true })],
	css: {
		postcss: "./postcss.config.cjs",
	},
	resolve: {
		alias: {
			"@": path.resolve(".", "./src"),
      "node-fetch": "cross-fetch",
		},
	},
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.js'), // Your library's entry point
      name: 'ParlantChatReact', // The UMD global variable name
      // the proper extensions will be added
      // (fileName) => `my-lib.${format}.js` // More specific naming if needed
      fileName: 'parlant-chat-react',
    },
    rollupOptions: {
      // Make sure to externalize dependencies that shouldn't be bundled
      // into your library (usually React and ReactDOM)
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized dependencies
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJsxRuntime' // Check casing if issues arise
        },
        // Optional: Configure assets (like CSS) naming if not using injection plugin
        // assetFileNames: (assetInfo) => {
        //   if (assetInfo.name === 'style.css') return 'my-component-styles.css';
        //   return assetInfo.name;
        // },
      },
    },
    // Optional: Minify settings, sourcemaps, etc.
    sourcemap: true, // Recommended for debugging
    emptyOutDir: true, // Cleans the output directory before building
  },
});
