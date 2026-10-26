---
layout: ../layouts/DocLayout.astro
title: 近期优质学习资料精选
description: 精选 Python/Scala 官方文档与经典开源书、Spark/Flink 架构与调优白皮书、Linux 排障指南、Kubernetes 与 DevOps 实践资料，全部附带官方链接。
updated: 2026-10-26
tags:
  - 官方文档
  - 架构调优
  - 运维排障
---

> **怎么用这一页**：每个条目都按「资料名 → 一句话说明 → 官方链接」组织，说明里写清了适合谁、解决什么问题。
> 建议每次只挑 1-2 个条目深读并动手验证，读完在下面补一条自己的笔记。
> 需要手工加笔记时，直接在本文件里追加同级列表项即可，格式保持一致。

## 一、Python & Scala：语言基础与数据处理

### Python

- **[Python 官方文档（简体中文）](https://docs.python.org/zh-cn/3/)** — 语言参考与标准库索引，遇到「这个函数到底怎么用」先查它，比搜博客快且准确。
- **[Python 官方教程](https://docs.python.org/zh-cn/3/tutorial/)** — 适合已有其他语言基础的人快速过一遍语法，重点是数据结构、模块、异常和类。
- **[PEP 8 代码风格指南](https://peps.python.org/pep-0008/)** — 团队协作和代码评审的底线标准，建议配合编辑器的格式化工具一起用。
- **[pandas 官方用户指南](https://pandas.pydata.org/docs/user_guide/)** — 数据清洗的核心工具，重点看索引、合并（merge/join）、分组聚合和缺失值处理。
- **[pandas 十分钟入门](https://pandas.pydata.org/docs/user_guide/10min.html)** — 快速建立 DataFrame 操作直觉，适合作为每天开工前的热身。
- **[PySpark 官方 API 参考](https://spark.apache.org/docs/latest/api/python/)** — 写 PySpark 时的第一手资料，函数签名、参数含义都以这里为准。
- **[《流畅的 Python》配套代码仓库](https://github.com/fluentpython/example-code)** — 讲解 Python 数据模型、迭代器、生成器、装饰器的高阶用法，进阶必读。
- **[mypy 类型标注速查](https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html)** — 给数据管道加类型标注，能把大量运行时错误提前到写代码阶段。

### Scala

- **[Scala 官方文档](https://docs.scala-lang.org/)** — 语言规范的权威入口，包含 Tour、指南与各版本文档。
- **[Scala 3 中文文档](https://docs.scala-lang.org/zh-cn/)** — 官方中文站点，适合对照英文文档确认概念。
- **[A Tour of Scala（Scala 之旅）](https://docs.scala-lang.org/tour/tour-of-scala.html)** — 一小时过完 case class、模式匹配、隐式/上下文参数、集合等核心特性。
- **[Scala 标准库 API](https://www.scala-lang.org/api/current/)** — 查集合操作方法（map / flatMap / fold / groupBy）的签名和示例。
- **[sbt 官方文档](https://www.scala-sbt.org/1.x/docs/)** — Scala 项目构建、依赖管理与多模块组织，部署 Spark/Flink 项目绕不开。
- **[Spark Scala API](https://spark.apache.org/docs/latest/api/scala/org/apache/spark/sql/package.html)** — 写 Scala 版 Spark 作业时的类和包索引。

## 二、Spark：核心架构与调优

- **[Spark 官方文档](https://spark.apache.org/docs/latest/)** — 总入口，包含快速上手、集群模式、SQL、Streaming 全部章节。
- **[Spark 调优指南（Tuning Guide）](https://spark.apache.org/docs/latest/tuning.html)** — 内存管理、序列化、分区策略、广播变量。调优遇到瓶颈时第一个翻的页面。
- **[Spark SQL 性能调优](https://spark.apache.org/docs/latest/sql-performance-tuning.html)** — 缓存、Join 策略、AQE、动态分区裁剪等关键开关与原理说明。
- **[Spark 配置参数全集](https://spark.apache.org/docs/latest/configuration.html)** — `spark.sql.*` / `spark.executor.*` 的真实含义，排查「参数到底生效没」必查。
- **[SPARK-23128：自适应查询执行（AQE）设计](https://issues.apache.org/jira/browse/SPARK-23128)** — AQE 的原始设计文档，理解运行时合并分区、动态调整 Join 策略的来龙去脉。
- **[《Spark: The Definitive Guide》官方示例代码](https://github.com/databricks/Spark-The-Definitive-Guide)** — 配套数据集与全部示例，适合照着把每个算子跑一遍。
- **[Apache Spark 源码](https://github.com/apache/spark)** — 读 `sql/core` 下的 Catalyst 与执行计划相关代码，是突破「只会调参」的关键一步。

> **阅读顺序建议**：先看调优指南建立直觉 → 再用 SQL 性能调优页面对照自己集群的参数 → 最后进源码看 Catalyst 与 AQE 的实现。

## 三、Flink：实时计算、状态与容错

- **[Flink 官方文档](https://nightlies.apache.org/flink/flink-docs-stable/)** — 稳定版文档，DataStream / Table API / 部署 / 运维全部覆盖。
- **[Flink 官网](https://flink.apache.org/)** — 版本发布说明、社区动态与中文入口。
- **[有状态流处理（Stateful Stream Processing）](https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/stateful-stream-processing/)** — Checkpoint、Savepoint、状态后端与 Exactly-once 的原理底座，务必读懂。
- **[反压监控（Back Pressure）](https://nightlies.apache.org/flink/flink-docs-stable/docs/ops/monitoring/back_pressure/)** — 线上作业吞吐骤降时，判断是不是反压、卡在哪个算子的标准流程。
- **[Flink 配置参数](https://nightlies.apache.org/flink/flink-docs-stable/docs/deployment/config/)** — 内存模型（TaskManager / Managed Memory）、并行度、重启策略的配置依据。
- **[Apache Flink 源码](https://github.com/apache/flink)** — 从 `flink-runtime` 的 checkpoint 机制入手，配合官方文档看效果最好。

## 四、Linux 运维与故障排查

- **[The Linux Command Line（中文版）](https://billie66.github.io/TLCL/)** — 免费的经典命令行教程，从文件权限、管道重定向讲到 Shell 脚本，零基础友好。
- **[Linux man-pages 在线版](https://man7.org/linux/man-pages/)** — 所有系统调用与命令的权威手册，`man` 命令的网页版，排障时的最终依据。
- **[Brendan Gregg：Linux 性能分析工具图谱](https://www.brendangregg.com/linuxperf.html)** — CPU、内存、IO、网络四类瓶颈该用哪个工具观测，一张图理清排查路径。
- **[Linux 内核官方文档](https://www.kernel.org/doc/html/latest/)** — 深入 cgroup、OOM Killer、网络栈、文件系统时的第一手资料。
- **[Arch Wiki](https://wiki.archlinux.org/)** — 不是 Arch 用户也值得收藏：服务配置、内核参数、排障步骤写得极细，是公认的 Linux 排障百科。
- **[鸟哥的 Linux 私房菜](https://linux.vbird.org/)** — 中文体系化教程，适合补齐磁盘管理、权限、进程与服务管理等基础。

## 五、Kubernetes 与云原生

- **[Kubernetes 官方文档（中文）](https://kubernetes.io/zh-cn/docs/)** — 中文翻译质量高，概念、任务、参考三部分结构清晰。
- **[Kubernetes 排障指南（Troubleshooting）](https://kubernetes.io/docs/tasks/debug/)** — Pod 起不来、Service 不通、节点 NotReady 的官方排查顺序。
- **[kubectl 速查表](https://kubernetes.io/docs/reference/kubectl/quick-reference/)** — 高频命令与参数，配合本站「极客速查」页一起用。
- **[CNCF 云原生全景图](https://landscape.cncf.io/)** — 搞清可观测性、CI/CD、服务网格等领域的工具选型边界。
- **[Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way)** — 手工从证书、etcd、控制面搭起一个集群，搭完对 K8s 的理解会上一个台阶。

## 六、DevOps 与可观测性

- **[Google SRE 手册](https://sre.google/sre-book/table-of-contents/)** — SLO/SLI、错误预算、on-call、事故复盘的行业标准读本，免费在线。
- **[Google SRE 工作手册](https://sre.google/workbook/table-of-contents/)** — 偏落地实践：如何写 runbook、如何做容量规划与发布管理。
- **[The Twelve-Factor App（中文）](https://12factor.net/zh_cn/)** — 配置外置、无状态进程、日志作为事件流，容器化改造的检查清单。
- **[Pro Git（中文版）](https://git-scm.com/book/zh/v2)** — 分支模型、rebase、reset 的原理，团队协作与回滚的基础。
- **[Docker 官方文档](https://docs.docker.com/)** — 镜像分层、网络模式、资源限制与 Compose 的权威说明。
- **[Prometheus 官方文档](https://prometheus.io/docs/introduction/overview/)** — 指标采集、PromQL、告警规则，云原生监控的事实标准。
- **[Grafana 官方文档](https://grafana.com/docs/)** — 看板与告警可视化，配合 Prometheus 做集群监控。

## 七、大数据组件：Hadoop / Hive / Kafka

- **[Hadoop 官方文档](https://hadoop.apache.org/docs/stable/)** — HDFS、YARN、MapReduce 的配置与命令参考。
- **[HDFS 架构设计](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html)** — NameNode/DataNode、Block 与副本、读写流程的原始设计说明。
- **[YARN 架构](https://hadoop.apache.org/docs/stable/hadoop-yarn/hadoop-yarn-site/YARN.html)** — ResourceManager、NodeManager、Container 与调度器的工作方式。
- **[Apache Hive 官网](https://hive.apache.org/)** — Hive SQL、Metastore、执行引擎的入口文档。
- **[Apache Kafka 官方文档](https://kafka.apache.org/documentation/)** — 分区、副本、ISR、消费者位移与 Exactly-once 语义。
- **[美团技术团队博客](https://tech.meituan.com/)** — 中文互联网里少见的、把大数据架构与调优讲到实现细节的团队博客。

---

## 我的补充笔记

<!-- 在这里往下追加你自己的资料与读书笔记，保持「- **[名称](链接)** — 说明」的格式即可。 -->

- **[本站极客速查手册](/cheatsheet)** — 命令与代码片段速查，配合上面的文档使用效率更高。
