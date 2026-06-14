# AGENTS.md

buymeone.beer — 创作者打赏页面，类似 Buy Me a Coffee。纯静态站点，无后端。

## 快速开始

```bash
npm install          # 安装依赖
npm run dev          # 开发服务器 → localhost:4321
npm run build        # 构建静态站点 → dist/
npm run preview      # 本地预览构建结果
npm run lint         # ESLint 检查
npm run lint:fix     # ESLint 自动修复
npm run format       # Prettier 格式化
npm run check        # Astro 类型检查
```

## 技术栈

| 层面 | 选型 | 说明 |
|------|------|------|
| 框架 | Astro 5 | 默认零 JS 输出，纯静态 HTML |
| 语言 | TypeScript | strict 模式，继承 `astro/tsconfigs/strict` |
| 样式 | 纯 CSS | 无 Tailwind，样式写在组件 `<style>` 块内（自动 scoped） |
| 部署 | nginx | 构建产物 `dist/` 直接由 nginx 伺服 |

唯一依赖：`astro ^5.7.10`（见 `package.json`）

## 项目结构

```
buymeone.beer/
├── astro.config.mjs          # Astro 配置（site URL、build format、devToolbar）
├── package.json               # 项目元信息和脚本
├── tsconfig.json              # TypeScript 配置（extends astro strict）
├── public/
│   ├── assets/
│   │   ├── avatar.jpg           # 创作者头像（默认）
│   │   ├── beer_mug.png         # 啤酒杯图片（banner 图标）
│   │   ├── beer_mug_color.svg   # 彩色啤酒杯 SVG（favicon）
│   │   ├── CNY.svg              # 各币种图标
│   │   ├── EUR.svg
│   │   ├── GBP.svg
│   │   ├── RUB.svg
│   │   └── USD.svg
│   └── robots.txt
└── src/
    ├── config.ts              # 站点配置（创作者信息、币种列表）
    ├── styles/
    │   └── global.css         # 全局 reset + CSS 变量定义（:root）
    ├── layouts/
    │   └── Base.astro         # HTML 骨架布局（<html>、<head>、<body>）
    ├── components/
    │   └── TipCard.astro      # 核心组件：打赏卡片
    └── pages/
        └── index.astro        # 唯一页面，组装 Base 布局 + TipCard + Footer
```

### 构建产物

```
dist/
└── index.html                 # build format: 'file'，生成独立 HTML 文件
```

## 站点配置（config.ts）

所有可自定义项集中在此文件：

```typescript
export const creator = {
  name: 'Someone',              // 创作者名称
  avatar: '/assets/avatar.jpg', // 头像路径
  links: ['https://somewhere'], // 链接列表，字符串即 URL，同时作为显示文本
};

export const currencies = {
  USD: { enabled: true, icon: '/assets/USD.svg' },
  CNY: { enabled: true, icon: '/assets/CNY.svg' },
  // 注释掉某行即禁用该币种
} as const;
```

## 页面层级关系

```
body                          # global.css: flex 纵向居中，min-height: 100vh
  ├─ <main>                   # index.astro: max-width 680px，水平居中
  │    ├─ .banner             # 标题 h1，渐变动画文字，含啤酒杯图标
  │    └─ .tip-card           # TipCard.astro: 白色卡片，圆角阴影
  │         ├─ .header        # 顶部区域：创作者头像 + 名称 + 链接
  │         ├─ .currency-toggle  # 币种切换按钮栏（flex-wrap 自动换行）
  │         ├─ .amounts       # 预设金额按钮（3 列 grid）
  │         ├─ .custom-amount # 自定义金额输入框
  │         ├─ .message-field # 留言文本框
  │         └─ .submit-btn    # 支持按钮（渐变动画，无支付功能）
  └─ .footer                  # 绝对定位底部，版权信息，主题色
```

## TipCard 组件接口

```typescript
interface Props {
  amounts?: number[];    // 预设金额按钮，默认 [3, 5, 10]
  name?: string;         // 创作者名称
  avatar?: string;       // 头像路径
  links?: string[];      // 链接 URL 列表，同时作为显示文本
}
```

## CSS 设计系统

全局变量定义在 `src/styles/global.css` 的 `:root` 中：

| 变量 | 值 | 用途 |
|------|-----|------|
| `--color-bg` | `#faf8f5` | 页面背景色 |
| `--color-surface` | `#ffffff` | 卡片背景色 |
| `--color-text` | `#1a1a1a` | 主文字颜色 |
| `--color-text-secondary` | `#666` | 次要文字颜色 |
| `--color-accent` | `#f5a623` | 主题色（橙黄） |
| `--color-accent-hover` | `#e09515` | 主题色悬停态 |
| `--color-accent-active-bg` | `#fef7e8` | 选中态背景 |
| `--color-border` | `#e8e4df` | 边框颜色 |
| `--color-beer` | `#f5c542` | 啤酒色（渐变用） |
| `--radius` | `12px` | 卡片圆角 |
| `--shadow` | `0 2px 8px rgba(0,0,0,0.06)` | 卡片阴影 |

### 动画

- `.banner`：三色渐变文字动画（`gradient-shift`，5s 循环）
- `.submit-btn`：同款渐变背景动画，hover 通过 `filter: brightness()` 变暗

## 响应式设计

- `.tip-card`：`padding: 2rem clamp(1rem, 4vw, 2rem)` 窄屏自适应
- `<main>`：`padding: 1rem clamp(0.75rem, 4vw, 2rem) 3rem`
- `.currency-toggle`：`flex-wrap: wrap`，币种过多时自动换行
- `.banner`：`font-size: clamp(1.5rem, 8vw, 3rem)`，图标 `clamp(32px, 8vw, 48px)`

## 交互脚本逻辑（TipCard.astro `<script>`）

- 金额按钮点击 → 填充自定义输入框 + 更新按钮文本
- 自定义输入 → 仅允许正整数（小数点自动截断，<1 自动清空）
- 币种切换 → 同步更新所有 `.current-currency-icon` 的 src 和 alt
- 支持单币种模式（无 toggle，fallback 从按钮文本提取币种代码）

## Astro 配置要点

- `site: 'https://buymeone.beer'` — 用于生成绝对 URL
- `build.format: 'file'` — 每页生成独立 `.html` 文件
- `devToolbar.enabled: false` — 关闭开发工具栏

## 开发规范

- **样式**：全局变量放 `global.css`，组件样式用 scoped `<style>` 块
- **组件**：使用 `.astro` 文件，不引入 React/Vue 等 JSX 框架
- **注释**：不主动添加代码注释，除非明确需要
- **配置**：所有站点可配置项集中到 `config.ts`

## 部署（VPS + nginx）

构建后将 `dist/` 目录部署到服务器。nginx 配置参考：

## 注意事项

- Astro 的 `---` frontmatter 围栏必须在 `.astro` 文件最开头，前面不能有空行
- 当前**无支付功能** — `TipCard` 的提交按钮是 UI 占位，接入支付时需修改此处
- npm registry 偶尔超时（尤其 WSL 环境），失败时重试即可
