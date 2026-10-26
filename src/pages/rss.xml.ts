import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { loadAllArticles } from '../utils/articles';

export function GET(context: APIContext) {
  const articles = loadAllArticles().slice(0, 50);

  return rss({
    title: '大数据技术学习站 — 每日聚合',
    description: '大数据、数据科学与数据工程领域的最新文章，每日自动更新。',
    site: context.site!,
    items: articles.map((article) => ({
      title: article.title,
      pubDate: new Date(article.pubDate),
      description: article.description,
      link: `/article/${article.id}/`,
      categories: article.categories,
    })),
    customData: '<language>zh-cn</language>',
  });
}
