# 大数据运维与开发实战站

聚焦 Python/Scala 数据开发、Spark/Flink 实战、Linux/云原生基础设施运维及精选学习资料。

## 功能

- 自动聚合 RSS 源，每日更新
- 按分类（Python & Scala / 大数据生态 / Linux/云原生 / DevOps 实践）、来源、内容类型筛选
- 客户端全文搜索
- 两个可手工维护的 Markdown 页面：[近期优质学习资料精选](/resources)、[极客速查手册](/cheatsheet)
- 提供 RSS 订阅和 JSON 数据索引
- 静态部署，访问速度快

## 技术栈

- [Astro](https://astro.build) + Tailwind CSS
- TypeScript
- GitHub Actions（定时抓取与部署）
- GitHub Pages（静态托管）

## 本地运行

需要 Node.js 24 和 npm。

```bash
npm install
npm run fetch-feeds   # 抓取 RSS，生成本地数据
npm run dev           # 启动开发服务器，默认 http://localhost:4321/github
```

其他命令：

```bash
npm run build         # 构建生产版本到 dist/
npm run preview       # 预览构建结果
```

## 添加数据源

编辑根目录的 `feeds.yaml`，按现有格式添加 RSS 源：

```yaml
feeds:
  - url: https://example.com/feed
    name: 示例来源
    categories: ["大数据生态", "DevOps 实践"]
```

分类只允许以下四个值，顺序即首页筛选标签顺序：

1. `Python & Scala`
2. `大数据生态`
3. `Linux/云原生`
4. `DevOps 实践`

注意 `Python & Scala` 含 `&`，在 YAML 中必须加引号。分类的定义、颜色与链接 slug 在
`src/utils/articles.ts` 的 `SITE_CATEGORIES`、`categorySlugs` 中维护。

## 手工维护的页面

两个页面都是普通 Markdown 文件，直接编辑即可，顶部导航已配置好入口：

| 页面 | 文件 | 访问路径 |
| --- | --- | --- |
| 近期优质学习资料精选 | `src/pages/resources.md` | `/resources` |
| 大数据开发与运维速查手册 | `src/pages/cheatsheet.md` | `/cheatsheet` |

两个文件都使用 `src/layouts/DocLayout.astro` 作为版式，支持标题、列表、表格、代码块、引用等
Markdown 语法，样式已统一为站点暗色主题。

## 部署

推送到 `main` 分支后，GitHub Actions 会自动抓取最新内容、构建并部署到 GitHub Pages。也可以在 Actions 页面手动触发 `Deploy to GitHub Pages`。

部署地址：<https://huang2006830.github.io/github/>

定时任务使用 UTC 时间 `0 22 * * *`，即北京时间每天 06:00。

## 目录结构

```text
feeds.yaml            RSS 源配置
scripts/fetch-feeds.ts 抓取脚本
data/                 抓取生成的月度 JSON
src/config/site.ts    站点名称与描述
src/pages/resources.md  学习资料页（手工维护）
src/pages/cheatsheet.md 极客速查页（手工维护）
src/                  Astro 页面、组件与工具
.github/workflows/    GitHub Actions 部署配置
```

## 说明

本站只聚合标题、摘要和原文链接，不复制全文，版权归原作者所有。
