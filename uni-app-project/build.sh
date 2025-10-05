#!/bin/bash

# 每日打卡应用构建脚本
# 支持构建微信小程序、H5、iOS和Android版本

echo "🚀 每日打卡应用构建脚本"
echo "========================"

# 检查是否安装了HBuilderX CLI
check_hbuilderx() {
    if ! command -v cli &> /dev/null; then
        echo "❌ 未找到HBuilderX CLI工具"
        echo "请先安装HBuilderX并配置CLI工具"
        echo "参考文档: https://uniapp.dcloud.net.cn/quickstart-cli.html"
        exit 1
    fi
}

# 构建微信小程序
build_weixin() {
    echo "📱 开始构建微信小程序..."
    npx cross-env NODE_ENV=production UNI_PLATFORM=mp-weixin vue-cli-service uni-build
    echo "✅ 微信小程序构建完成，输出目录: dist/build/mp-weixin"
}

# 构建H5版本
build_h5() {
    echo "🌐 开始构建H5版本..."
    npx cross-env NODE_ENV=production UNI_PLATFORM=h5 vue-cli-service uni-build
    echo "✅ H5版本构建完成，输出目录: dist/build/h5"
}

# 构建iOS版本
build_ios() {
    echo "🍎 开始构建iOS版本..."
    npx cross-env NODE_ENV=production UNI_PLATFORM=app-ios vue-cli-service uni-build
    echo "✅ iOS版本构建完成，输出目录: dist/build/app-ios"
    echo "📝 请使用HBuilderX打开项目进行云打包或本地打包"
}

# 构建Android版本
build_android() {
    echo "🤖 开始构建Android版本..."
    npx cross-env NODE_ENV=production UNI_PLATFORM=app-android vue-cli-service uni-build
    echo "✅ Android版本构建完成，输出目录: dist/build/app-android"
    echo "📝 请使用HBuilderX打开项目进行云打包或本地打包"
}

# 构建所有平台
build_all() {
    echo "🔄 开始构建所有平台..."
    build_weixin
    echo ""
    build_h5
    echo ""
    build_ios
    echo ""
    build_android
    echo ""
    echo "🎉 所有平台构建完成！"
}

# 清理构建文件
clean() {
    echo "🧹 清理构建文件..."
    rm -rf dist/
    rm -rf unpackage/
    echo "✅ 清理完成"
}

# 显示帮助信息
show_help() {
    echo "用法: ./build.sh [选项]"
    echo ""
    echo "选项:"
    echo "  weixin    构建微信小程序"
    echo "  h5        构建H5版本"
    echo "  ios       构建iOS版本"
    echo "  android   构建Android版本"
    echo "  all       构建所有平台"
    echo "  clean     清理构建文件"
    echo "  help      显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  ./build.sh weixin     # 只构建微信小程序"
    echo "  ./build.sh all        # 构建所有平台"
    echo "  ./build.sh clean      # 清理构建文件"
}

# 主函数
main() {
    case "$1" in
        "weixin")
            build_weixin
            ;;
        "h5")
            build_h5
            ;;
        "ios")
            build_ios
            ;;
        "android")
            build_android
            ;;
        "all")
            build_all
            ;;
        "clean")
            clean
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        "")
            echo "❓ 请指定构建平台，使用 './build.sh help' 查看帮助"
            ;;
        *)
            echo "❌ 未知选项: $1"
            echo "使用 './build.sh help' 查看帮助"
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"