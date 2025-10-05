<template>
	<view class="container">
		<!-- 欢迎区域 -->
		<view class="welcome-section card">
			<view class="user-info flex align-center">
				<view class="avatar">{{ userInfo.avatar }}</view>
				<view class="user-details flex-1 ml-2">
					<view class="user-name">{{ userInfo.name }}</view>
					<view class="user-level">{{ userInfo.level }} · {{ userInfo.title }}</view>
				</view>
			</view>
			<view class="points-display mt-2">
				<text class="points-text">💎 今日积分: </text>
				<text class="points-value">{{ userInfo.todayPoints }}</text>
				<text class="points-text"> | 总积分: </text>
				<text class="points-value">{{ userInfo.totalPoints }}</text>
			</view>
		</view>

		<!-- 今日进度 -->
		<view class="progress-section card">
			<view class="progress-header flex justify-between align-center mb-2">
				<view class="progress-title">今日完成进度</view>
				<view class="progress-stats">
					<text class="completed-count">{{ todayProgress.completed }}</text>
					<text>/{{ todayProgress.total }} 已完成</text>
				</view>
			</view>
			<view class="progress-bar">
				<view class="progress-fill" :style="{ width: todayProgress.percentage + '%' }"></view>
			</view>
			<view class="progress-tip mt-2" v-if="todayProgress.pending > 0">
				🎉 太棒了！再完成{{ todayProgress.pending }}个任务就能获得额外奖励积分！
			</view>
			<view class="progress-tip mt-2" v-else>
				🎊 恭喜！今日所有任务已完成，获得额外奖励积分！
			</view>
		</view>

		<!-- 今日任务列表 -->
		<view class="task-section">
			<view class="section-header flex justify-between align-center mb-2">
				<view class="section-title">📚 今日任务</view>
				<view class="add-task-btn" @click="goToTasks">
					<text class="add-icon">+</text>
				</view>
			</view>

			<!-- 学校任务 -->
			<view class="task-category mb-3" v-if="todayTasks.school && todayTasks.school.length > 0">
				<view class="category-title">🏫 学校任务</view>
				<view class="task-list">
					<view 
						class="task-item" 
						v-for="task in todayTasks.school" 
						:key="task.id"
						:class="{ 'completed': task.completed }"
						@click="toggleTask(task)"
					>
						<view class="task-checkbox">
							<text v-if="task.completed">✅</text>
							<text v-else>⭕</text>
						</view>
						<view class="task-content flex-1 ml-2">
							<view class="task-title">{{ task.title }}</view>
							<view class="task-meta">
								<text class="task-time">⏰ {{ task.time }}</text>
								<text class="task-points">💎 {{ task.points }}积分</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 个人任务 -->
			<view class="task-category mb-3" v-if="todayTasks.personal && todayTasks.personal.length > 0">
				<view class="category-title">🎯 个人任务</view>
				<view class="task-list">
					<view 
						class="task-item" 
						v-for="task in todayTasks.personal" 
						:key="task.id"
						:class="{ 'completed': task.completed }"
						@click="toggleTask(task)"
					>
						<view class="task-checkbox">
							<text v-if="task.completed">✅</text>
							<text v-else>⭕</text>
						</view>
						<view class="task-content flex-1 ml-2">
							<view class="task-title">{{ task.title }}</view>
							<view class="task-meta">
								<text class="task-time">⏰ {{ task.time }}</text>
								<text class="task-points">💎 {{ task.points }}积分</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view class="empty-state" v-if="(!todayTasks.school || todayTasks.school.length === 0) && (!todayTasks.personal || todayTasks.personal.length === 0)">
				<view class="empty-icon">📝</view>
				<view class="empty-text">今天还没有任务哦</view>
				<view class="empty-tip">点击右上角 + 号添加任务</view>
			</view>
		</view>

		<!-- 快速操作 -->
		<view class="quick-actions card">
			<view class="actions-title mb-2">快速操作</view>
			<view class="actions-grid">
				<view class="action-item" @click="goToStats">
					<view class="action-icon">📊</view>
					<view class="action-text">查看统计</view>
				</view>
				<view class="action-item" @click="goToShop">
					<view class="action-icon">🛒</view>
					<view class="action-text">积分商城</view>
				</view>
				<view class="action-item" @click="goToParent">
					<view class="action-icon">👨‍👩‍👧‍👦</view>
					<view class="action-text">家长模式</view>
				</view>
				<view class="action-item" @click="goToProfile">
					<view class="action-icon">⚙️</view>
					<view class="action-text">设置</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import StorageUtil from '../../utils/storage.js'
	import PermissionUtil from '../../utils/permission.js'
	
	export default {
		data() {
			return {
				userInfo: {},
				todayProgress: {
					completed: 0,
					total: 0,
					percentage: 0,
					pending: 0
				},
				todayTasks: {
					school: [],
					personal: []
				}
			}
		},
		computed: {
			// 学校任务
			schoolTasks() {
				return this.todayTasks.filter(task => task.category === 'school')
			},
			
			// 个人任务
			personalTasks() {
				return this.todayTasks.filter(task => task.category === 'personal')
			}
		},
		onLoad() {
			this.loadData()
		},
		onShow() {
			// 每次显示页面时刷新数据
			this.loadData()
		},
		methods: {
			loadData() {
				// 加载用户信息
				this.userInfo = StorageUtil.getUserData()
				
				// 加载今日任务
				this.loadTodayTasks()
			},
			
			loadTodayTasks() {
				// 获取今日任务
				this.todayTasks = StorageUtil.getTodayTasks()
				
				// 计算今日进度
				this.todayProgress = StorageUtil.getCompletionStats()
			},
			
			// 切换任务完成状态
			toggleTask(task) {
				// 检查权限
				if (!PermissionUtil.checkPermission(PermissionUtil.PERMISSIONS.TASK_COMPLETE)) {
					PermissionUtil.showPermissionDenied()
					return
				}
				
				// 切换任务完成状态
				const newStatus = !task.completed
				const success = StorageUtil.updateTaskStatus(task.id, newStatus)
				
				if (success) {
					// 重新加载数据以更新UI
					this.loadData()
					
					// 显示提示
					uni.showToast({
						title: newStatus ? `+${task.points}积分!` : '已取消完成',
						icon: newStatus ? 'success' : 'none'
					})
					
					// 检查成就
					if (newStatus) {
						const hasNewAchievements = StorageUtil.checkAchievements()
						if (hasNewAchievements) {
							setTimeout(() => {
								uni.showToast({
									title: '🎉 解锁新成就！',
									icon: 'none'
								})
							}, 1000)
						}
					}
				} else {
					uni.showToast({
						title: '操作失败',
						icon: 'error'
					})
				}
			},
			

			
			// 导航到任务页面
			goToTasks() {
				uni.switchTab({
					url: '/pages/tasks/tasks'
				})
			},
			
			// 导航到统计页面
			goToStats() {
				uni.switchTab({
					url: '/pages/stats/stats'
				})
			},
			
			// 导航到商城页面
			goToShop() {
				uni.navigateTo({
					url: '/pages/shop/shop'
				})
			},
			
			// 导航到家长页面
			goToParent() {
				uni.navigateTo({
					url: '/pages/parent/parent'
				})
			},
			
			// 导航到个人中心
			goToProfile() {
				uni.switchTab({
					url: '/pages/profile/profile'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 20rpx;
		background-color: #f8f9fa;
		min-height: 100vh;
	}

	/* 欢迎区域 */
	.welcome-section {
		background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
		color: white;
		
		.avatar {
			font-size: 60rpx;
			width: 80rpx;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		.user-name {
			font-size: 36rpx;
			font-weight: bold;
			margin-bottom: 8rpx;
		}
		
		.user-level {
			font-size: 24rpx;
			opacity: 0.9;
		}
		
		.points-display {
			background: rgba(255, 255, 255, 0.2);
			padding: 20rpx;
			border-radius: 12rpx;
			text-align: center;
			
			.points-text {
				font-size: 24rpx;
			}
			
			.points-value {
				font-size: 28rpx;
				font-weight: bold;
				color: #FFD700;
			}
		}
	}

	/* 进度区域 */
	.progress-section {
		.progress-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
		
		.progress-stats {
			font-size: 24rpx;
			color: #666;
			
			.completed-count {
				color: #4A90E2;
				font-weight: bold;
			}
		}
		
		.progress-bar {
			height: 16rpx;
			background-color: #e9ecef;
			border-radius: 8rpx;
			overflow: hidden;
			
			.progress-fill {
				height: 100%;
				background: linear-gradient(90deg, #4A90E2 0%, #28a745 100%);
				border-radius: 8rpx;
				transition: width 0.3s ease;
			}
		}
		
		.progress-tip {
			font-size: 24rpx;
			color: #666;
			text-align: center;
		}
	}

	/* 任务区域 */
	.task-section {
		.section-header {
			.section-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
			
			.add-task-btn {
				width: 60rpx;
				height: 60rpx;
				background: #4A90E2;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				
				.add-icon {
					color: white;
					font-size: 32rpx;
					font-weight: bold;
				}
			}
		}
		
		.task-category {
			.category-title {
				font-size: 28rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 20rpx;
			}
		}
		
		.task-item {
			background: white;
			border-radius: 16rpx;
			padding: 24rpx;
			margin-bottom: 16rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
			display: flex;
			align-items: center;
			transition: all 0.3s ease;
			
			&.completed {
				opacity: 0.7;
				
				.task-title {
					text-decoration: line-through;
					color: #999;
				}
			}
			
			.task-checkbox {
				font-size: 32rpx;
			}
			
			.task-title {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 8rpx;
			}
			
			.task-meta {
				display: flex;
				gap: 20rpx;
				
				.task-time, .task-points {
					font-size: 22rpx;
					color: #666;
				}
				
				.task-points {
					color: #4A90E2;
				}
			}
		}
		
		.empty-state {
			text-align: center;
			padding: 80rpx 20rpx;
			
			.empty-icon {
				font-size: 80rpx;
				margin-bottom: 20rpx;
			}
			
			.empty-text {
				font-size: 28rpx;
				color: #666;
				margin-bottom: 10rpx;
			}
			
			.empty-tip {
				font-size: 24rpx;
				color: #999;
			}
		}
	}

	/* 快速操作 */
	.quick-actions {
		.actions-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
		
		.actions-grid {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 20rpx;
		}
		
		.action-item {
			text-align: center;
			padding: 20rpx;
			
			.action-icon {
				font-size: 40rpx;
				margin-bottom: 10rpx;
			}
			
			.action-text {
				font-size: 22rpx;
				color: #666;
			}
		}
	}
</style>