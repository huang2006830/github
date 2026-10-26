import type { FeedType } from '../types/index.ts';

// 纯展示层工具：颜色、文案、占位图、日期格式化。
// 故意不引入任何数据模块（articles.ts 里有 import.meta.glob 全量 JSON），
// 这样 ArticleListPage 的客户端脚本可以安全地 import 这里的映射，
// 服务端与客户端共用同一份配色，不会再出现两边漂移。

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/(^-|-$)/g, '');
}

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

// ── 无图文章的占位色块 ──────────────────────────────────────
// 6 种低饱和度莫兰迪渐变（定义在 global.css）。
// 用文章 id 做确定性散列而不是真随机，保证每次构建、每次渲染都稳定。
export const PLACEHOLDER_VARIANTS = ['ph-sage', 'ph-lavender', 'ph-clay', 'ph-mist', 'ph-ochre', 'ph-moss'] as const;

export function getPlaceholderClass(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PLACEHOLDER_VARIANTS[hash % PLACEHOLDER_VARIANTS.length];
}

// ── 分类色 ──────────────────────────────────────────────────
// 同一套莫兰迪低饱和度色，亮色/暗色各自一版，靠 dark: 切换
const categoryColors: Record<string, string> = {
  'Python & Scala':
    'bg-emerald-600/10 text-emerald-800 border-emerald-700/25 dark:bg-emerald-400/10 dark:text-emerald-300 dark:border-emerald-400/25',
  '大数据生态':
    'bg-sky-600/10 text-sky-800 border-sky-700/25 dark:bg-sky-400/10 dark:text-sky-300 dark:border-sky-400/25',
  'Linux/云原生':
    'bg-violet-600/10 text-violet-800 border-violet-700/25 dark:bg-violet-400/10 dark:text-violet-300 dark:border-violet-400/25',
  'DevOps 实践':
    'bg-amber-600/10 text-amber-800 border-amber-700/25 dark:bg-amber-400/10 dark:text-amber-300 dark:border-amber-400/25',
};

export function getCategoryColor(category: string): string {
  return (
    categoryColors[category] ||
    'bg-slate-500/10 text-slate-700 border-slate-500/25 dark:bg-slate-400/10 dark:text-slate-300 dark:border-slate-400/25'
  );
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

// ── 内容类型 ────────────────────────────────────────────────
const typeLabels: Record<FeedType, string> = {
  blog: '文章',
  podcast: '播客',
  youtube: '视频',
};

const typeColors: Record<FeedType, string> = {
  blog: 'bg-slate-500/10 text-slate-700 border-slate-500/25 dark:bg-slate-400/10 dark:text-slate-300 dark:border-slate-400/25',
  podcast:
    'bg-fuchsia-600/10 text-fuchsia-800 border-fuchsia-700/25 dark:bg-fuchsia-400/10 dark:text-fuchsia-300 dark:border-fuchsia-400/25',
  youtube:
    'bg-rose-600/10 text-rose-800 border-rose-700/25 dark:bg-rose-400/10 dark:text-rose-300 dark:border-rose-400/25',
};

export function getTypeLabel(type: FeedType): string {
  return typeLabels[type] || '文章';
}

export function getTypeColor(type: FeedType): string {
  return typeColors[type] || typeColors.blog;
}

// ── 筛选标签样式 ────────────────────────────────────────────
// 选中态刻意不用纯色填充，而是「柔和底色 + 明显描边」。
// ArticleListPage 的客户端脚本要按 token 逐个 add/remove，
// 所以服务端首屏和客户端筛选必须共用这一份，否则样式会漂移。
export const FILTER_ACTIVE_CLASSES = [
  'bg-emerald-600/10',
  'text-emerald-800',
  'border-emerald-600/45',
  'shadow-sm',
  'shadow-emerald-600/10',
  'dark:bg-emerald-400/15',
  'dark:text-emerald-300',
  'dark:border-emerald-400/45',
  'dark:shadow-emerald-400/10',
];

export const FILTER_INACTIVE_CLASSES = [
  'bg-white/55',
  'text-slate-600',
  'border-slate-200/90',
  'dark:bg-slate-800/40',
  'dark:text-slate-400',
  'dark:border-slate-700/60',
];

// ── 时间 ────────────────────────────────────────────────────
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getFreshnessBadge(pubDate: string): { label: string; class: string } | null {
  const hoursAgo = (Date.now() - new Date(pubDate).getTime()) / (1000 * 60 * 60);

  if (hoursAgo < 24) {
    return {
      label: '最新',
      class:
        'bg-white/85 text-emerald-800 border border-emerald-600/35 shadow-sm backdrop-blur-md dark:bg-slate-900/80 dark:text-emerald-300 dark:border-emerald-400/35',
    };
  }
  if (hoursAgo < 72) {
    return {
      label: '近期',
      class:
        'bg-white/85 text-sky-800 border border-sky-600/35 shadow-sm backdrop-blur-md dark:bg-slate-900/80 dark:text-sky-300 dark:border-sky-400/35',
    };
  }
  return null;
}
