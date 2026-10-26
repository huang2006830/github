# 大数据技术学习站

面向大数据技术专业学生的资源聚合站，每天自动收集大数据、数据科学与数据工程领域的技术文章、行业动态和学习资源。

## 功能

- 自动聚合 RSS 源，每日更新
- 按分类、来源、内容类型筛选
- 客户端全文搜索
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
npm run dev           # 启动开发服务器，默认 http://localhost:4321/GitHub
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
    categories: [Big Data, Data Science]
```

分类的中文显示在 `src/utils/articles.ts` 的 `categoryLabels` 中维护。

## 部署

推送到 `main` 分支后，GitHub Actions 会自动抓取最新内容、构建并部署到 GitHub Pages。也可以在 Actions 页面手动触发 `Deploy to GitHub Pages`。

部署地址：<https://huang2006830.github.io/GitHub/>

定时任务使用 UTC 时间 `0 22 * * *`，即北京时间每天 06:00。

## 目录结构

```text
feeds.yaml            RSS 源配置
scripts/fetch-feeds.ts 抓取脚本
data/                 抓取生成的月度 JSON
src/                  Astro 页面、组件与工具
.github/workflows/    GitHub Actions 部署配置
```

## 说明

本站只聚合标题、摘要和原文链接，不复制全文，版权归原作者所有。
