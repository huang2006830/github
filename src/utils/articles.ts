import type { Article, FeedType, MonthlyData } from '../types/index.ts';

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

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/(^-|-$)/g, '');
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

export function getFreshnessBadge(pubDate: string): { label: string; class: string } | null {
  const now = Date.now();
  const published = new Date(pubDate).getTime();
  const hoursAgo = (now - published) / (1000 * 60 * 60);

  if (hoursAgo < 24) {
    return { label: '最新', class: 'bg-emerald-700 text-white border border-emerald-600 shadow-lg shadow-emerald-700/30 backdrop-blur-sm' };
  }
  if (hoursAgo < 72) {
    return { label: '近期', class: 'bg-blue-500 text-white border border-blue-400 shadow-lg shadow-blue-500/30 backdrop-blur-sm' };
  }
  return null;
}

export function getMetaDescription(text: string, maxLength = 155): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
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

// 分类链接使用固定英文 slug，避免中文分类名进入 URL
const categorySlugs: Record<string, string> = {
  'Python & Scala': 'python-scala',
  '大数据生态': 'big-data',
  'Linux/云原生': 'linux-cloud-native',
  'DevOps 实践': 'devops',
};

export function getCategorySlug(category: string): string {
  return categorySlugs[category] || slugify(category);
}

// 按固定顺序返回分类；数据里出现计划外的分类则追加在后面，避免内容“隐身”
export function getSiteCategories(articles: Article[]): string[] {
  const present = new Set(getAllCategories(articles));
  const canonical = SITE_CATEGORIES.filter((cat) => present.has(cat));
  const extras = Array.from(present)
    .filter((cat) => !SITE_CATEGORIES.includes(cat))
    .sort((a, b) => a.localeCompare(b, 'zh-CN'));
  return [...canonical, ...extras];
}

// Category color mapping for placeholder gradients
const categoryGradients: Record<string, string> = {
  'Python & Scala': 'from-violet-600 to-purple-800',
  '大数据生态': 'from-indigo-600 to-blue-800',
  'Linux/云原生': 'from-sky-600 to-cyan-800',
  'DevOps 实践': 'from-orange-600 to-red-800',
};

export function getCategoryGradient(categories: string[]): string {
  for (const cat of categories) {
    if (categoryGradients[cat]) return categoryGradients[cat];
  }
  return 'from-zinc-600 to-zinc-800';
}

const categoryColors: Record<string, string> = {
  'Python & Scala': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  '大数据生态': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  'Linux/云原生': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  'DevOps 实践': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

export function getCategoryColor(category: string): string {
  return categoryColors[category] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
}

const categoryLabels: Record<string, string> = {
  'Python & Scala': 'Python & Scala',
  '大数据生态': '大数据生态',
  'Linux/云原生': 'Linux / 云原生',
  'DevOps 实践': 'DevOps 实践',
};

export function getCategoryLabel(category: string): string {
  return categoryLabels[category] || category;
}

const typeLabels: Record<FeedType, string> = {
  blog: '文章',
  podcast: '播客',
  youtube: '视频',
};

const typeColors: Record<FeedType, string> = {
  blog: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  podcast: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
  youtube: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export function getTypeLabel(type: FeedType): string {
  return typeLabels[type] || '文章';
}

export function getTypeColor(type: FeedType): string {
  return typeColors[type] || typeColors.blog;
}

export function getAllTypes(articles: Article[]): FeedType[] {
  const types = new Set<FeedType>();
  for (const article of articles) {
    types.add(article.type || 'blog');
  }
  return Array.from(types).sort();
}
