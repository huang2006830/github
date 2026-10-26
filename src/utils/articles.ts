import type { Article, FeedType, MonthlyData } from '../types/index.ts';
import { slugify } from './ui.ts';

// 展示层工具（颜色 / 文案 / 日期 / slug）已下沉到 ./ui.ts——
// 那里没有 import.meta.glob，客户端脚本可以安全复用。
// 这里继续 re-export，保持各页面 `from '../utils/articles'` 的老写法可用。
export * from './ui.ts';

export function loadAllArticles(): Article[] {
  const modules = import.meta.glob<MonthlyData>('/data/*.json', { eager: true });
  const articles: Article[] = [];

  for (const mod of Object.values(modules)) {
    if (mod.articles) {
      articles.push(...mod.articles);
    }
  }

  // Sort by date, newest first
  articles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return articles;
}

export function loadWorldArticles(): Article[] {
  const modules = import.meta.glob<MonthlyData>('/data-world/*.json', { eager: true });
  const articles: Article[] = [];

  for (const mod of Object.values(modules)) {
    if (mod.articles) {
      articles.push(...mod.articles);
    }
  }

  articles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return articles;
}

export function getAllCategories(articles: Article[]): string[] {
  const cats = new Set<string>();
  for (const article of articles) {
    for (const cat of article.categories) {
      cats.add(cat);
    }
  }
  return Array.from(cats).sort();
}

export function getAllSources(articles: Article[]): { name: string; slug: string; url: string; categories: string[]; count: number }[] {
  const sourceMap = new Map<string, { name: string; url: string; categories: Set<string>; count: number }>();

  for (const article of articles) {
    const existing = sourceMap.get(article.source);
    if (existing) {
      existing.count++;
      for (const cat of article.categories) {
        existing.categories.add(cat);
      }
    } else {
      sourceMap.set(article.source, {
        name: article.source,
        url: article.sourceUrl,
        categories: new Set(article.categories),
        count: 1,
      });
    }
  }

  return Array.from(sourceMap.values())
    .map((s) => ({ ...s, slug: slugify(s.name), categories: Array.from(s.categories) }))
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
}

export function getRelatedArticles(article: Article, allArticles: Article[], limit = 4): Article[] {
  return allArticles
    .filter((a) => a.id !== article.id && a.categories.some((c) => article.categories.includes(c)))
    .slice(0, limit);
}

export function getMetaDescription(text: string, maxLength = 155): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

export function paginate<T>(items: T[], page: number, pageSize: number): { data: T[]; totalPages: number; currentPage: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const data = items.slice(start, start + pageSize);

  return { data, totalPages, currentPage };
}

// 站点固定分类：数组顺序即首页筛选标签顺序（“全部”由组件自己渲染）
export const SITE_CATEGORIES: string[] = ['Python & Scala', '大数据生态', 'Linux/云原生', 'DevOps 实践'];

// 按固定顺序返回分类；数据里出现计划外的分类则追加在后面，避免内容“隐身”
export function getSiteCategories(articles: Article[]): string[] {
  const present = new Set(getAllCategories(articles));
  const canonical = SITE_CATEGORIES.filter((cat) => present.has(cat));
  const extras = Array.from(present)
    .filter((cat) => !SITE_CATEGORIES.includes(cat))
    .sort((a, b) => a.localeCompare(b, 'zh-CN'));
  return [...canonical, ...extras];
}

export function getAllTypes(articles: Article[]): FeedType[] {
  const types = new Set<FeedType>();
  for (const article of articles) {
    types.add(article.type || 'blog');
  }
  return Array.from(types).sort();
}
