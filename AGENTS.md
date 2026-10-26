# 项目：大数据学习资源聚合站

## 目标
为大数据技术专业学生自动聚合技术文章、招聘信息和行业动态，每日自动更新。

## 技术栈
- 基于 flux（Astro + Tailwind CSS）或 feedme（React）二选一
- 数据更新：GitHub Actions + cron
- 部署：GitHub Pages（零成本静态托管）

## 操作规则
- 修改代码前先读 AGENTS.md 和 README
- 每次改动只做一件事，完成并验证后再进入下一步
- 不引入未在技术栈中声明的新框架
- 所有配置变更必须能通过本地 `npm run dev` 验证

## 完成的定义（Definition of Done）
- 页面能在本地正常渲染
- 新增 RSS 源能正确抓取并展示
- cron 表达式语义正确（UTC 时区）
- 部署后公网地址可访问且内容非空