#!/bin/bash

# 每日打卡应用 - Vercel 专用部署脚本

set -e

echo "🚀 每日打卡应用 - Vercel 部署"
echo "=============================="

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装"
    echo "请先安装: npm i -g vercel"
    exit 1
fi

# 检查是否已登录
echo "🔐 检查 Vercel 登录状态..."
if ! vercel whoami &> /dev/null; then
    echo "❌ 未登录 Vercel"
    echo "请先登录: vercel login"
    exit 1
fi

echo "✅ Vercel CLI 已就绪"

# 选择部署类型
echo ""
echo "请选择部署类型:"
echo "1. 预览部署 (Preview)"
echo "2. 生产部署 (Production)"
read -p "请输入选择 (1 或 2): " choice

case $choice in
    1)
        echo "📦 开始预览部署..."
        vercel
        ;;
    2)
        echo "🚀 开始生产部署..."
        vercel --prod
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "✅ 部署完成！"
echo "🎉 您的每日打卡应用已成功部署到 Vercel"
echo ""
echo "💡 提示:"
echo "- 预览部署：用于测试，每次推送都会生成新的预览链接"
echo "- 生产部署：用于正式环境，会更新您的主域名"
echo "- 查看部署状态：vercel ls"
echo "- 查看域名：vercel domains ls"