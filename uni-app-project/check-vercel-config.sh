#!/bin/bash

# 每日打卡应用 - Vercel 配置检查脚本

echo "🔍 每日打卡应用 - Vercel 配置检查"
echo "=================================="

# 检查必要文件
echo "📁 检查配置文件..."

files=(
    "vercel.json"
    "package.json"
    "deploy-vercel.sh"
    "VERCEL_DEPLOY.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file - 存在"
    else
        echo "❌ $file - 缺失"
    fi
done

echo ""

# 检查 package.json 中的脚本
echo "📦 检查 package.json 脚本..."
if grep -q "vercel-build" package.json; then
    echo "✅ vercel-build 脚本 - 已配置"
else
    echo "❌ vercel-build 脚本 - 缺失"
fi

if grep -q "build:h5" package.json; then
    echo "✅ build:h5 脚本 - 已配置"
else
    echo "❌ build:h5 脚本 - 缺失"
fi

echo ""

# 检查 vercel.json 配置
echo "⚙️ 检查 vercel.json 配置..."
if [ -f "vercel.json" ]; then
    if grep -q "dist/build/h5" vercel.json; then
        echo "✅ 输出目录配置 - 正确"
    else
        echo "❌ 输出目录配置 - 错误"
    fi
    
    if grep -q "Cache-Control" vercel.json; then
        echo "✅ 缓存配置 - 已设置"
    else
        echo "⚠️ 缓存配置 - 未设置"
    fi
else
    echo "❌ vercel.json - 文件不存在"
fi

echo ""

# 检查 Vercel CLI
echo "🛠️ 检查 Vercel CLI..."
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI - 已安装"
    vercel --version
    
    # 检查登录状态
    if vercel whoami &> /dev/null; then
        echo "✅ Vercel 登录状态 - 已登录"
        echo "   用户: $(vercel whoami)"
    else
        echo "⚠️ Vercel 登录状态 - 未登录"
        echo "   请运行: vercel login"
    fi
else
    echo "❌ Vercel CLI - 未安装"
    echo "   请运行: npm i -g vercel"
fi

echo ""

# 检查项目结构
echo "📂 检查项目结构..."
required_dirs=(
    "pages"
    "utils"
    "common"
)

for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir/ - 存在"
    else
        echo "❌ $dir/ - 缺失"
    fi
done

echo ""

# 总结
echo "📋 配置检查完成！"
echo ""
echo "🚀 如果所有检查都通过，您可以："
echo "   1. 运行 ./deploy-vercel.sh 进行部署"
echo "   2. 或者直接运行 vercel 命令"
echo ""
echo "📖 详细说明请查看 VERCEL_DEPLOY.md"