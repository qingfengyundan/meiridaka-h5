<template>
	<view id="app">
		<!-- 应用主体内容 -->
	</view>
</template>

<script>
	import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
	import StorageUtil from './utils/storage.js'
	import PermissionUtil from './utils/permission.js'
	
	onLaunch(() => {
		console.log('App Launch')
		// 初始化应用
		initApp()
	})
	
	onShow(() => {
		console.log('App Show')
		// 检查成就
		StorageUtil.checkAchievements()
	})
	
	onHide(() => {
		console.log('App Hide')
	})
	
	// 初始化应用
	function initApp() {
		try {
			// 初始化权限系统
			PermissionUtil.init()
			
			// 初始化默认数据
			StorageUtil.initDefaultData()
			
			console.log('App initialized successfully')
		} catch (error) {
			console.error('App initialization failed:', error)
			
			// 显示初始化失败提示
			uni.showModal({
				title: '初始化失败',
				content: '应用初始化时出现问题，请重启应用',
				showCancel: false,
				confirmText: '确定'
			})
		}
	}
</script>

<style lang="scss">
	/* 全局样式 */
	@import url('./common/common.scss');
	
	#app {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	
	/* 全局通用样式 */
	.container {
		padding: 20rpx;
		background-color: #f8f9fa;
		min-height: 100vh;
	}
	
	.card {
		background: white;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}
	
	.btn-primary {
		background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
		color: white;
		border: none;
		border-radius: 25rpx;
		padding: 20rpx 40rpx;
		font-size: 28rpx;
		font-weight: 500;
	}
	
	.btn-secondary {
		background: #f8f9fa;
		color: #666;
		border: 2rpx solid #e9ecef;
		border-radius: 25rpx;
		padding: 20rpx 40rpx;
		font-size: 28rpx;
	}
	
	.text-primary {
		color: #4A90E2;
	}
	
	.text-success {
		color: #28a745;
	}
	
	.text-warning {
		color: #ffc107;
	}
	
	.text-danger {
		color: #dc3545;
	}
	
	.text-muted {
		color: #6c757d;
	}
</style>