// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// GitHub Pages 用户站点：仓库名需为 <用户名>.github.io，站点部署在根路径。
// 在 GitHub Actions 中，GITHUB_REPOSITORY_OWNER 会自动注入；本地开发时使用占位地址。
const owner = process.env.GITHUB_REPOSITORY_OWNER;
const site = process.env.SITE_URL || (owner ? `https://${owner}.github.io` : 'https://example.github.io');

// https://astro.build/config
export default defineConfig({
  site,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/page/') && !page.includes('/rs'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
