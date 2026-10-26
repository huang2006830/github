import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { loadAllArticles } from '../utils/articles';
import { withBase } from '../utils/url';

export function GET(context: APIContext) {
  const articles = loadAllArticles().slice(0, 50);

  return rss({
    title: '大数据运维与开发实战站 — 每日聚合',
    description: 'Python/Scala 数据开发、Spark/Flink 实战、Linux/云原生运维与 DevOps 实践的最新文章，每日自动更新。',
    site: new URL(withBase('/'), context.site!),
    items: articles.map((article) => ({
      title: article.title,
      pubDate: new Date(article.pubDate),
      description: article.description,
      link: withBase(`/article/${article.id}/`),
      categories: article.categories,
    })),
    customData: '<language>zh-cn</language>',
  });
}
