// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// GitHub Pages 项目站点：https://<owner>.github.io/<repo>/
// Actions 中会自动读取 GITHUB_REPOSITORY；本地开发默认使用当前仓库名 GitHub。
const owner = process.env.GITHUB_REPOSITORY_OWNER ?? 'huang2006830';
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'GitHub';
const isUserSite = repo.toLowerCase() === `${owner}.github.io`.toLowerCase();
const base = process.env.BASE_PATH || (isUserSite ? '/' : `/${repo}`);
const site = process.env.SITE_URL || `https://${owner}.github.io`;

// https://astro.build/config
export default defineConfig({
  site,
  base,
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
