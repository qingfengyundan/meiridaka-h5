# 每日打卡 H5 应用

## 📱 项目简介

每日打卡是一个帮助用户培养自律好习惯的H5应用，支持：

- ✅ 每日打卡记录
- 📊 数据统计分析  
- 🎯 目标管理
- 👨‍👩‍👧‍👦 家长监督功能

## 🚀 在线访问

- **生产环境**: [https://meiridaka-h5.vercel.app](https://meiridaka-h5.vercel.app)
- **开发预览**: 部署后自动生成

## 🛠️ 技术栈

- **前端框架**: uni-app
- **部署平台**: Vercel
- **样式**: CSS3 + SCSS
- **构建工具**: Vue CLI

## 📁 项目结构

```
├── index.html          # 主页面
├── vercel.json         # Vercel配置
├── package.json        # 项目配置
├── manifest.json       # 应用配置
├── pages/              # 页面文件
├── utils/              # 工具函数
└── common/             # 公共样式
```

## 🔧 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run serve

# 构建H5版本
npm run build:h5
```

## 📦 部署

本项目已配置自动部署到Vercel：

1. 推送代码到GitHub
2. Vercel自动检测并部署
3. 获取访问链接

## 📄 许可证

MIT License

---

💡 **提示**: 这是一个uni-app项目，支持多端发布（H5、小程序、App）