<template>
	<view class="container">
		<!-- 家长模式头部 -->
		<view class="parent-header">
			<view class="header-content">
				<view class="mode-title">👨‍👩‍👧‍👦 家长模式</view>
				<view class="mode-desc">管理孩子的任务和奖励</view>
			</view>
			<view class="switch-mode" @tap="switchToStudent">
				<text>切换到学生模式</text>
			</view>
		</view>

		<!-- 孩子概览 */
		<view class="child-overview card">
			<view class="overview-title">📊 孩子概览</view>
			<view class="overview-stats">
				<view class="stat-card">
					<view class="stat-icon">📋</view>
					<view class="stat-number">{{ totalTasks }}</view>
					<view class="stat-label">总任务</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon">✅</view>
					<view class="stat-number">{{ completedTasks }}</view>
					<view class="stat-label">已完成</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon">💎</view>
					<view class="stat-number">{{ totalPoints }}</view>
					<view class="stat-label">总积分</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon">📈</view>
					<view class="stat-number">{{ completionRate }}%</view>
					<view class="stat-label">完成率</view>
				</view>
			</view>
		</view>

		<!-- 管理功能 */
		<view class="management-functions">
			<view class="function-grid">
				<view class="function-item" @tap="goToTaskManagement">
					<view class="function-icon">📝</view>
					<view class="function-title">任务管理</view>
					<view class="function-desc">添加、编辑任务</view>
				</view>
				<view class="function-item" @tap="goToPointsManagement">
					<view class="function-icon">💰</view>
					<view class="function-title">积分管理</view>
					<view class="function-desc">调整任务积分</view>
				</view>
				<view class="function-item" @tap="goToRewardManagement">
					<view class="function-icon">🎁</view>
					<view class="function-title">奖励管理</view>
					<view class="function-desc">设置奖励商品</view>
				</view>
				<view class="function-item" @tap="showDataAnalysis">
					<view class="function-icon">📊</view>
					<view class="function-title">数据分析</view>
					<view class="function-desc">查看完成情况</view>
				</view>
			</view>
		</view>

		<!-- 今日任务监控 -->
		<view class="today-monitor card">
			<view class="monitor-title">
				<text>📅 今日任务监控</text>
				<text class="monitor-date">{{ todayDate }}</text>
			</view>
			<view class="task-progress">
				<view class="progress-bar">
					<view class="progress-fill" :style="{ width: todayProgress + '%' }"></view>
				</view>
				<view class="progress-text">{{ todayCompleted }}/{{ todayTotal }} 已完成</view>
			</view>
			<view class="task-list">
				<view 
					class="task-item" 
					v-for="task in todayTasks" 
					:key="task.id"
					:class="{ 'completed': task.completed }"
				>
					<view class="task-status">
						<text v-if="task.completed">✅</text>
						<text v-else>⏳</text>
					</view>
					<view class="task-info">
						<view class="task-title">{{ task.title }}</view>
						<view class="task-meta">
							<text class="task-category">{{ task.category === 'school' ? '🏫 学校' : '🎯 个人' }}</text>
							<text class="task-time">{{ task.time }}</text>
							<text class="task-points">{{ task.points }}积分</text>
						</view>
					</view>
					<view class="task-actions" v-if="!task.completed">
						<button class="mark-complete-btn" @tap="markTaskComplete(task)">
							标记完成
						</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 本周表现 -->
		<view class="week-performance card">
			<view class="performance-title">📈 本周表现</view>
			<view class="week-chart">
				<view class="chart-container">
					<view 
						class="day-column" 
						v-for="(day, index) in weekData" 
						:key="index"
						:class="{ 'today': day.isToday }"
					>
						<view class="day-bar">
							<view 
								class="bar-fill" 
								:style="{ height: day.percentage + '%' }"
							></view>
						</view>
						<view class="day-label">{{ day.label }}</view>
						<view class="day-rate">{{ day.rate }}%</view>
					</view>
				</view>
			</view>
			<view class="week-summary">
				<view class="summary-item">
					<text class="summary-label">本周完成率：</text>
					<text class="summary-value">{{ weekCompletionRate }}%</text>
				</view>
				<view class="summary-item">
					<text class="summary-label">获得积分：</text>
					<text class="summary-value">{{ weekPoints }}分</text>
				</view>
			</view>
		</view>

		<!-- 快捷操作 */
		<view class="quick-operations card">
			<view class="operations-title">⚡ 快捷操作</view>
			<view class="operations-list">
				<view class="operation-item" @tap="addQuickTask">
					<view class="operation-icon">➕</view>
					<view class="operation-text">快速添加任务</view>
				</view>
				<view class="operation-item" @tap="sendEncouragement">
					<view class="operation-icon">💪</view>
					<view class="operation-text">发送鼓励</view>
				</view>
				<view class="operation-item" @tap="setReminder">
					<view class="operation-icon">⏰</view>
					<view class="operation-text">设置提醒</view>
				</view>
				<view class="operation-item" @tap="exportReport">
					<view class="operation-icon">📄</view>
					<view class="operation-text">导出报告</view>
				</view>
			</view>
		</view>

		<!-- 快速添加任务弹窗 -->
		<uni-popup ref="quickTaskPopup" type="center">
			<view class="quick-task-popup">
				<view class="popup-title">快速添加任务</view>
				<view class="form-item">
					<input 
						class="form-input" 
						v-model="quickTask.title" 
						placeholder="请输入任务标题"
						maxlength="50"
					/>
				</view>
				<view class="form-item">
					<picker 
						:value="quickTask.categoryIndex" 
						:range="categoryOptions" 
						@change="onCategoryChange"
					>
						<view class="form-input picker">{{ categoryOptions[quickTask.categoryIndex] }}</view>
					</picker>
				</view>
				<view class="form-item">
					<input 
						class="form-input" 
						v-model="quickTask.points" 
						type="number" 
						placeholder="积分奖励"
					/>
				</view>
				<view class="popup-actions">
					<button class="cancel-btn" @tap="cancelQuickTask">取消</button>
					<button class="confirm-btn" @tap="saveQuickTask">添加</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tasks: [],
				userInfo: {},
				quickTask: {
					title: '',
					categoryIndex: 0,
					points: 10
				},
				categoryOptions: ['🏫 学校任务', '🎯 个人任务']
			}
		},
		computed: {
			// 总任务数
			totalTasks() {
				return this.tasks.length
			},
			
			// 已完成任务数
			completedTasks() {
				return this.tasks.filter(task => task.completed).length
			},
			
			// 总积分
			totalPoints() {
				return this.userInfo.totalPoints || 0
			},
			
			// 完成率
			completionRate() {
				if (this.totalTasks === 0) return 0
				return Math.round((this.completedTasks / this.totalTasks) * 100)
			},
			
			// 今日日期
			todayDate() {
				const today = new Date()
				return `${today.getMonth() + 1}月${today.getDate()}日`
			},
			
			// 今日任务
			todayTasks() {
				const today = new Date().toISOString().split('T')[0]
				return this.tasks.filter(task => {
					if (task.type === 'daily') return true
					if (task.type === 'weekly') {
						const taskDate = new Date(task.date || today)
						const daysDiff = Math.floor((new Date(today) - taskDate) / (1000 * 60 * 60 * 24))
						return daysDiff % 7 === 0
					}
					if (task.type === 'monthly') {
						const taskDate = new Date(task.date || today)
						return taskDate.getDate() === new Date(today).getDate()
					}
					return task.date === today
				})
			},
			
			// 今日完成数
			todayCompleted() {
				return this.todayTasks.filter(task => task.completed).length
			},
			
			// 今日总数
			todayTotal() {
				return this.todayTasks.length
			},
			
			// 今日进度
			todayProgress() {
				if (this.todayTotal === 0) return 0
				return Math.round((this.todayCompleted / this.todayTotal) * 100)
			},
			
			// 本周数据
			weekData() {
				const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
				const today = new Date().getDay()
				
				return days.map((day, index) => {
					const rate = Math.floor(Math.random() * 40) + 60 // 模拟数据 60-100%
					return {
						label: day,
						rate: rate,
						percentage: rate,
						isToday: index === (today === 0 ? 6 : today - 1)
					}
				})
			},
			
			// 本周完成率
			weekCompletionRate() {
				const totalRate = this.weekData.reduce((sum, day) => sum + day.rate, 0)
				return Math.round(totalRate / this.weekData.length)
			},
			
			// 本周积分
			weekPoints() {
				return 285 // 模拟数据
			}
		},
		onLoad() {
			this.loadData()
		},
		onShow() {
			this.loadData()
		},
		methods: {
			// 加载数据
			loadData() {
				// 加载任务数据
				this.tasks = StorageUtil.getTasksData()
				
				// 加载用户数据
				this.userInfo = StorageUtil.getUserData()
			},
			
			// 切换到学生模式
			switchToStudent() {
				this.userInfo.role = 'student'
				StorageUtil.updateUserData(this.userInfo)
				
				uni.showToast({
					title: '已切换到学生模式',
					icon: 'success'
				})
				
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			
			// 进入任务管理
			goToTaskManagement() {
				uni.switchTab({
					url: '/pages/tasks/tasks'
				})
			},
			
			// 进入积分管理
			goToPointsManagement() {
				uni.showModal({
					title: '积分管理',
					content: '此功能正在开发中，敬请期待！',
					showCancel: false
				})
			},
			
			// 进入奖励管理
			goToRewardManagement() {
				uni.switchTab({
					url: '/pages/shop/shop'
				})
			},
			
			// 显示数据分析
			showDataAnalysis() {
				uni.switchTab({
					url: '/pages/stats/stats'
				})
			},
			
			// 标记任务完成
			markTaskComplete(task) {
				uni.showModal({
					title: '确认操作',
					content: `确认标记"${task.title}"为已完成？`,
					success: (res) => {
						if (res.confirm) {
							task.completed = true
							
							// 更新积分
							this.userInfo.totalPoints = (this.userInfo.totalPoints || 0) + task.points
							
							// 保存数据
				StorageUtil.updateTasksData(this.tasks)
				StorageUtil.updateUserData(this.userInfo)
							
							uni.showToast({
								title: `完成任务，获得${task.points}积分！`,
								icon: 'success'
							})
						}
					}
				})
			},
			
			// 快速添加任务
			addQuickTask() {
				this.quickTask = {
					title: '',
					categoryIndex: 0,
					points: 10
				}
				this.$refs.quickTaskPopup.open()
			},
			
			// 分类选择变化
			onCategoryChange(e) {
				this.quickTask.categoryIndex = e.detail.value
			},
			
			// 取消快速任务
			cancelQuickTask() {
				this.$refs.quickTaskPopup.close()
			},
			
			// 保存快速任务
			saveQuickTask() {
				if (!this.quickTask.title.trim()) {
					uni.showToast({
						title: '请输入任务标题',
						icon: 'none'
					})
					return
				}
				
				const newTask = {
					id: Date.now(),
					title: this.quickTask.title.trim(),
					category: this.quickTask.categoryIndex === 0 ? 'school' : 'personal',
					time: '18:00',
					points: parseInt(this.quickTask.points) || 10,
					type: 'daily',
					completed: false,
					date: new Date().toISOString().split('T')[0]
				}
				
				this.tasks.push(newTask)
				StorageUtil.updateTasksData(this.tasks)
				
				this.$refs.quickTaskPopup.close()
				
				uni.showToast({
					title: '任务添加成功',
					icon: 'success'
				})
			},
			
			// 发送鼓励
			sendEncouragement() {
				const encouragements = [
					'你今天表现很棒！继续加油！💪',
					'每一个小进步都值得庆祝！🎉',
					'坚持就是胜利，你做得很好！⭐',
					'相信自己，你一定可以的！🌟',
					'今天又是充实的一天！👏'
				]
				
				const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)]
				
				uni.showModal({
					title: '鼓励消息',
					content: randomEncouragement,
					showCancel: false,
					confirmText: '发送给孩子',
					success: () => {
						uni.showToast({
							title: '鼓励消息已发送',
							icon: 'success'
						})
					}
				})
			},
			
			// 设置提醒
			setReminder() {
				uni.showModal({
					title: '设置提醒',
					content: '提醒功能正在开发中，将支持自定义提醒时间和内容。',
					showCancel: false
				})
			},
			
			// 导出报告
			exportReport() {
				uni.showLoading({
					title: '生成报告中...'
				})
				
				setTimeout(() => {
					uni.hideLoading()
					uni.showModal({
						title: '报告生成完成',
						content: '孩子本周完成率85%，表现优秀！详细报告已保存到相册。',
						showCancel: false
					})
				}, 2000)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #f8f9fa;
		min-height: 100vh;
	}

	/* 家长模式头部 */
	.parent-header {
		background: linear-gradient(135deg, #6c5ce7, #a29bfe);
		padding: 40rpx 30rpx;
		color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		.header-content {
			.mode-title {
				font-size: 36rpx;
				font-weight: bold;
				margin-bottom: 8rpx;
			}
			
			.mode-desc {
				font-size: 24rpx;
				opacity: 0.8;
			}
		}
		
		.switch-mode {
			background: rgba(255, 255, 255, 0.2);
			padding: 16rpx 24rpx;
			border-radius: 20rpx;
			font-size: 24rpx;
		}
	}

	.card {
		background: white;
		margin: 20rpx;
		border-radius: 16rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	/* 孩子概览 */
	.child-overview {
		.overview-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 30rpx;
		}
		
		.overview-stats {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 20rpx;
		}
		
		.stat-card {
			background: linear-gradient(135deg, #f8f9fa, #e9ecef);
			padding: 30rpx;
			border-radius: 12rpx;
			text-align: center;
			
			.stat-icon {
				font-size: 40rpx;
				margin-bottom: 12rpx;
			}
			
			.stat-number {
				font-size: 36rpx;
				font-weight: bold;
				color: #4A90E2;
				margin-bottom: 8rpx;
			}
			
			.stat-label {
				font-size: 24rpx;
				color: #666;
			}
		}
	}

	/* 管理功能 */
	.management-functions {
		margin: 20rpx;
		
		.function-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 20rpx;
		}
		
		.function-item {
			background: white;
			padding: 40rpx 30rpx;
			border-radius: 16rpx;
			text-align: center;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
			
			.function-icon {
				font-size: 48rpx;
				margin-bottom: 16rpx;
			}
			
			.function-title {
				font-size: 28rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 8rpx;
			}
			
			.function-desc {
				font-size: 22rpx;
				color: #666;
			}
		}
	}

	/* 今日任务监控 */
	.today-monitor {
		.monitor-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 30rpx;
			
			.monitor-date {
				font-size: 24rpx;
				color: #666;
				font-weight: normal;
			}
		}
		
		.task-progress {
			margin-bottom: 30rpx;
			
			.progress-bar {
				height: 16rpx;
				background: #e9ecef;
				border-radius: 8rpx;
				overflow: hidden;
				margin-bottom: 12rpx;
				
				.progress-fill {
					height: 100%;
					background: linear-gradient(90deg, #4A90E2, #28a745);
					border-radius: 8rpx;
					transition: width 0.3s ease;
				}
			}
			
			.progress-text {
				font-size: 24rpx;
				color: #666;
				text-align: center;
			}
		}
		
		.task-list {
			.task-item {
				display: flex;
				align-items: center;
				padding: 20rpx 0;
				border-bottom: 2rpx solid #f0f0f0;
				
				&:last-child {
					border-bottom: none;
				}
				
				&.completed {
					opacity: 0.6;
				}
				
				.task-status {
					font-size: 32rpx;
					margin-right: 20rpx;
				}
				
				.task-info {
					flex: 1;
					
					.task-title {
						font-size: 28rpx;
						color: #333;
						margin-bottom: 8rpx;
					}
					
					.task-meta {
						display: flex;
						gap: 20rpx;
						font-size: 22rpx;
						color: #666;
					}
				}
				
				.task-actions {
					.mark-complete-btn {
						background: #28a745;
						color: white;
						border: none;
						padding: 12rpx 24rpx;
						border-radius: 20rpx;
						font-size: 22rpx;
					}
				}
			}
		}
	}

	/* 本周表现 */
	.week-performance {
		.performance-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 30rpx;
		}
		
		.week-chart {
			margin-bottom: 30rpx;
			
			.chart-container {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				height: 200rpx;
				padding: 0 20rpx;
			}
			
			.day-column {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				
				&.today .day-label {
					color: #4A90E2;
					font-weight: bold;
				}
				
				.day-bar {
					width: 24rpx;
					height: 120rpx;
					background: #e9ecef;
					border-radius: 12rpx;
					overflow: hidden;
					margin-bottom: 12rpx;
					position: relative;
				}
				
				.bar-fill {
					position: absolute;
					bottom: 0;
					width: 100%;
					background: linear-gradient(180deg, #4A90E2, #28a745);
					border-radius: 12rpx;
					transition: height 0.3s ease;
				}
				
				.day-label {
					font-size: 20rpx;
					color: #666;
					margin-bottom: 8rpx;
				}
				
				.day-rate {
					font-size: 20rpx;
					color: #333;
					font-weight: bold;
				}
			}
		}
		
		.week-summary {
			display: flex;
			justify-content: space-around;
			padding-top: 20rpx;
			border-top: 2rpx solid #f0f0f0;
			
			.summary-item {
				font-size: 24rpx;
				
				.summary-label {
					color: #666;
				}
				
				.summary-value {
					color: #4A90E2;
					font-weight: bold;
				}
			}
		}
	}

	/* 快捷操作 */
	.quick-operations {
		.operations-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 30rpx;
		}
		
		.operations-list {
			.operation-item {
				display: flex;
				align-items: center;
				padding: 24rpx 0;
				border-bottom: 2rpx solid #f0f0f0;
				
				&:last-child {
					border-bottom: none;
				}
				
				.operation-icon {
					font-size: 32rpx;
					margin-right: 20rpx;
				}
				
				.operation-text {
					font-size: 28rpx;
					color: #333;
				}
			}
		}
	}

	/* 快速任务弹窗 */
	.quick-task-popup {
		width: 600rpx;
		background: white;
		border-radius: 16rpx;
		padding: 40rpx;
		
		.popup-title {
			font-size: 32rpx;
			font-weight: bold;
			text-align: center;
			margin-bottom: 40rpx;
			color: #333;
		}
		
		.form-item {
			margin-bottom: 30rpx;
			
			.form-input {
				width: 100%;
				height: 80rpx;
				border: 2rpx solid #e9ecef;
				border-radius: 8rpx;
				padding: 0 20rpx;
				font-size: 28rpx;
				box-sizing: border-box;
				
				&.picker {
					display: flex;
					align-items: center;
					color: #333;
				}
			}
		}
		
		.popup-actions {
			display: flex;
			gap: 20rpx;
			margin-top: 40rpx;
			
			.cancel-btn, .confirm-btn {
				flex: 1;
				height: 80rpx;
				border: none;
				border-radius: 8rpx;
				font-size: 28rpx;
			}
			
			.cancel-btn {
				background: #f8f9fa;
				color: #666;
			}
			
			.confirm-btn {
				background: #4A90E2;
				color: white;
			}
		}
	}
</style>