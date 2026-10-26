const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * 给站内绝对路径加上部署 base 前缀。
 * 外部 URL、协议相对 URL 和锚点保持原样。
 */
export function withBase(path = '/'): string {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('mailto:') || path.startsWith('#')) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}
