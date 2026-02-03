// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap()],
  experimental: {
    fonts: [
      {
        provider: "local",
        name: "HEX Franklin",
        cssVariable: "--font-sans",
        fallbacks: ["sans-serif"],
        variants: [
          {
            src: ["./src/fonts/HEX_Franklin_v0.3_Variable.woff2"],
          },
        ],
      },
      {
        provider: "local",
        name: "MonoLisa",
        cssVariable: "--font-mono",
        fallbacks: ["monospace"],
        variants: [
          {
            src: ["./src/fonts/MonoLisaVariableNormal.woff2"],
          },
        ],
      },
    ],
  },
});
