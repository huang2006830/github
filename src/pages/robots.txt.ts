import type { APIRoute } from 'astro';
import { withBase } from '../utils/url';

const getRobotsTxt = (sitemapURL: URL, rsPath: string) => `\
User-agent: *
Allow: /
Disallow: ${rsPath}

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL(withBase('/sitemap-index.xml'), site);
  return new Response(getRobotsTxt(sitemapURL, withBase('/rs')));
};
