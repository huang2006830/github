---
layout: ../layouts/DocLayout.astro
title: 大数据开发与运维速查手册
description: Python/PySpark 与 Scala 代码片段、Linux/Docker/Kubernetes 排障命令、Hadoop/Spark/Hive/Kafka 维护命令的速查手册。
updated: 2026-10-26
tags:
  - 代码片段
  - 排障命令
  - 集群维护
---

> **使用说明**：本页按「开发 → 系统 → 集群」的顺序组织，全部命令可直接复制。
> 带 ⚠️ 标记的是有破坏性的操作，执行前务必确认目标集群与路径。
> 新增条目时保持「表格 + 代码块」的层级结构，便于以后检索。

## 目录

1. [Python 数据开发片段](#python-数据开发片段)
2. [Scala 与 PySpark 作业片段](#scala-与-pyspark-作业片段)
3. [Linux 排障命令](#linux-排障命令)
4. [Docker 容器排查](#docker-容器排查)
5. [Kubernetes 集群排查](#kubernetes-集群排查)
6. [Hadoop：HDFS 与 YARN](#hadoophdfs-与-yarn)
7. [Spark 提交与调优](#spark-提交与调优)
8. [Hive 与 Kafka 维护](#hive-与-kafka-维护)

## Python 数据开发片段

### 环境与依赖

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pip freeze > requirements.txt
python -m py_compile etl.py          # 语法自检
```

### pandas 读取与清洗

```python
import pandas as pd

df = pd.read_csv(
    "logs.csv",
    sep=",",
    dtype={"user_id": "string", "status": "Int32"},
    parse_dates=["ts"],
    na_values=["", "NULL", "-"],
)

# 分块读大文件，避免一次性吃满内存
for chunk in pd.read_csv("big.csv", chunksize=500_000):
    chunk.groupby("shop_id", as_index=False)["amount"].sum().to_parquet("part.parquet", append=True)

# 常用清洗与聚合
clean = (
    df.dropna(subset=["user_id"])
      .assign(day=lambda d: d["ts"].dt.date)
      .groupby(["day", "shop_id"], as_index=False)
      .agg(uv=("user_id", "nunique"), gmv=("amount", "sum"))
      .sort_values("gmv", ascending=False)
)
```

### 日志与重试

```python
import logging, time
from functools import wraps

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)

def retry(times=3, delay=2):
    def deco(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            for i in range(1, times + 1):
                try:
                    return fn(*args, **kwargs)
                except Exception as exc:
                    if i == times:
                        raise
                    logging.warning("第 %s 次失败：%s，%ss 后重试", i, exc, delay)
                    time.sleep(delay * i)
        return wrapper
    return deco
```

## Scala 与 PySpark 作业片段

### PySpark 作业骨架

```python
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

spark = (
    SparkSession.builder
    .appName("shop_gmv_etl")
    .config("spark.sql.shuffle.partitions", "400")
    .config("spark.sql.adaptive.enabled", "true")
    .enableHiveSupport()
    .getOrCreate()
)

df = spark.read.parquet("hdfs:///warehouse/ods/orders/dt=2026-10-26")

result = (
    df.where((F.col("status") == "PAID") & (F.col("amount") > 0))
      .groupBy("shop_id")
      .agg(
          F.countDistinct("user_id").alias("uv"),
          F.sum("amount").alias("gmv"),
      )
      .orderBy(F.desc("gmv"))
      .limit(1000)
)

result.write.mode("overwrite").parquet("hdfs:///warehouse/ads/shop_gmv")
spark.stop()
```

### Scala 版同构作业

```scala
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions._

val spark = SparkSession.builder()
  .appName("shop_gmv_etl")
  .config("spark.sql.adaptive.enabled", "true")
  .enableHiveSupport()
  .getOrCreate()

val df = spark.read.parquet("hdfs:///warehouse/ods/orders")

val result = df
  .filter(col("status") === "PAID")
  .groupBy("shop_id")
  .agg(countDistinct("user_id").as("uv"), sum("amount").as("gmv"))
  .orderBy(desc("gmv"))
  .limit(1000)

result.write.mode("overwrite").parquet("hdfs:///warehouse/ads/shop_gmv")
spark.stop()
```

### sbt 常用命令

```bash
sbt clean compile          # 清理并编译
sbt "runMain com.example.Job"   # 本地运行主类
sbt package                # 打 jar，输出在 target/scala-x.x/
sbt assembly               # 打 fat jar，需 sbt-assembly 插件
sbt dependencyTree         # 排查依赖冲突（Spark 集群上是高频问题）
```

## Linux 排障命令

### CPU 与负载

| 命令 | 用途 |
| --- | --- |
| `uptime` | 看 1/5/15 分钟平均负载，和核数对比判断是否过载 |
| `top` 或 `htop` | 实时看进程 CPU、内存占用，`P` 按 CPU 排序 |
| `mpstat -P ALL 1` | 分核 CPU 使用率，判断是否单核打满 |
| `pidstat -p <pid> -u 1` | 跟踪单个进程的 CPU 使用 |
| `pidstat -p <pid> -w 1` | 上下文切换次数，频繁切换说明锁竞争或线程过多 |

### 内存与 OOM

| 命令 | 用途 |
| --- | --- |
| `free -h` | 整体内存与 buff/cache 情况 |
| `vmstat 1 5` | 看 `si/so` 是否在换页，`r` 队列长度是否过高 |
| `cat /proc/<pid>/status \| grep -i vm` | 单进程内存明细 |
| `dmesg -T \| grep -i -E "oom\|killed process"` | 确认是否被 OOM Killer 干掉 |
| `pmap -x <pid> \| sort -k3 -n -r \| head` | 按内存排序查看进程内存段 |

### 磁盘与文件

| 命令 | 用途 |
| --- | --- |
| `df -h` | 查看各分区使用率 |
| `df -i` | 查看 inode 使用率，`No space left` 有时是 inode 耗尽 |
| `du -sh * \| sort -h` | 逐目录统计占用 |
| `find /data -type f -size +1G -exec ls -lh {} +` | 找大文件 |
| `lsof \| grep deleted` | 文件已删除但被进程占用，空间不释放的原因 |
| `ncdu /data` | 交互式磁盘占用分析（需安装） |

### 网络与端口

| 命令 | 用途 |
| --- | --- |
| `ss -lntp` | 查看监听端口与对应进程 |
| `ss -tanp \| grep :8080` | 查看某端口的连接状态 |
| `ss -s` | 连接数汇总，排查 TIME_WAIT 过多 |
| `lsof -i:8080` | 谁占用了 8080 端口 |
| `tcpdump -i any port 8080 -w a.pcap` | 抓包，配合 Wireshark 分析 |
| `ping` / `traceroute` / `mtr` | 连通性与链路质量 |
| `netstat -s \| grep -i retrans` | 重传统计，判断网络质量 |

### 进程、日志与服务

| 命令 | 用途 |
| --- | --- |
| `ps -ef \| grep java` | 找 Java 进程，确认启动参数 |
| `jps -lvm` | 快速列出本机 JVM 进程与主类 |
| `cat /proc/<pid>/limits` | 进程实际生效的句柄数上限（比 `ulimit -n` 准） |
| `ls /proc/<pid>/fd \| wc -l` | 当前打开的句柄数 |
| `journalctl -u <service> -f --since "10 min ago"` | 跟随系统服务日志 |
| `tail -f app.log \| grep -i -E "error\|exception"` | 实时过滤异常 |
| `crontab -l` | 查看当前用户定时任务 |
| `timedatectl` / `chronyc sources` | 时间同步状态，集群时钟漂移会引发诡异故障 |

## Docker 容器排查

| 命令 | 用途 |
| --- | --- |
| `docker ps -a` | 含已退出的容器，看 `STATUS` 里的退出码 |
| `docker logs -f --tail 200 <c>` | 跟随日志 |
| `docker inspect <c> --format '{{.State.ExitCode}}'` | 精确取退出码与状态 |
| `docker stats` | 实时看 CPU/内存/网络 |
| `docker exec -it <c> sh` | 进容器排查（无 bash 时用 sh） |
| `docker run --rm -it --entrypoint sh <image>` | 容器起不来时，直接进镜像查原因 |
| `docker cp <c>:/path/app.log ./` | 把容器内文件拷出来 |
| `docker inspect <c> --format '{{json .NetworkSettings.Networks}}'` | 查容器 IP 与网络 |
| `docker system df` | 镜像/容器/卷占用统计 |
| `docker system prune -af --volumes` | ⚠️ 清理所有未使用资源，生产慎用 |

```bash
# 容器频繁重启时的标准排查顺序
docker ps -a | grep <name>
docker inspect <c> --format '{{.State.ExitCode}} {{.State.Error}}'
docker logs --tail 100 <c>
docker exec -it <c> env | grep -i -E "JAVA|SPARK|PATH"
```

## Kubernetes 集群排查

### 上下文与资源查看

| 命令 | 用途 |
| --- | --- |
| `kubectl config get-contexts` | 列出集群上下文，避免改错集群 |
| `kubectl get pods -A -o wide` | 全命名空间 Pod、节点、IP 一览 |
| `kubectl get events -A --sort-by=.lastTimestamp` | 按时间看最近事件，定位调度/拉镜像失败 |
| `kubectl describe pod <p> -n <ns>` | 看 `Events` 与容器状态，排障第一步 |
| `kubectl top nodes` / `kubectl top pods -A` | 节点与 Pod 资源占用（需 metrics-server） |
| `kubectl get nodes -o wide` | 节点状态、内核版本、容器运行时 |

### 日志与进入容器

| 命令 | 用途 |
| --- | --- |
| `kubectl logs -f --tail=200 <p> -n <ns>` | 跟随当前容器日志 |
| `kubectl logs --previous <p> -n <ns>` | 看上一次崩溃的日志，`CrashLoopBackOff` 必用 |
| `kubectl logs <p> -c <container>` | 多容器 Pod 指定容器 |
| `kubectl exec -it <p> -n <ns> -- sh` | 进入容器 |
| `kubectl cp <ns>/<p>:/path/log ./log` | 拷贝容器内文件 |

### 发布、资源与调度

| 命令 | 用途 |
| --- | --- |
| `kubectl rollout status deploy/<d> -n <ns>` | 等待发布完成 |
| `kubectl rollout undo deploy/<d> -n <ns>` | 回滚到上一版本 |
| `kubectl rollout restart deploy/<d> -n <ns>` | 滚动重启 |
| `kubectl get pv,pvc -A` | 存储卷状态，排查 `Pending` 的 PVC |
| `kubectl describe node <node>` | 看节点资源分配与 `Allocated resources` |
| `kubectl cordon <node>` / `kubectl drain <node> --ignore-daemonsets --delete-emptydir-data` | ⚠️ 节点维护前摘流与驱逐 |
| `kubectl uncordon <node>` | 维护完成后恢复调度 |
| `kubectl auth can-i --list -n <ns>` | 确认当前账号权限，排查 403 |
| `kubectl explain pod.spec.containers.resources` | 命令行查字段含义 |

```bash
# Pod 反复重启的四步定位
kubectl describe pod <p> -n <ns> | sed -n '/Events/,$p'
kubectl logs --previous --tail=100 <p> -n <ns>
kubectl get pod <p> -n <ns> -o jsonpath='{.status.containerStatuses[*].lastState}'
kubectl get events -n <ns> --sort-by=.lastTimestamp | tail -20
```

## Hadoop：HDFS 与 YARN

### HDFS 常用操作

| 命令 | 用途 |
| --- | --- |
| `hdfs dfs -ls -h /warehouse` | 列目录并显示人类可读大小 |
| `hdfs dfs -du -s -h /warehouse/ods` | 统计目录总占用 |
| `hdfs dfs -count -q /warehouse/ods` | 配额与文件数统计 |
| `hdfs dfsadmin -report` | 集群容量、DataNode 存活与坏块汇总 |
| `hdfs fsck /warehouse -files -blocks -locations` | 检查文件与块状态，排查副本不足 |
| `hdfs fsck /path -delete` | ⚠️ 删除损坏块对应的文件 |
| `hdfs dfsadmin -safemode get` | 查看是否处于安全模式 |
| `hdfs dfsadmin -safemode leave` | ⚠️ 退出安全模式（确认 NameNode 已就绪） |
| `hdfs dfsadmin -refreshNodes` | 刷新节点白名单/黑名单配置 |
| `hdfs balancer -threshold 10` | 触发数据均衡，阈值越小越激进 |

### YARN 作业管理

| 命令 | 用途 |
| --- | --- |
| `yarn application -list -appStates ALL` | 查看所有作业及状态 |
| `yarn application -status <appId>` | 查看单个作业进度与诊断信息 |
| `yarn application -kill <appId>` | ⚠️ 杀掉作业 |
| `yarn logs -applicationId <appId> > app.log` | 导出作业全量日志 |
| `yarn queue -status default` | 队列资源使用情况 |
| `yarn node -list -all` | NodeManager 状态 |
| `mapred job -list` | 查看 MapReduce 作业列表 |

## Spark 提交与调优

### spark-submit 模板

```bash
spark-submit \
  --master yarn \
  --deploy-mode cluster \
  --queue root.default \
  --class com.example.ShopGmvEtl \
  --num-executors 20 \
  --executor-cores 2 \
  --executor-memory 4g \
  --conf spark.executor.memoryOverhead=1g \
  --conf spark.sql.shuffle.partitions=400 \
  --conf spark.sql.adaptive.enabled=true \
  --conf spark.serializer=org.apache.spark.serializer.KryoSerializer \
  --conf spark.dynamicAllocation.enabled=false \
  app.jar \
  --dt 2026-10-26
```

### 高频调优参数

| 参数 | 说明 |
| --- | --- |
| `spark.sql.adaptive.enabled=true` | 开启 AQE，运行时合并小分区、调整 Join 策略 |
| `spark.sql.adaptive.skewJoin.enabled=true` | 处理数据倾斜导致的少数超大分区 |
| `spark.sql.adaptive.coalescePartitions.enabled=true` | Shuffle 后自动合并分区，减少小文件 |
| `spark.sql.autoBroadcastJoinThreshold=10485760` | 小表广播阈值（10MB），大表慎调 |
| `spark.sql.shuffle.partitions=400` | Shuffle 分区数，建议为总核数的 2-3 倍 |
| `spark.executor.memoryOverhead` | 堆外内存，容器被 YARN 杀（143/137）时优先排查 |
| `spark.speculation=true` | 慢任务推测执行，长尾明显时开启 |
| `spark.memory.fraction=0.6` | 执行与存储内存占比，缓存密集作业可上调 |

### 日志与历史服务

```bash
yarn logs -applicationId application_xxx_0001 | grep -A 30 "Exception"
start-history-server.sh          # 启动 Spark History Server，默认 18080
grep -E "FetchFailed|OutOfMemory|Container killed" -r /var/log/spark/ | tail
```

## Hive 与 Kafka 维护

### Hive

```bash
beeline -u jdbc:hive2://hive-server:10000 -n hive
```

| 命令 | 用途 |
| --- | --- |
| `SHOW PARTITIONS ods.orders;` | 查看分区 |
| `MSCK REPAIR TABLE ods.orders;` | 修复元数据里缺失的分区 |
| `ANALYZE TABLE ods.orders COMPUTE STATISTICS;` | 收集统计信息，优化执行计划 |
| `SET hive.exec.dynamic.partition.mode=nonstrict;` | 开启动态分区 |
| `DESC FORMATTED ods.orders;` | 查看表存储格式、位置与参数 |

### Kafka

| 命令 | 用途 |
| --- | --- |
| `kafka-topics.sh --bootstrap-server kafka:9092 --list` | 列出所有 topic |
| `kafka-topics.sh --bootstrap-server kafka:9092 --describe --topic <t>` | 查看分区、副本与 ISR |
| `kafka-consumer-groups.sh --bootstrap-server kafka:9092 --describe --group <g>` | 消费组 LAG 明细 |
| `kafka-consumer-groups.sh --bootstrap-server kafka:9092 --group <g> --reset-offsets --to-earliest --topic <t> --execute` | ⚠️ 重置消费位点，需先停消费者 |
| `kafka-console-consumer.sh --bootstrap-server kafka:9092 --topic <t> --from-beginning --max-messages 10` | 抽样查看消息 |
| `kafka-run-class.sh kafka.tools.GetOffsetShell --bootstrap-server kafka:9092 --topic <t>` | 查看各分区最新 offset |

---

> **排障通用顺序**：先看「是不是资源问题」→ 再看「是不是配置问题」→ 最后才怀疑代码。
> 任何改动前先记录当前状态，改动后用同一组命令复测，才能证明改动真的有效。
