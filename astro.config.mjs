// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// GitHub Pages 项目站点：https://<owner>.github.io/<repo>/
// Actions 中会自动读取 GITHUB_REPOSITORY；本地开发默认使用当前仓库名 github。
const owner = process.env.GITHUB_REPOSITORY_OWNER ?? 'huang2006830';
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'github';
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
    server: {
      watch: {
        // .tmp 用来放截图、浏览器 profile、日志等临时产物。
        // 不排除的话，Vite 会去 watch Chrome 锁定的缓存文件，
        // 触发 EBUSY unhandled rejection 并弹出错误覆盖层。
        ignored: ['**/.tmp/**', '**/dist/**'],
      },
    },
  },
});
