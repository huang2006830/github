# 项目：大数据运维与开发实战站

## 目标
面向大数据运维与开发工程师，自动聚合 Python/Scala 数据开发、Spark/Flink 实战、
Linux/云原生基础设施运维与 DevOps 实践的技术文章，并维护精选学习资料与速查手册，每日自动更新。

## 技术栈
- 基于 flux（Astro + Tailwind CSS）或 feedme（React）二选一
- 数据更新：GitHub Actions + cron
- 部署：GitHub Pages（零成本静态托管）

## 内容约定
- 固定四个分类，顺序即首页筛选标签顺序：
  `Python & Scala` / `大数据生态` / `Linux/云原生` / `DevOps 实践`
- 分类定义与链接 slug 在 `src/utils/articles.ts` 维护
- 站点名称与描述在 `src/config/site.ts` 维护
- 学习资料页 `src/pages/resources.md`、速查页 `src/pages/cheatsheet.md` 可直接编辑 Markdown

## 操作规则
- 修改代码前先读 `AGENTS.md` 和 `README.md`
- 每次改动只做一件事，完成并验证后再进入下一步
- 不引入未在技术栈中声明的新框架
- 所有配置变更必须能通过本地 `npm run dev` 验证

## 完成的定义（Definition of Done）
- 页面能在本地正常渲染
- 新增 RSS 源能正确抓取并展示
- cron 表达式语义正确（UTC 时区）
- 部署后公网地址可访问且内容非空
