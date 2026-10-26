export type FeedType = 'blog' | 'podcast' | 'youtube';

export interface FeedConfig {
  url: string;
  name: string;
  categories: string[];
  type?: FeedType;
  /** 标题或摘要命中这些关键字时跳过该条目，用于过滤个人博客里的非技术内容 */
  exclude?: string[];
}

export interface FeedsConfig {
  feeds: FeedConfig[];
  feeds_world?: FeedConfig[];
}

export interface Article {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  sourceUrl: string;
  categories: string[];
  image: string | null;
  type: FeedType;
  audioUrl?: string;
  duration?: string;
  videoId?: string;
}

export interface MonthlyData {
  month: string;
  articles: Article[];
}
