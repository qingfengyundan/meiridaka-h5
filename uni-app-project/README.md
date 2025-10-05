# 每日打卡 - 培养自律好习惯的应用

## 项目简介

每日打卡是一款帮助用户培养自律好习惯的跨平台应用，支持微信小程序、H5、iOS和Android多个平台。

## 功能特色

- 📅 **任务管理** - 创建和管理每日、每周、每月任务
- 📊 **数据统计** - 详细的完成率和进度分析
- 🎁 **积分商城** - 通过完成任务获得积分兑换奖励
- 👨‍👩‍👧‍👦 **家长模式** - 家长可以监督和管理孩子的任务
- 🔔 **智能提醒** - 自定义提醒时间和方式
- 🎨 **精美界面** - 现代化的UI设计和流畅的交互体验

## 技术栈

- **框架**: uni-app (Vue 3)
- **样式**: SCSS + rpx响应式单位
- **存储**: 本地存储 + 工具类封装
- **权限**: 基于角色的权限管理系统

## 快速开始

### 环境要求

- Node.js 14+
- HBuilderX (推荐) 或 Vue CLI
- 微信开发者工具 (用于小程序开发)
- Xcode (用于iOS开发)
- Android Studio (用于Android开发)

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# H5开发
npm run dev:h5

# 微信小程序开发
npm run dev:mp-weixin

# iOS开发
npm run dev:app-ios

# Android开发
npm run dev:app-android
```

### 生产构建

使用构建脚本：

```bash
# 构建所有平台
./build.sh all

# 构建特定平台
./build.sh weixin    # 微信小程序
./build.sh h5        # H5版本
./build.sh ios       # iOS版本
./build.sh android   # Android版本

# 清理构建文件
./build.sh clean
```

或使用npm命令：

```bash
# 构建微信小程序
npm run build:mp-weixin

# 构建H5版本
npm run build:h5

# 构建iOS版本
npm run build:app-ios

# 构建Android版本
npm run build:app-android
```

## 项目结构

```
uni-app-project/
├── App.vue                 # 应用入口
├── manifest.json          # 应用配置
├── pages.json             # 页面配置
├── build.sh               # 构建脚本
├── package.json           # 项目依赖
├── project.config.json    # 微信小程序配置
├── sitemap.json          # 小程序索引配置
├── common/
│   └── common.scss        # 公共样式
├── pages/                 # 页面目录
│   ├── index/            # 首页
│   ├── tasks/            # 任务管理
│   ├── stats/            # 数据统计
│   ├── profile/          # 个人中心
│   ├── parent/           # 家长模式
│   └── shop/             # 积分商城
└── utils/                # 工具类
    ├── storage.js        # 存储工具
    └── permission.js     # 权限管理
```

## 📱 部署指南

### 微信小程序
1. 构建项目：`npm run build:mp-weixin`
2. 使用微信开发者工具打开 `dist/build/mp-weixin` 目录
3. 配置小程序信息并上传审核

### H5版本 - 免费部署平台

#### 🌟 推荐平台

**1. Vercel (强烈推荐) 🌟**

**快速部署：**
```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 一键部署（推荐）
./deploy-vercel.sh

# 或者使用通用脚本
./deploy.sh vercel
```

**特性：**
- ✅ 完全免费，无限制
- ✅ 自动HTTPS和全球CDN
- ✅ 支持自定义域名
- ✅ Git集成，自动部署
- ✅ 预览部署功能
- ✅ 性能监控和分析

**配置文件：**
- `vercel.json` - Vercel部署配置
- `VERCEL_DEPLOY.md` - 详细部署指南

**2. Netlify**
```bash
# 安装CLI
npm i -g netlify-cli

# 一键部署
./deploy.sh netlify
```
- ✅ 免费额度很大
- ✅ 表单处理功能
- ✅ 支持自定义域名

**3. GitHub Pages**
```bash
# 推送到GitHub自动部署
./deploy.sh github
```
- ✅ 完全免费
- ✅ 与GitHub仓库集成
- ✅ 自动化部署

**4. Surge.sh**
```bash
# 安装CLI
npm i -g surge

# 一键部署
./deploy.sh surge
```
- ✅ 简单快速
- ✅ 免费自定义域名

#### 手动部署
1. 构建项目：`npm run build:h5`
2. 将 `dist/build/h5` 目录上传到任意Web服务器

### iOS应用
1. 构建项目：`npm run build:app-ios`
2. 使用HBuilderX进行云打包或本地打包

### Android应用
1. 构建项目：`npm run build:app-android`
2. 使用HBuilderX进行云打包或本地打包

## 开发规范

### 代码规范

- 使用ES6+语法
- 组件命名采用PascalCase
- 方法命名采用camelCase
- 常量命名采用UPPER_SNAKE_CASE

### 样式规范

- 使用rpx作为响应式单位
- 遵循BEM命名规范
- 使用SCSS预处理器
- 保持样式模块化

### 提交规范

- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 样式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

## 许可证

MIT License

## 联系我们

如有问题或建议，请联系开发团队。