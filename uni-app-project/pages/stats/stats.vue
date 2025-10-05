<template>
	<view class="container">
		<!-- 总体统计 -->
		<view class="overview-stats card">
			<view class="stats-title">📊 总体统计</view>
			<view class="stats-grid">
				<view class="stat-item">
					<view class="stat-icon">📋</view>
					<view class="stat-number">{{ totalTasks }}</view>
					<view class="stat-label">总任务数</view>
				</view>
				<view class="stat-item">
					<view class="stat-icon">✅</view>
					<view class="stat-number">{{ completedTasks }}</view>
					<view class="stat-label">已完成</view>
				</view>
				<view class="stat-item">
					<view class="stat-icon">💎</view>
					<view class="stat-number">{{ totalPoints }}</view>
					<view class="stat-label">总积分</view>
				</view>
				<view class="stat-item">
					<view class="stat-icon">🔥</view>
					<view class="stat-number">{{ streakDays }}</view>
					<view class="stat-label">连续天数</view>
				</view>
			</view>
		</view>

		<!-- 完成率统计 -->
		<view class="completion-stats card">
			<view class="stats-title">📈 完成率统计</view>
			<view class="completion-rate">
				<view class="rate-circle">
					<view class="rate-number">{{ completionRate }}%</view>
					<view class="rate-label">总完成率</view>
				</view>
				<view class="rate-details">
					<view class="rate-item">
						<view class="rate-category">🏫 学校任务</view>
						<view class="rate-bar">
							<view class="rate-fill" :style="{ width: schoolCompletionRate + '%' }"></view>
						</view>
						<view class="rate-percent">{{ schoolCompletionRate }}%</view>
					</view>
					<view class="rate-item">
						<view class="rate-category">🎯 个人任务</view>
						<view class="rate-bar">
							<view class="rate-fill" :style="{ width: personalCompletionRate + '%' }"></view>
						</view>
						<view class="rate-percent">{{ personalCompletionRate }}%</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 本周统计 -->
		<view class="weekly-stats card">
			<view class="stats-title">📅 本周统计</view>
			<view class="week-chart">
				<view class="chart-days">
					<view 
						class="day-item" 
						v-for="(day, index) in weekDays" 
						:key="index"
						:class="{ 'today': day.isToday }"
					>
						<view class="day-label">{{ day.label }}</view>
						<view class="day-bar">
							<view 
								class="day-fill" 
								:style="{ height: day.percentage + '%' }"
							></view>
						</view>
						<view class="day-count">{{ day.completed }}</view>
					</view>
				</view>
			</view>
			<view class="week-summary">
				<view class="summary-item">
					<text>本周完成：</text>
					<text class="summary-value">{{ weekCompleted }}</text>
					<text>个任务</text>
				</view>
				<view class="summary-item">
					<text>获得积分：</text>
					<text class="summary-value">{{ weekPoints }}</text>
					<text>分</text>
				</view>
			</view>
		</view>

		<!-- 积分趋势 -->
		<view class="points-trend card">
			<view class="stats-title">💰 积分趋势</view>
			<view class="trend-chart">
				<view class="trend-line">
					<view 
						class="trend-point" 
						v-for="(point, index) in pointsTrend" 
						:key="index"
						:style="{ 
							left: (index / (pointsTrend.length - 1)) * 100 + '%',
							bottom: (point.value / maxPoints) * 100 + '%'
						}"
					>
						<view class="point-dot"></view>
						<view class="point-value">{{ point.value }}</view>
					</view>
				</view>
			</view>
			<view class="trend-labels">
				<view 
					class="trend-label" 
					v-for="(point, index) in pointsTrend" 
					:key="index"
				>
					{{ point.date }}
				</view>
			</view>
		</view>

		<!-- 任务分类统计 */
		<view class="category-stats card">
			<view class="stats-title">📊 任务分类统计</view>
			<view class="category-chart">
				<view class="chart-item">
					<view class="chart-bar school">
						<view class="bar-fill" :style="{ width: schoolTasksPercentage + '%' }"></view>
					</view>
					<view class="chart-info">
						<view class="chart-label">🏫 学校任务</view>
						<view class="chart-value">{{ schoolTasks }}个 ({{ schoolTasksPercentage }}%)</view>
					</view>
				</view>
				<view class="chart-item">
					<view class="chart-bar personal">
						<view class="bar-fill" :style="{ width: personalTasksPercentage + '%' }"></view>
					</view>
					<view class="chart-info">
						<view class="chart-label">🎯 个人任务</view>
						<view class="chart-value">{{ personalTasks }}个 ({{ personalTasksPercentage }}%)</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 成就徽章 */
		<view class="achievements card">
			<view class="stats-title">🏆 成就徽章</view>
			<view class="badges-grid">
				<view 
					class="badge-item" 
					v-for="badge in achievements" 
					:key="badge.id"
					:class="{ 'unlocked': badge.unlocked }"
				>
					<view class="badge-icon">{{ badge.icon }}</view>
					<view class="badge-name">{{ badge.name }}</view>
					<view class="badge-desc">{{ badge.description }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import StorageUtil from '../../utils/storage.js'
	
	export default {
		data() {
			return {
				tasks: [],
				userInfo: {},
				achievements: [
					{
						id: 1,
						icon: '🌟',
						name: '初出茅庐',
						description: '完成第一个任务',
						unlocked: false,
						condition: (stats) => stats.completedTasks >= 1
					},
					{
						id: 2,
						icon: '🔥',
						name: '坚持不懈',
						description: '连续打卡7天',
						unlocked: false,
						condition: (stats) => stats.streakDays >= 7
					},
					{
						id: 3,
						icon: '💎',
						name: '积分达人',
						description: '累计获得1000积分',
						unlocked: false,
						condition: (stats) => stats.totalPoints >= 1000
					},
					{
						id: 4,
						icon: '📚',
						name: '学霸模式',
						description: '完成50个学校任务',
						unlocked: false,
						condition: (stats) => stats.schoolCompleted >= 50
					},
					{
						id: 5,
						icon: '🎯',
						name: '自律大师',
						description: '完成率达到90%',
						unlocked: false,
						condition: (stats) => stats.completionRate >= 90
					},
					{
						id: 6,
						icon: '👑',
						name: '完美主义',
						description: '单日完成率100%',
						unlocked: false,
						condition: (stats) => stats.perfectDays >= 1
					}
				]
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
			
			// 连续天数（模拟数据）
			streakDays() {
				return 12
			},
			
			// 总完成率
			completionRate() {
				if (this.totalTasks === 0) return 0
				return Math.round((this.completedTasks / this.totalTasks) * 100)
			},
			
			// 学校任务数
			schoolTasks() {
				return this.tasks.filter(task => task.category === 'school').length
			},
			
			// 个人任务数
			personalTasks() {
				return this.tasks.filter(task => task.category === 'personal').length
			},
			
			// 学校任务完成率
			schoolCompletionRate() {
				const schoolTasks = this.tasks.filter(task => task.category === 'school')
				if (schoolTasks.length === 0) return 0
				const completed = schoolTasks.filter(task => task.completed).length
				return Math.round((completed / schoolTasks.length) * 100)
			},
			
			// 个人任务完成率
			personalCompletionRate() {
				const personalTasks = this.tasks.filter(task => task.category === 'personal')
				if (personalTasks.length === 0) return 0
				const completed = personalTasks.filter(task => task.completed).length
				return Math.round((completed / personalTasks.length) * 100)
			},
			
			// 学校任务百分比
			schoolTasksPercentage() {
				if (this.totalTasks === 0) return 0
				return Math.round((this.schoolTasks / this.totalTasks) * 100)
			},
			
			// 个人任务百分比
			personalTasksPercentage() {
				if (this.totalTasks === 0) return 0
				return Math.round((this.personalTasks / this.totalTasks) * 100)
			},
			
			// 本周数据
			weekDays() {
				const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
				const today = new Date().getDay()
				
				return days.map((day, index) => {
					const completed = Math.floor(Math.random() * 8) + 1 // 模拟数据
					return {
						label: day,
						completed: completed,
						percentage: (completed / 8) * 100,
						isToday: index === (today === 0 ? 6 : today - 1)
					}
				})
			},
			
			// 本周完成任务数
			weekCompleted() {
				return this.weekDays.reduce((sum, day) => sum + day.completed, 0)
			},
			
			// 本周获得积分
			weekPoints() {
				return this.weekCompleted * 15 // 假设平均每个任务15积分
			},
			
			// 积分趋势数据
			pointsTrend() {
				const dates = []
				const today = new Date()
				
				for (let i = 6; i >= 0; i--) {
					const date = new Date(today)
					date.setDate(date.getDate() - i)
					dates.push({
						date: `${date.getMonth() + 1}/${date.getDate()}`,
						value: Math.floor(Math.random() * 100) + 50 // 模拟数据
					})
				}
				
				return dates
			},
			
			// 最大积分值（用于图表缩放）
			maxPoints() {
				return Math.max(...this.pointsTrend.map(p => p.value))
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
				// 获取统计数据
				const stats = StorageUtil.getStatistics()
				this.overallStats = stats.overall
				this.completionRates = stats.completion
				this.weeklyStats = stats.weekly
				this.pointsTrend = stats.pointsTrend
				this.categoryStats = stats.category
				
				// 获取成就数据
				this.achievements = StorageUtil.getAchievements()
			},
			
			// 更新成就状态
			updateAchievements() {
				const stats = {
					completedTasks: this.completedTasks,
					streakDays: this.streakDays,
					totalPoints: this.totalPoints,
					schoolCompleted: this.tasks.filter(t => t.category === 'school' && t.completed).length,
					completionRate: this.completionRate,
					perfectDays: 1 // 模拟数据
				}
				
				this.achievements.forEach(achievement => {
					if (!achievement.unlocked && achievement.condition(stats)) {
						achievement.unlocked = true
						// 显示成就解锁提示
						uni.showToast({
							title: `🎉 解锁成就：${achievement.name}`,
							icon: 'none',
							duration: 3000
						})
					}
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

	.card {
		background: white;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.stats-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
	}

	/* 总体统计 */
	.overview-stats {
		.stats-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 30rpx;
		}
		
		.stat-item {
			text-align: center;
			
			.stat-icon {
				font-size: 48rpx;
				margin-bottom: 16rpx;
			}
			
			.stat-number {
				font-size: 40rpx;
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

	/* 完成率统计 */
	.completion-stats {
		.completion-rate {
			display: flex;
			align-items: center;
			gap: 40rpx;
		}
		
		.rate-circle {
			width: 160rpx;
			height: 160rpx;
			border-radius: 50%;
			background: conic-gradient(#4A90E2 0deg, #4A90E2 var(--rate-deg, 0deg), #e9ecef var(--rate-deg, 0deg));
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;
			
			&::before {
				content: '';
				position: absolute;
				width: 120rpx;
				height: 120rpx;
				background: white;
				border-radius: 50%;
			}
			
			.rate-number {
				font-size: 32rpx;
				font-weight: bold;
				color: #4A90E2;
				z-index: 1;
			}
			
			.rate-label {
				font-size: 20rpx;
				color: #666;
				z-index: 1;
			}
		}
		
		.rate-details {
			flex: 1;
		}
		
		.rate-item {
			margin-bottom: 24rpx;
			
			.rate-category {
				font-size: 24rpx;
				color: #333;
				margin-bottom: 12rpx;
			}
			
			.rate-bar {
				height: 16rpx;
				background: #e9ecef;
				border-radius: 8rpx;
				overflow: hidden;
				margin-bottom: 8rpx;
				
				.rate-fill {
					height: 100%;
					background: linear-gradient(90deg, #4A90E2, #28a745);
					border-radius: 8rpx;
					transition: width 0.3s ease;
				}
			}
			
			.rate-percent {
				font-size: 22rpx;
				color: #666;
				text-align: right;
			}
		}
	}

	/* 本周统计 */
	.weekly-stats {
		.week-chart {
			margin-bottom: 30rpx;
		}
		
		.chart-days {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			height: 200rpx;
			padding: 0 20rpx;
		}
		
		.day-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			
			&.today .day-label {
				color: #4A90E2;
				font-weight: bold;
			}
			
			.day-label {
				font-size: 20rpx;
				color: #666;
				margin-bottom: 16rpx;
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
			
			.day-fill {
				position: absolute;
				bottom: 0;
				width: 100%;
				background: linear-gradient(180deg, #4A90E2, #28a745);
				border-radius: 12rpx;
				transition: height 0.3s ease;
			}
			
			.day-count {
				font-size: 20rpx;
				color: #333;
				font-weight: bold;
			}
		}
		
		.week-summary {
			display: flex;
			justify-content: space-around;
			padding-top: 20rpx;
			border-top: 2rpx solid #f0f0f0;
			
			.summary-item {
				font-size: 24rpx;
				color: #666;
				
				.summary-value {
					color: #4A90E2;
					font-weight: bold;
				}
			}
		}
	}

	/* 积分趋势 */
	.points-trend {
		.trend-chart {
			height: 200rpx;
			position: relative;
			margin-bottom: 30rpx;
		}
		
		.trend-line {
			position: relative;
			height: 100%;
		}
		
		.trend-point {
			position: absolute;
			
			.point-dot {
				width: 12rpx;
				height: 12rpx;
				background: #4A90E2;
				border-radius: 50%;
				border: 4rpx solid white;
				box-shadow: 0 2rpx 8rpx rgba(74, 144, 226, 0.3);
			}
			
			.point-value {
				position: absolute;
				top: -40rpx;
				left: 50%;
				transform: translateX(-50%);
				font-size: 20rpx;
				color: #666;
				background: white;
				padding: 4rpx 8rpx;
				border-radius: 4rpx;
				box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
			}
		}
		
		.trend-labels {
			display: flex;
			justify-content: space-between;
			
			.trend-label {
				font-size: 20rpx;
				color: #666;
			}
		}
	}

	/* 任务分类统计 */
	.category-stats {
		.category-chart {
			.chart-item {
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;
				
				.chart-bar {
					width: 200rpx;
					height: 24rpx;
					border-radius: 12rpx;
					overflow: hidden;
					margin-right: 20rpx;
					
					&.school {
						background: #e3f2fd;
						
						.bar-fill {
							background: #1976d2;
						}
					}
					
					&.personal {
						background: #e8f5e8;
						
						.bar-fill {
							background: #388e3c;
						}
					}
					
					.bar-fill {
						height: 100%;
						border-radius: 12rpx;
						transition: width 0.3s ease;
					}
				}
				
				.chart-info {
					flex: 1;
					
					.chart-label {
						font-size: 24rpx;
						color: #333;
						margin-bottom: 8rpx;
					}
					
					.chart-value {
						font-size: 20rpx;
						color: #666;
					}
				}
			}
		}
	}

	/* 成就徽章 */
	.achievements {
		.badges-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 20rpx;
		}
		
		.badge-item {
			text-align: center;
			padding: 30rpx 20rpx;
			border-radius: 12rpx;
			background: #f8f9fa;
			opacity: 0.5;
			
			&.unlocked {
				opacity: 1;
				background: linear-gradient(135deg, #fff3e0, #ffe0b2);
				border: 2rpx solid #ff9800;
			}
			
			.badge-icon {
				font-size: 48rpx;
				margin-bottom: 12rpx;
			}
			
			.badge-name {
				font-size: 24rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 8rpx;
			}
			
			.badge-desc {
				font-size: 20rpx;
				color: #666;
			}
		}
	}
</style>