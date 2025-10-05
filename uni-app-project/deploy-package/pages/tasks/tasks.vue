<template>
	<view class="container">
		<!-- 顶部操作栏 -->
		<view class="header-actions card">
			<view class="actions-row flex justify-between align-center">
				<view class="filter-tabs flex">
					<view 
						class="filter-tab" 
						:class="{ 'active': currentFilter === 'all' }"
						@click="setFilter('all')"
					>
						全部
					</view>
					<view 
						class="filter-tab" 
						:class="{ 'active': currentFilter === 'pending' }"
						@click="setFilter('pending')"
					>
						待完成
					</view>
					<view 
						class="filter-tab" 
						:class="{ 'active': currentFilter === 'completed' }"
						@click="setFilter('completed')"
					>
						已完成
					</view>
				</view>
				<view class="add-task-btn" @click="showAddTaskModal">
					<text class="add-icon">+</text>
				</view>
			</view>
		</view>

		<!-- 任务统计 -->
		<view class="stats-section card">
			<view class="stats-grid">
				<view class="stat-item">
					<view class="stat-number">{{ totalTasks }}</view>
					<view class="stat-label">总任务</view>
				</view>
				<view class="stat-item">
					<view class="stat-number">{{ completedTasks }}</view>
					<view class="stat-label">已完成</view>
				</view>
				<view class="stat-item">
					<view class="stat-number">{{ pendingTasks }}</view>
					<view class="stat-label">待完成</view>
				</view>
				<view class="stat-item">
					<view class="stat-number">{{ totalPoints }}</view>
					<view class="stat-label">总积分</view>
				</view>
			</view>
		</view>

		<!-- 任务列表 -->
		<view class="task-list-section">
			<view class="section-title mb-2">📋 任务列表</view>
			
			<!-- 学校任务 -->
			<view class="task-category mb-3" v-if="filteredSchoolTasks.length > 0">
				<view class="category-header flex justify-between align-center">
					<view class="category-title">🏫 学校任务</view>
					<view class="category-count">{{ filteredSchoolTasks.length }}</view>
				</view>
				<view class="task-list">
					<view 
						class="task-item" 
						v-for="task in filteredSchoolTasks" 
						:key="task.id"
						:class="{ 'completed': task.completed }"
					>
						<view class="task-main flex align-center" @click="toggleTask(task)">
							<view class="task-checkbox">
								<text v-if="task.completed">✅</text>
								<text v-else>⭕</text>
							</view>
							<view class="task-content flex-1 ml-2">
								<view class="task-title">{{ task.title }}</view>
								<view class="task-meta">
									<text class="task-time">⏰ {{ task.time }}</text>
									<text class="task-points">💎 {{ task.points }}积分</text>
									<text class="task-type">{{ getTaskTypeText(task.type) }}</text>
								</view>
							</view>
						</view>
						<view class="task-actions">
							<view class="action-btn edit" @click="editTask(task)">编辑</view>
							<view class="action-btn delete" @click="deleteTask(task)">删除</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 个人任务 -->
			<view class="task-category mb-3" v-if="filteredPersonalTasks.length > 0">
				<view class="category-header flex justify-between align-center">
					<view class="category-title">🎯 个人任务</view>
					<view class="category-count">{{ filteredPersonalTasks.length }}</view>
				</view>
				<view class="task-list">
					<view 
						class="task-item" 
						v-for="task in filteredPersonalTasks" 
						:key="task.id"
						:class="{ 'completed': task.completed }"
					>
						<view class="task-main flex align-center" @click="toggleTask(task)">
							<view class="task-checkbox">
								<text v-if="task.completed">✅</text>
								<text v-else>⭕</text>
							</view>
							<view class="task-content flex-1 ml-2">
								<view class="task-title">{{ task.title }}</view>
								<view class="task-meta">
									<text class="task-time">⏰ {{ task.time }}</text>
									<text class="task-points">💎 {{ task.points }}积分</text>
									<text class="task-type">{{ getTaskTypeText(task.type) }}</text>
								</view>
							</view>
						</view>
						<view class="task-actions">
							<view class="action-btn edit" @click="editTask(task)">编辑</view>
							<view class="action-btn delete" @click="deleteTask(task)">删除</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view class="empty-state" v-if="filteredTasks.length === 0">
				<view class="empty-icon">📝</view>
				<view class="empty-text">{{ getEmptyText() }}</view>
				<view class="empty-tip" v-if="currentFilter === 'all'">点击右上角 + 号添加任务</view>
			</view>
		</view>

		<!-- 添加/编辑任务弹窗 -->
		<view class="modal-overlay" v-if="showModal" @click="hideModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<view class="modal-title">{{ isEditing ? '编辑任务' : '添加任务' }}</view>
					<view class="modal-close" @click="hideModal">×</view>
				</view>
				<view class="modal-body">
					<view class="form-group">
						<view class="form-label">任务标题</view>
						<input 
							class="form-input" 
							v-model="taskForm.title" 
							placeholder="请输入任务标题"
							maxlength="50"
						/>
					</view>
					<view class="form-group">
						<view class="form-label">任务分类</view>
						<view class="category-options flex">
							<view 
								class="category-option" 
								:class="{ 'active': taskForm.category === 'school' }"
								@click="taskForm.category = 'school'"
							>
								🏫 学校任务
							</view>
							<view 
								class="category-option" 
								:class="{ 'active': taskForm.category === 'personal' }"
								@click="taskForm.category = 'personal'"
							>
								🎯 个人任务
							</view>
						</view>
					</view>
					<view class="form-group">
						<view class="form-label">完成时间</view>
						<picker mode="time" :value="taskForm.time" @change="onTimeChange">
							<view class="picker-input">{{ taskForm.time || '选择时间' }}</view>
						</picker>
					</view>
					<view class="form-group">
						<view class="form-label">奖励积分</view>
						<input 
							class="form-input" 
							v-model.number="taskForm.points" 
							type="number"
							placeholder="请输入积分（1-100）"
							min="1"
							max="100"
						/>
					</view>
					<view class="form-group">
						<view class="form-label">任务类型</view>
						<view class="type-options flex">
							<view 
								class="type-option" 
								:class="{ 'active': taskForm.type === 'daily' }"
								@click="taskForm.type = 'daily'"
							>
								每日
							</view>
							<view 
								class="type-option" 
								:class="{ 'active': taskForm.type === 'weekly' }"
								@click="taskForm.type = 'weekly'"
							>
								每周
							</view>
							<view 
								class="type-option" 
								:class="{ 'active': taskForm.type === 'monthly' }"
								@click="taskForm.type = 'monthly'"
							>
								每月
							</view>
						</view>
					</view>
				</view>
				<view class="modal-footer">
					<view class="btn-secondary" @click="hideModal">取消</view>
					<view class="btn-primary" @click="saveTask">{{ isEditing ? '保存' : '添加' }}</view>
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
				tasks: [],
				currentFilter: 'all',
				showModal: false,
				isEditing: false,
				editingTaskId: null,
				taskForm: {
					title: '',
					category: 'school',
					time: '',
					points: 10,
					type: 'daily'
				}
			}
		},
		computed: {
			// 过滤后的任务
			filteredTasks() {
				switch (this.currentFilter) {
					case 'pending':
						return this.tasks.filter(task => !task.completed)
					case 'completed':
						return this.tasks.filter(task => task.completed)
					default:
						return this.tasks
				}
			},
			
			// 过滤后的学校任务
			filteredSchoolTasks() {
				return this.filteredTasks.filter(task => task.category === 'school')
			},
			
			// 过滤后的个人任务
			filteredPersonalTasks() {
				return this.filteredTasks.filter(task => task.category === 'personal')
			},
			
			// 统计数据
			totalTasks() {
				return this.tasks.length
			},
			
			completedTasks() {
				return this.tasks.filter(task => task.completed).length
			},
			
			pendingTasks() {
				return this.tasks.filter(task => !task.completed).length
			},
			
			totalPoints() {
				return this.tasks.reduce((sum, task) => sum + task.points, 0)
			}
		},
		onLoad() {
			this.loadTasks()
		},
		onShow() {
			this.loadTasks()
		},
		methods: {
			// 加载任务数据
			loadTasks() {
				this.tasks = StorageUtil.getAllTasks()
			},
			
			// 设置过滤器
			setFilter(filter) {
				this.activeFilter = filter
			},
			
			// 切换任务完成状态
			toggleTask(task) {
				// 检查权限
				if (!PermissionUtil.checkPermission(PermissionUtil.PERMISSIONS.TASK_COMPLETE)) {
					PermissionUtil.showPermissionDenied()
					return
				}
				
				const newStatus = !task.completed
				const success = StorageUtil.updateTaskStatus(task.id, newStatus)
				
				if (success) {
					// 重新加载数据
					this.loadTasks()
					
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
			
			// 显示添加任务弹窗
			showAddTaskModal() {
				// 检查权限
				if (!PermissionUtil.checkPermission(PermissionUtil.PERMISSIONS.TASK_ADD)) {
					PermissionUtil.showPermissionDenied()
					return
				}
				
				this.editingTask = null
				this.resetTaskForm()
				this.showModal = true
			},
			
			// 编辑任务
			editTask(task) {
				// 检查权限
				if (!PermissionUtil.checkPermission(PermissionUtil.PERMISSIONS.TASK_EDIT)) {
					PermissionUtil.showPermissionDenied()
					return
				}
				
				this.editingTask = task
				this.taskForm = {
					title: task.title,
					category: task.category,
					time: task.time,
					points: task.points,
					type: task.type
				}
				this.showModal = true
			},
			
			// 删除任务
			deleteTask(task) {
				// 检查权限
				if (!PermissionUtil.checkPermission(PermissionUtil.PERMISSIONS.TASK_DELETE)) {
					PermissionUtil.showPermissionDenied()
					return
				}
				
				uni.showModal({
					title: '确认删除',
					content: `确定要删除任务"${task.title}"吗？`,
					success: (res) => {
						if (res.confirm) {
							const success = StorageUtil.deleteTask(task.id)
							if (success) {
								this.loadTasks()
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								})
							} else {
								uni.showToast({
									title: '删除失败',
									icon: 'error'
								})
							}
						}
					}
				})
			},
			
			// 隐藏弹窗
			hideModal() {
				this.showModal = false
				this.resetTaskForm()
			},
			
			// 重置表单
			resetTaskForm() {
				this.taskForm = {
					title: '',
					category: 'school',
					time: '',
					points: 10,
					type: 'daily'
				}
			},
			
			// 时间选择
			onTimeChange(e) {
				this.taskForm.time = e.detail.value
			},
			
			// 保存任务
			saveTask() {
				// 表单验证
				if (!this.taskForm.title.trim()) {
					uni.showToast({
						title: '请输入任务标题',
						icon: 'none'
					})
					return
				}
				
				if (!this.taskForm.time) {
					uni.showToast({
						title: '请选择完成时间',
						icon: 'none'
					})
					return
				}
				
				if (this.taskForm.points < 1 || this.taskForm.points > 100) {
					uni.showToast({
						title: '积分范围为1-100',
						icon: 'none'
					})
					return
				}
				
				let success = false
				
				if (this.editingTask) {
					// 编辑任务
					success = StorageUtil.updateTask(this.editingTask.id, this.taskForm)
				} else {
					// 添加新任务
					const newTask = {
						...this.taskForm,
						completed: false
					}
					success = StorageUtil.addTask(newTask)
				}
				
				if (success) {
					this.loadTasks()
					this.hideModal()
					
					uni.showToast({
						title: this.editingTask ? '保存成功' : '添加成功',
						icon: 'success'
					})
				} else {
					uni.showToast({
						title: '操作失败',
						icon: 'error'
					})
				}
			},
			
			// 获取任务类型文本
			getTaskTypeText(type) {
				const typeMap = {
					daily: '每日',
					weekly: '每周',
					monthly: '每月'
				}
				return typeMap[type] || '每日'
			},
			
			// 获取空状态文本
			getEmptyText() {
				switch (this.currentFilter) {
					case 'pending':
						return '暂无待完成任务'
					case 'completed':
						return '暂无已完成任务'
					default:
						return '暂无任务'
				}
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

	/* 顶部操作栏 */
	.header-actions {
		.filter-tabs {
			gap: 20rpx;
		}
		
		.filter-tab {
			padding: 12rpx 24rpx;
			border-radius: 20rpx;
			font-size: 24rpx;
			color: #666;
			background: #f8f9fa;
			
			&.active {
				background: #4A90E2;
				color: white;
			}
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

	/* 统计区域 */
	.stats-section {
		.stats-grid {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 20rpx;
		}
		
		.stat-item {
			text-align: center;
			
			.stat-number {
				font-size: 36rpx;
				font-weight: bold;
				color: #4A90E2;
				margin-bottom: 8rpx;
			}
			
			.stat-label {
				font-size: 22rpx;
				color: #666;
			}
		}
	}

	/* 任务列表 */
	.task-list-section {
		.section-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
		
		.task-category {
			.category-header {
				margin-bottom: 20rpx;
				
				.category-title {
					font-size: 28rpx;
					font-weight: bold;
					color: #333;
				}
				
				.category-count {
					font-size: 22rpx;
					color: #666;
					background: #f8f9fa;
					padding: 8rpx 16rpx;
					border-radius: 12rpx;
				}
			}
		}
		
		.task-item {
			background: white;
			border-radius: 16rpx;
			padding: 24rpx;
			margin-bottom: 16rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
			
			&.completed {
				opacity: 0.7;
				
				.task-title {
					text-decoration: line-through;
					color: #999;
				}
			}
			
			.task-main {
				margin-bottom: 16rpx;
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
				
				.task-time, .task-points, .task-type {
					font-size: 22rpx;
					color: #666;
				}
				
				.task-points {
					color: #4A90E2;
				}
				
				.task-type {
					color: #28a745;
				}
			}
			
			.task-actions {
				display: flex;
				gap: 20rpx;
				justify-content: flex-end;
				
				.action-btn {
					padding: 8rpx 16rpx;
					border-radius: 8rpx;
					font-size: 22rpx;
					
					&.edit {
						background: #e3f2fd;
						color: #1976d2;
					}
					
					&.delete {
						background: #ffebee;
						color: #d32f2f;
					}
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

	/* 弹窗样式 */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}
	
	.modal-content {
		background: white;
		border-radius: 16rpx;
		width: 90%;
		max-width: 600rpx;
		max-height: 80vh;
		overflow: hidden;
	}
	
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 2rpx solid #f0f0f0;
		
		.modal-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
		
		.modal-close {
			font-size: 40rpx;
			color: #999;
			width: 40rpx;
			height: 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	
	.modal-body {
		padding: 30rpx;
		max-height: 60vh;
		overflow-y: auto;
		
		.form-group {
			margin-bottom: 30rpx;
			
			.form-label {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 16rpx;
			}
			
			.form-input {
				width: 100%;
				padding: 20rpx;
				border: 2rpx solid #e0e0e0;
				border-radius: 8rpx;
				font-size: 28rpx;
				background: #fafafa;
			}
			
			.picker-input {
				padding: 20rpx;
				border: 2rpx solid #e0e0e0;
				border-radius: 8rpx;
				font-size: 28rpx;
				background: #fafafa;
				color: #333;
			}
			
			.category-options, .type-options {
				gap: 20rpx;
			}
			
			.category-option, .type-option {
				flex: 1;
				padding: 20rpx;
				border: 2rpx solid #e0e0e0;
				border-radius: 8rpx;
				text-align: center;
				font-size: 24rpx;
				color: #666;
				background: #fafafa;
				
				&.active {
					border-color: #4A90E2;
					background: #e3f2fd;
					color: #4A90E2;
				}
			}
		}
	}
	
	.modal-footer {
		display: flex;
		gap: 20rpx;
		padding: 30rpx;
		border-top: 2rpx solid #f0f0f0;
		
		.btn-secondary, .btn-primary {
			flex: 1;
			padding: 24rpx;
			border-radius: 8rpx;
			text-align: center;
			font-size: 28rpx;
		}
		
		.btn-secondary {
			background: #f8f9fa;
			color: #666;
			border: 2rpx solid #e9ecef;
		}
		
		.btn-primary {
			background: #4A90E2;
			color: white;
		}
	}
</style>