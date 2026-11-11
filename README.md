# MyWeb

MyWeb 是 Sikm 的双语个人研究小站，用于长期沉淀 Agent / LLM、工程实践、项目记录和少量生活切片。

当前版本采用暖纸面、全站无衬线字体（西文系统栈 + 中文 MiSans）和低饱和发丝分隔线构成的 editorial 风格：它更像一个长期维护的个人研究小站，而不是营销落地页或一次性简历页。

* 首页为单栏个人名片形态：hero（英文欢迎标题、简介、社交链接）+ Writing / Projects / Life 三个最新内容区；头像位于 Header 品牌区
* 支持中英文双语
* 支持显式浅色 / 深色主题切换
* 个人链接统一使用图标化入口，GitHub username 为 `sikm-lqs`
* 视觉基线以 `src/styles/global.css` 中的 CSS tokens 为准

## 内容频道

站点主要承载三个内容频道：

* Blog（`writing`）：技术文章、论文阅读、研究笔记与工程思考；原 Research 已合并至此
* Projects（`projects`）：开源项目与项目案例
* Life（`life`）：轻量生活记录，后续以照片墙为主

同时预留：

* Guestbook：轻量留言墙
* Links：技术资源型友链 / 资源书签

## 技术方案

当前采用静态优先方案：

* Astro
* MDX
* Tailwind CSS 4
* TypeScript
* GitHub
* Cloudflare Pages

第一版不引入数据库、后端 API、登录系统和 CMS。留言墙目前是占位入口，后续再决定存储与审核方案。

## 线上地址

当前 Cloudflare Pages 生产地址：

```text
https://myweb-649.pages.dev/
```

`main` 分支 push 后，由 Cloudflare Pages 自动构建并部署。

GitHub 仓库：`https://github.com/sikm-lqs/sikms-log`

Git 远程：`git@github.com:sikm-lqs/sikms-log.git`

部署配置在 Cloudflare Pages 控制台维护，仓库未配置 GitHub Actions 部署工作流。发布后应检查 Pages 构建状态和线上文章。

## 开发进展

已完成：

* 中英文首页
* 首页 hero + Writing / Projects / Life 单栏布局
* 显式浅色 / 深色主题切换
* 中英文 About 页面
* Blog / Projects / Life 三个内容频道
* 三类内容的列表页与详情页
* 文章阅读目录：博客和生活详情页自动读取标题；宽屏左侧吸顶，窄屏正文前折叠，滚动标示当前章节
* Guestbook / Links 中英文占位页
* 双语切换机制
* 基于 `translationKey` 的中英文内容配对规则
* 首页博客流、项目和生活内容取数逻辑
* `npm run build` 构建通过

当前状态：

* 视觉方向已定为暖色纸面、全站 sans 排版、发丝分隔线和内容优先的个人研究空间
* 已有真实技术文章，项目 / 生活内容和部分资源仍待完善
* 后续重点是补充真实内容、完善留言墙 / 友链 / 生活照片墙

## 视觉基线

当前代码中的视觉系统以 `src/styles/global.css` 为准：

* 浅色模式使用暖纸色背景，例如 `#f4efe6`、`#eae3d5`
* 深色模式使用低亮度暖黑和纸质边框色
* 全站字体为无衬线：西文用系统栈（零加载），中文用自托管 `MiSans` / `Noto Sans SC`
* 页面通过发丝分隔线、留白和轻微网格肌理建立层级，列表条目为无盒子的平面行
* 不使用强烈渐变、霓虹、粒子背景或过度装饰
* 组件应优先复用 `ArticleCard`、`ProjectCard`、`Button`、`SocialLink` 和现有 layout

## 后续开发

下一阶段优先项：

1. 补充真实文章、项目、研究、生活内容
2. 将博客栏目升级为真实合集入口，如 LeetCode 手撕、Paper Research、开源 AI 工具 / 资讯分享
3. 完善 Guestbook 轻量留言墙
4. 将 Life 页面改造成照片墙
5. 补充 Email 和其他联系方式（GitHub、Bilibili、X 已配置）
6. 增加 SEO 基础能力，如 sitemap、robots、OG 信息
7. 继续打磨移动端和视觉细节

## 文档

相关详细文档见：

* [dev-docs/MyWeb.md](dev-docs/MyWeb.md)
* [dev-docs/内容发布流程.md](dev-docs/内容发布流程.md)

## 本地开发

Node.js 要求 `>=22.12.0`。Node 构建工具类型由开发依赖 `@types/node` 提供，`tsconfig.json` 显式启用 `node` 类型。

```bash
npm install
npm run dev
```

默认地址：

```text
http://localhost:4321
```

## 构建

```bash
npm run type-check
npm test
npm run build
npm run preview
```

`npm run test:build` 会重新构建并验证生成页面中的目录链接、空目录回退和现有博客的章节锚点。

构建输出目录：

```text
dist/
```

## 发布文章

1. 在 `src/content/writing/zh/` 或 `en/` 新增 `.md` / `.mdx`，填写标题、摘要、日期、`routeSlug`、`lang`、`translationKey`。
2. 图片放入 `public/images/`；设置 `draft: false` 才会生成公开详情页和列表条目。
3. 用 `##` 划分主要章节，目录自动生成，无需手工维护；没有二级标题时回退到 `###`，没有合适标题时不显示目录。
4. 本地预览，运行类型检查、测试和构建后，提交并推送到 `main`，再检查 Pages 部署。

支持先发单语；中英文版本使用相同 `translationKey`。URL 由 `routeSlug` 决定。当前字数统计按同名 `.mdx` 读取，建议文件名与 slug 一致；`.md` 或不同文件名仍可发布，但字数统计暂不支持。
