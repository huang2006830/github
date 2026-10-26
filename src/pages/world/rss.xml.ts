import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { loadWorldArticles } from '../../utils/articles';

export function GET(context: APIContext) {
  const articles = loadWorldArticles().slice(0, 50);

  return rss({
    title: '大数据技术学习站 — 国际视野',
    description: '国际来源的大数据与数据科学文章，每日自动更新。',
    site: context.site!,
    items: articles.map((article) => ({
      title: article.title,
      pubDate: new Date(article.pubDate),
      description: article.description,
      link: `/article/${article.id}/`,
      categories: article.categories,
    })),
    customData: '<language>en</language>',
  });
}
