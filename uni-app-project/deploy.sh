#!/bin/bash

# 每日打卡应用 - 一键部署脚本
# 支持多个免费平台部署

set -e

echo "🚀 每日打卡应用 - 一键部署脚本"
echo "================================"

# 检查参数
if [ $# -eq 0 ]; then
    echo "使用方法: ./deploy.sh [platform]"
    echo ""
    echo "支持的平台:"
    echo "  vercel    - 部署到 Vercel"
    echo "  netlify   - 部署到 Netlify"
    echo "  surge     - 部署到 Surge.sh"
    echo "  github    - 部署到 GitHub Pages"
    echo ""
    exit 1
fi

PLATFORM=$1

# 构建H5版本
echo "📦 正在构建H5版本..."
npm run build:h5

case $PLATFORM in
    "vercel")
        echo "🌐 部署到 Vercel..."
        echo "请确保已安装 Vercel CLI: npm i -g vercel"
        echo "首次使用请先登录: vercel login"
        vercel --prod
        ;;
    
    "netlify")
        echo "🌐 部署到 Netlify..."
        echo "请确保已安装 Netlify CLI: npm i -g netlify-cli"
        echo "首次使用请先登录: netlify login"
        netlify deploy --prod --dir=dist/build/h5
        ;;
    
    "surge")
        echo "🌐 部署到 Surge.sh..."
        echo "请确保已安装 Surge CLI: npm i -g surge"
        echo "首次使用请先注册: surge"
        cd dist/build/h5
        surge . --domain meiridaka-$(date +%s).surge.sh
        cd ../../..
        ;;
    
    "github")
        echo "🌐 部署到 GitHub Pages..."
        echo "请确保已配置 GitHub Actions (见 .github/workflows/deploy.yml)"
        echo "推送代码到 GitHub 仓库即可自动部署"
        git add .
        git commit -m "Deploy: $(date)"
        git push origin main
        ;;
    
    *)
        echo "❌ 不支持的平台: $PLATFORM"
        echo "支持的平台: vercel, netlify, surge, github"
        exit 1
        ;;
esac

echo ""
echo "✅ 部署完成！"
echo "🎉 您的每日打卡应用已成功部署到 $PLATFORM"