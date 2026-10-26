// 教学视频精选清单。
// 数据来自 B 站公开视频接口，封面、UP 主与播放量仅作展示，版权归原作者所有。
// 新增视频时补一条 VideoItem 即可，页面会自动生成卡片与筛选计数。

export type VideoCategory = 'linux' | 'container' | 'bigdata';

export interface VideoItem {
  /** B 站 BV 号 */
  id: string;
  title: string;
  /** UP 主 */
  up: string;
  upFace: string;
  /** B 站封面图公开地址 */
  cover: string;
  category: VideoCategory;
  level: string;
  /** 展示用时长 */
  duration: string;
  /** 合集集数，单集视频为 1 */
  parts: number;
  year: number;
  /** 展示用播放量 */
  play: string;
  /** 一句话推荐理由 */
  blurb: string;
  tags: string[];
}

export interface VideoCategoryMeta {
  id: 'all' | VideoCategory;
  label: string;
  /** 筛选按钮与分类徽章共用的强调色 */
  accent: string;
  chip: string;
  /** 无封面时的莫兰迪占位图 */
  placeholder: string;
}

export const VIDEO_CATEGORIES: VideoCategoryMeta[] = [
  {
    id: 'all',
    label: '全部视频',
    accent: 'emerald',
    chip: 'border-emerald-600/25 bg-emerald-600/10 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300',
    placeholder: 'ph-sage',
  },
  {
    id: 'linux',
    label: 'Linux 基础',
    accent: 'emerald',
    chip: 'border-emerald-700/25 bg-emerald-700/10 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300',
    placeholder: 'ph-sage',
  },
  {
    id: 'container',
    label: 'Docker / K8s',
    accent: 'sky',
    chip: 'border-sky-700/25 bg-sky-700/10 text-sky-800 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-300',
    placeholder: 'ph-mist',
  },
  {
    id: 'bigdata',
    label: '大数据基础',
    accent: 'violet',
    chip: 'border-violet-700/25 bg-violet-700/10 text-violet-800 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-300',
    placeholder: 'ph-lavender',
  },
];

export const VIDEOS: VideoItem[] = [
  // ── Linux 基础 ──────────────────────────────────────────────
  {
    id: 'BV1dW411M7xL',
    title: '尚硅谷 Linux 教程（千万级学习人次的经典入门课）',
    up: '尚硅谷',
    upFace: 'https://i0.hdslb.com/bfs/face/aabb00d3fa8b1526879ee5fc3875c5f543100aa2.jpg',
    cover: 'https://i2.hdslb.com/bfs/archive/ede8724598c78ea83ab87fcd6031b277c60b1dd1.jpg',
    category: 'linux',
    level: '零基础',
    duration: '21 小时',
    parts: 77,
    year: 2018,
    play: '278 万',
    blurb: '从虚拟机安装、目录结构讲到权限、进程、磁盘与 Shell，配套资料完整，适合第一次系统学 Linux。',
    tags: ['目录与权限', 'vim / Shell'],
  },
  {
    id: 'BV1n84y1i7td',
    title: '黑马程序员新版 Linux 零基础快速入门到精通',
    up: '黑马程序员',
    upFace: 'https://i0.hdslb.com/bfs/face/a71b4dd6647ddf0c813bcf74e062edab9224cb0e.jpg',
    cover: 'https://i2.hdslb.com/bfs/archive/8524e06682ebbe47ec08e922d9743a10f9632378.jpg',
    category: 'linux',
    level: '零基础',
    duration: '13 小时 21 分',
    parts: 61,
    year: 2022,
    play: '798 万',
    blurb: '覆盖系统管理、常用软件环境部署、Shell 脚本、云平台实践与大数据集群项目，播放量近 800 万。',
    tags: ['系统管理', 'Shell 脚本'],
  },
  {
    id: 'BV1Sv411r7vd',
    title: '韩顺平 一周学会 Linux（小白入门 · 通俗易懂）',
    up: '韩顺平',
    upFace: 'https://i1.hdslb.com/bfs/face/524e7989aff12d16030107bd133b284d49e46905.jpg',
    cover: 'https://i0.hdslb.com/bfs/archive/0647f0151e2550455c3d3e0d8d38f5a4c641bf78.jpg',
    category: 'linux',
    level: '零基础',
    duration: '27 小时',
    parts: 153,
    year: 2020,
    play: '502 万',
    blurb: '153 集慢节奏讲解，命令演示多、例子足，适合完全没碰过 Linux、需要有人带着敲第一遍的同学。',
    tags: ['常用命令', '边看边练'],
  },

  // ── Docker / K8s ────────────────────────────────────────────
  {
    id: 'BV1og4y1q7M4',
    title: '【狂神说 Java】Docker 最新超详细版教程',
    up: '遇见狂神说',
    upFace: 'https://i2.hdslb.com/bfs/face/83bb511365da513c55aa3d1958524f3b7db40684.jpg',
    cover: 'https://i0.hdslb.com/bfs/archive/1958527b597579cbe591ad77567833a68c3bf8ee.jpg',
    category: 'container',
    level: '入门',
    duration: '8 小时 11 分',
    parts: 40,
    year: 2020,
    play: '296 万',
    blurb: '从 Docker 历史、镜像容器命令到 Dockerfile、数据卷、网络与部署实战，40 集把常用链路讲透。',
    tags: ['镜像 / 容器', 'Dockerfile'],
  },
  {
    id: 'BV1Zn4y1X7AZ',
    title: '尚硅谷 Docker 教程 · 3 小时速通',
    up: '尚硅谷',
    upFace: 'https://i0.hdslb.com/bfs/face/aabb00d3fa8b1526879ee5fc3875c5f543100aa2.jpg',
    cover: 'https://i2.hdslb.com/bfs/archive/2744921c108d2942362089e447fbbcc4d351cb72.png',
    category: 'container',
    level: '入门',
    duration: '2 小时 44 分',
    parts: 25,
    year: 2024,
    play: '47 万',
    blurb: '2024 年速通版，用不到 3 小时建立 Docker 的整体印象，适合先跑通、再回头补细节。',
    tags: ['速通', '核心命令'],
  },
  {
    id: 'BV1THKyzBER6',
    title: '40 分钟的 Docker 实战攻略，一期视频精通 Docker',
    up: '技术爬爬虾',
    upFace: 'https://i0.hdslb.com/bfs/face/333b1b477f1ac1b40091b70afcfd4444e646a7d3.jpg',
    cover: 'https://i0.hdslb.com/bfs/archive/5ad93dcb0e25867dac2c5079ebe2e6b5a75df906.jpg',
    category: 'container',
    level: '进阶 / 复习',
    duration: '39 分钟',
    parts: 1,
    year: 2025,
    play: '72 万',
    blurb: '节奏快、信息密度高，39 分钟串起 Docker 常用功能与命令，适合复习、查漏补缺或面试前速刷。',
    tags: ['高频命令', '实战'],
  },
  {
    id: 'BV1GT4y1A756',
    title: '【尚硅谷】Kubernetes（k8s）入门到实战教程',
    up: '尚硅谷',
    upFace: 'https://i0.hdslb.com/bfs/face/aabb00d3fa8b1526879ee5fc3875c5f543100aa2.jpg',
    cover: 'https://i1.hdslb.com/bfs/archive/de61a076e8e29dcbb36cd86fc4ead0e9107e557d.png',
    category: 'container',
    level: '进阶',
    duration: '14 小时 13 分',
    parts: 64,
    year: 2020,
    play: '88 万',
    blurb: '基于 Kubernetes 1.18，从集群搭建、Pod、Service 到 Helm、持久化存储与项目部署，体系完整。',
    tags: ['集群 / Pod', 'Helm'],
  },

  // ── 大数据基础 ──────────────────────────────────────────────
  {
    id: 'BV1Qp4y1n7EN',
    title: '尚硅谷 Hadoop 教程 · 3.x 搭建到集群调优',
    up: '尚硅谷',
    upFace: 'https://i0.hdslb.com/bfs/face/aabb00d3fa8b1526879ee5fc3875c5f543100aa2.jpg',
    cover: 'https://i0.hdslb.com/bfs/archive/e54710059402982191d050f95a20ef5ca04dfc3b.jpg',
    category: 'bigdata',
    level: '入门',
    duration: '27 小时 27 分',
    parts: 178,
    year: 2021,
    play: '253 万',
    blurb: 'Hadoop 3.x 完整体系：HDFS、MapReduce、YARN 到集群搭建与调优，178 集，适合作为大数据第一门系统课。',
    tags: ['HDFS / YARN', 'MapReduce'],
  },
  {
    id: 'BV1WY4y197g7',
    title: '黑马程序员大数据入门到实战（Hadoop + Hive）',
    up: '黑马程序员',
    upFace: 'https://i0.hdslb.com/bfs/face/a71b4dd6647ddf0c813bcf74e062edab9224cb0e.jpg',
    cover: 'https://i2.hdslb.com/bfs/archive/b22e4a4c71746556ed1feffe7b30b22f7355285c.jpg',
    category: 'bigdata',
    level: '入门',
    duration: '21 小时 56 分',
    parts: 88,
    year: 2023,
    play: '115 万',
    blurb: '2023 版黑马大数据入门，Hadoop 与 Hive 为主线，带云平台实战项目，适合边看边搭环境。',
    tags: ['Hadoop', 'Hive'],
  },
  {
    id: 'BV12142167BL',
    title: 'Spark 视频教程 · Spark 3.x 新版（一套搞定大数据 Spark）',
    up: '尚硅谷',
    upFace: 'https://i0.hdslb.com/bfs/face/aabb00d3fa8b1526879ee5fc3875c5f543100aa2.jpg',
    cover: 'https://i1.hdslb.com/bfs/archive/927a62439125a9f6efe90a1a12cfdafe73b2a9f3.jpg',
    category: 'bigdata',
    level: '进阶',
    duration: '39 小时 17 分',
    parts: 157,
    year: 2024,
    play: '33 万',
    blurb: '基于 Spark 3.3，从 RDD、Spark SQL 到 Shuffle 调优与项目实战，2024 年更新，适合系统进阶。',
    tags: ['Spark SQL', '调优'],
  },
  {
    id: 'BV1ReshzoEgG',
    title: '黑马程序员 Python 数据分析全套教程（含 Linux / MySQL / pandas）',
    up: '黑马程序员',
    upFace: 'https://i0.hdslb.com/bfs/face/a71b4dd6647ddf0c813bcf74e062edab9224cb0e.jpg',
    cover: 'https://i0.hdslb.com/bfs/archive/2bd66bff96a1a3f267fb986c7ec6bf7e53805f3b.jpg',
    category: 'bigdata',
    level: '零基础',
    duration: '36 小时 9 分',
    parts: 144,
    year: 2025,
    play: '113 万',
    blurb: '2025 版数据分析全套：Linux、MySQL、NumPy、Pandas、Matplotlib 一条龙，适合补数据侧基础。',
    tags: ['pandas', '可视化'],
  },
  {
    id: 'BV1rbNAeEEzM',
    title: '大数据与人工智能导论（通识课版）· 厦大林子雨',
    up: '厦大林子雨',
    upFace: 'https://i0.hdslb.com/bfs/face/651c1a3f11a7f7f613b953b62d74cc5ffe868154.jpg',
    cover: 'https://i1.hdslb.com/bfs/archive/f01cc9099bb36bfd7da8c47f11901ed2c79bf9b0.jpg',
    category: 'bigdata',
    level: '通识',
    duration: '29 分钟',
    parts: 1,
    year: 2025,
    play: '5,275',
    blurb: '厦门大学林子雨老师的通识导论第一讲，29 分钟讲清大数据与 AI 的关系，适合学习前建立全局认知。',
    tags: ['通识', '大数据与 AI'],
  },
];

export const getCategoryMeta = (id: VideoCategory): VideoCategoryMeta =>
  VIDEO_CATEGORIES.find((category) => category.id === id) ?? VIDEO_CATEGORIES[0];

export const watchUrl = (id: string): string => `https://www.bilibili.com/video/${id}/`;
