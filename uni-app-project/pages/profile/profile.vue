<template>
	<view class="container">
		<!-- 用户信息卡片 -->
		<view class="user-card">
			<view class="user-avatar">
				<image 
					:src="userInfo.avatar || '/static/default-avatar.png'" 
					class="avatar-img"
					mode="aspectFill"
				/>
				<view class="avatar-edit" @tap="changeAvatar">
					<text class="iconfont icon-camera">📷</text>
				</view>
			</view>
			<view class="user-info">
				<view class="user-name">{{ userInfo.name || '未设置昵称' }}</view>
				<view class="user-role">{{ userInfo.role === 'parent' ? '👨‍👩‍👧‍👦 家长' : '👦 学生' }}</view>
				<view class="user-stats">
					<view class="stat-item">
						<text class="stat-number">{{ userInfo.totalPoints || 0 }}</text>
						<text class="stat-label">总积分</text>
					</view>
					<view class="stat-item">
						<text class="stat-number">{{ completedTasksCount }}</text>
						<text class="stat-label">已完成</text>
					</view>
					<view class="stat-item">
						<text class="stat-number">{{ streakDays }}</text>
						<text class="stat-label">连续天数</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 快捷功能 -->
		<view class="quick-actions">
			<view class="action-item" @tap="editProfile">
				<view class="action-icon">👤</view>
				<view class="action-text">编辑资料</view>
				<view class="action-arrow">></view>
			</view>
			<view class="action-item" @tap="switchRole" v-if="userInfo.role === 'parent'">
				<view class="action-icon">🔄</view>
				<view class="action-text">切换到学生模式</view>
				<view class="action-arrow">></view>
			</view>
			<view class="action-item" @tap="goToParentMode" v-if="userInfo.role === 'student'">
				<view class="action-icon">👨‍👩‍👧‍👦</view>
				<view class="action-text">家长模式</view>
				<view class="action-arrow">></view>
			</view>
		</view>

		<!-- 设置选项 -->
		<view class="settings-section">
			<view class="section-title">⚙️ 设置</view>
			<view class="settings-list">
				<view class="setting-item" @tap="showNotificationSettings">
					<view class="setting-icon">🔔</view>
					<view class="setting-text">通知设置</view>
					<view class="setting-value">{{ notificationEnabled ? '已开启' : '已关闭' }}</view>
					<view class="setting-arrow">></view>
				</view>
				<view class="setting-item" @tap="showThemeSettings">
					<view class="setting-icon">🎨</view>
					<view class="setting-text">主题设置</view>
					<view class="setting-value">{{ currentTheme }}</view>
					<view class="setting-arrow">></view>
				</view>
				<view class="setting-item" @tap="showLanguageSettings">
					<view class="setting-icon">🌐</view>
					<view class="setting-text">语言设置</view>
					<view class="setting-value">简体中文</view>
					<view class="setting-arrow">></view>
				</view>
				<view class="setting-item" @tap="showPrivacySettings">
					<view class="setting-icon">🔒</view>
					<view class="setting-text">隐私设置</view>
					<view class="setting-arrow">></view>
				</view>
			</view>
		</view>

		<!-- 其他功能 -->
		<view class="other-section">
			<view class="section-title">📱 其他</view>
			<view class="other-list">
				<view class="other-item" @tap="showAbout">
					<view class="other-icon">ℹ️</view>
					<view class="other-text">关于我们</view>
					<view class="other-arrow">></view>
				</view>
				<view class="other-item" @tap="showHelp">
					<view class="other-icon">❓</view>
					<view class="other-text">帮助中心</view>
					<view class="other-arrow">></view>
				</view>
				<view class="other-item" @tap="showFeedback">
					<view class="other-icon">💬</view>
					<view class="other-text">意见反馈</view>
					<view class="other-arrow">></view>
				</view>
				<view class="other-item" @tap="checkUpdate">
					<view class="other-icon">🔄</view>
					<view class="other-text">检查更新</view>
					<view class="other-value">v1.0.0</view>
					<view class="other-arrow">></view>
				</view>
			</view>
		</view>

		<!-- 退出登录 -->
		<view class="logout-section">
			<button class="logout-btn" @tap="logout">退出登录</button>
		</view>

		<!-- 编辑资料弹窗 -->
		<uni-popup ref="editPopup" type="center">
			<view class="edit-popup">
				<view class="popup-title">编辑资料</view>
				<view class="form-item">
					<text class="form-label">昵称</text>
					<input 
						class="form-input" 
						v-model="editForm.name" 
						placeholder="请输入昵称"
						maxlength="20"
					/>
				</view>
				<view class="form-item">
					<text class="form-label">角色</text>
					<picker 
						:value="editForm.roleIndex" 
						:range="roleOptions" 
						@change="onRoleChange"
					>
						<view class="form-input picker">{{ roleOptions[editForm.roleIndex] }}</view>
					</picker>
				</view>
				<view class="popup-actions">
					<button class="cancel-btn" @tap="cancelEdit">取消</button>
					<button class="confirm-btn" @tap="saveProfile">保存</button>
				</view>
			</view>
		</uni-popup>

		<!-- 通知设置弹窗 -->
		<uni-popup ref="notificationPopup" type="center">
			<view class="notification-popup">
				<view class="popup-title">通知设置</view>
				<view class="notification-options">
					<view class="option-item">
						<text class="option-text">任务提醒</text>
						<switch 
							:checked="notificationSettings.taskReminder" 
							@change="onNotificationChange('taskReminder', $event)"
						/>
					</view>
					<view class="option-item">
						<text class="option-text">完成提醒</text>
						<switch 
							:checked="notificationSettings.completionReminder" 
							@change="onNotificationChange('completionReminder', $event)"
						/>
					</view>
					<view class="option-item">
						<text class="option-text">积分提醒</text>
						<switch 
							:checked="notificationSettings.pointsReminder" 
							@change="onNotificationChange('pointsReminder', $event)"
						/>
					</view>
				</view>
				<view class="popup-actions">
					<button class="confirm-btn full" @tap="saveNotificationSettings">确定</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import StorageUtil from '../../utils/storage.js'
	import PermissionUtil from '../../utils/permission.js'
	
	export default {
		data() {
			return {
				userInfo: {},
				tasks: [],
				notificationEnabled: true,
				currentTheme: '默认',
				editForm: {
					name: '',
					roleIndex: 0
				},
				roleOptions: ['👦 学生', '👨‍👩‍👧‍👦 家长'],
				notificationSettings: {
					taskReminder: true,
					completionReminder: true,
					pointsReminder: true
				}
			}
		},
		computed: {
			// 已完成任务数
			completedTasksCount() {
				return this.tasks.filter(task => task.completed).length
			},
			
			// 连续天数（模拟数据）
			streakDays() {
				return 12
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
				// 加载用户数据
				this.userInfo = StorageUtil.getUserData()
				this.editForm.name = this.userInfo.name || ''
				
				// 加载设置数据
				const settings = StorageUtil.getSettings()
				this.notificationSettings = settings.notifications || this.notificationSettings
			},
			
			// 更换头像
			changeAvatar() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						const tempFilePath = res.tempFilePaths[0]
						this.userInfo.avatar = tempFilePath
						this.saveUserData()
						uni.showToast({
							title: '头像更新成功',
							icon: 'success'
						})
					}
				})
			},
			
			// 编辑资料
			editProfile() {
				this.$refs.editPopup.open()
			},
			
			// 角色选择变化
			onRoleChange(e) {
				this.editForm.roleIndex = e.detail.value
			},
			
			// 取消编辑
			cancelEdit() {
				this.$refs.editPopup.close()
				// 重置表单
				this.editForm.name = this.userInfo.name || ''
				this.editForm.roleIndex = this.userInfo.role === 'parent' ? 1 : 0
			},
			
			// 保存资料
			saveProfile() {
				if (!this.editForm.name.trim()) {
					uni.showToast({
						title: '请输入昵称',
						icon: 'none'
					})
					return
				}
				
				const updateData = {
					name: this.editForm.name.trim()
				}
				
				const success = StorageUtil.updateUserData(updateData)
				if (success) {
					this.loadData()
					this.$refs.editPopup.close()
					
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					})
				} else {
					uni.showToast({
						title: '保存失败',
						icon: 'error'
					})
				}
			},
			
			// 切换角色
			switchRole() {
				PermissionUtil.switchRole('student')
				this.loadData()
				uni.showToast({
					title: '已切换到学生模式',
					icon: 'success'
				})
			},
			
			// 进入家长模式
			goToParentMode() {
				uni.navigateTo({
					url: '/pages/parent/parent'
				})
			},
			
			// 显示通知设置
			showNotificationSettings() {
				this.$refs.notificationPopup.open()
			},
			
			// 通知设置变化
			onNotificationChange(key, e) {
				this.notificationSettings[key] = e.detail.value
			},
			
			// 保存通知设置
			saveNotificationSettings() {
				const settings = StorageUtil.getSettings()
				settings.notifications = this.notificationSettings
				const success = StorageUtil.updateSettings(settings)
				
				if (success) {
					this.$refs.notificationPopup.close()
					uni.showToast({
						title: '设置已保存',
						icon: 'success'
					})
				} else {
					uni.showToast({
						title: '保存失败',
						icon: 'error'
					})
				}
			},
			
			// 显示主题设置
			showThemeSettings() {
				uni.showActionSheet({
					itemList: ['默认主题', '深色主题', '护眼主题'],
					success: (res) => {
						const themes = ['默认', '深色', '护眼']
						this.currentTheme = themes[res.tapIndex]
						uni.showToast({
							title: `已切换到${this.currentTheme}主题`,
							icon: 'success'
						})
					}
				})
			},
			
			// 显示语言设置
			showLanguageSettings() {
				uni.showActionSheet({
					itemList: ['简体中文', 'English'],
					success: (res) => {
						if (res.tapIndex === 0) {
							uni.showToast({
								title: '当前已是简体中文',
								icon: 'none'
							})
						} else {
							uni.showToast({
								title: 'English is not supported yet',
								icon: 'none'
							})
						}
					}
				})
			},
			
			// 显示隐私设置
			showPrivacySettings() {
				uni.showModal({
					title: '隐私设置',
					content: '我们重视您的隐私，所有数据仅存储在本地设备中。',
					showCancel: false
				})
			},
			
			// 显示关于我们
			showAbout() {
				uni.showModal({
					title: '关于我们',
					content: '每日打卡 v1.0.0\n一款简单易用的任务管理应用\n帮助您养成良好的习惯',
					showCancel: false
				})
			},
			
			// 显示帮助中心
			showHelp() {
				uni.showModal({
					title: '帮助中心',
					content: '如需帮助，请联系客服：\n邮箱：support@example.com\n电话：400-123-4567',
					showCancel: false
				})
			},
			
			// 显示意见反馈
			showFeedback() {
				uni.showModal({
					title: '意见反馈',
					content: '您的意见对我们很重要！\n请通过邮箱 feedback@example.com 联系我们',
					showCancel: false
				})
			},
			
			// 检查更新
			checkUpdate() {
				uni.showLoading({
					title: '检查中...'
				})
				
				setTimeout(() => {
					uni.hideLoading()
					uni.showToast({
						title: '当前已是最新版本',
						icon: 'success'
					})
				}, 1500)
			},
			
			// 退出登录
			logout() {
				uni.showModal({
					title: '确认退出',
					content: '退出登录后，本地数据将被清除',
					success: (res) => {
						if (res.confirm) {
							// 清除本地数据
							StorageUtil.clearAllData()
							
							// 重置用户信息
							this.userInfo = {
								name: '用户',
								role: 'student',
								totalPoints: 0
							}
							
							// 初始化默认数据
							this.initDefaultData()
							
							uni.showToast({
								title: '已退出登录',
								icon: 'success'
							})
							
							// 返回首页
							uni.switchTab({
								url: '/pages/index/index'
							})
						}
					}
				})
			},
			
			// 初始化默认数据
			initDefaultData() {
				const defaultUserData = {
					name: '用户',
					role: 'student',
					totalPoints: 0
				}
				
				const defaultTaskData = [
					{
						id: 1,
						title: '完成数学作业',
						category: 'school',
						time: '18:00',
						points: 20,
						type: 'daily',
						completed: false,
						date: new Date().toISOString().split('T')[0]
					},
					{
						id: 2,
						title: '阅读30分钟',
						category: 'personal',
						time: '20:00',
						points: 15,
						type: 'daily',
						completed: false,
						date: new Date().toISOString().split('T')[0]
					}
				]
				
				StorageUtil.updateUserData(defaultUserData)
				StorageUtil.updateTasksData(defaultTaskData)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #f8f9fa;
		min-height: 100vh;
	}

	/* 用户信息卡片 */
	.user-card {
		background: linear-gradient(135deg, #4A90E2, #357ABD);
		padding: 40rpx 30rpx;
		color: white;
		display: flex;
		align-items: center;
		
		.user-avatar {
			position: relative;
			margin-right: 30rpx;
			
			.avatar-img {
				width: 120rpx;
				height: 120rpx;
				border-radius: 60rpx;
				border: 4rpx solid rgba(255, 255, 255, 0.3);
			}
			
			.avatar-edit {
				position: absolute;
				bottom: -8rpx;
				right: -8rpx;
				width: 48rpx;
				height: 48rpx;
				background: rgba(255, 255, 255, 0.9);
				border-radius: 24rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 20rpx;
			}
		}
		
		.user-info {
			flex: 1;
			
			.user-name {
				font-size: 36rpx;
				font-weight: bold;
				margin-bottom: 8rpx;
			}
			
			.user-role {
				font-size: 24rpx;
				opacity: 0.8;
				margin-bottom: 20rpx;
			}
			
			.user-stats {
				display: flex;
				gap: 30rpx;
				
				.stat-item {
					text-align: center;
					
					.stat-number {
						display: block;
						font-size: 28rpx;
						font-weight: bold;
						margin-bottom: 4rpx;
					}
					
					.stat-label {
						font-size: 20rpx;
						opacity: 0.8;
					}
				}
			}
		}
	}

	/* 快捷功能 */
	.quick-actions {
		background: white;
		margin: 20rpx;
		border-radius: 16rpx;
		overflow: hidden;
		
		.action-item {
			display: flex;
			align-items: center;
			padding: 30rpx;
			border-bottom: 2rpx solid #f0f0f0;
			
			&:last-child {
				border-bottom: none;
			}
			
			.action-icon {
				font-size: 32rpx;
				margin-right: 20rpx;
			}
			
			.action-text {
				flex: 1;
				font-size: 28rpx;
				color: #333;
			}
			
			.action-arrow {
				font-size: 24rpx;
				color: #999;
			}
		}
	}

	/* 设置选项 */
	.settings-section, .other-section {
		margin: 20rpx;
		
		.section-title {
			font-size: 28rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 16rpx;
			padding: 0 10rpx;
		}
		
		.settings-list, .other-list {
			background: white;
			border-radius: 16rpx;
			overflow: hidden;
		}
		
		.setting-item, .other-item {
			display: flex;
			align-items: center;
			padding: 30rpx;
			border-bottom: 2rpx solid #f0f0f0;
			
			&:last-child {
				border-bottom: none;
			}
			
			.setting-icon, .other-icon {
				font-size: 32rpx;
				margin-right: 20rpx;
			}
			
			.setting-text, .other-text {
				flex: 1;
				font-size: 28rpx;
				color: #333;
			}
			
			.setting-value, .other-value {
				font-size: 24rpx;
				color: #666;
				margin-right: 16rpx;
			}
			
			.setting-arrow, .other-arrow {
				font-size: 24rpx;
				color: #999;
			}
		}
	}

	/* 退出登录 */
	.logout-section {
		margin: 40rpx 20rpx 20rpx;
		
		.logout-btn {
			width: 100%;
			height: 88rpx;
			background: #dc3545;
			color: white;
			border: none;
			border-radius: 16rpx;
			font-size: 28rpx;
			font-weight: bold;
		}
	}

	/* 弹窗样式 */
	.edit-popup, .notification-popup {
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
			
			.form-label {
				display: block;
				font-size: 24rpx;
				color: #666;
				margin-bottom: 12rpx;
			}
			
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
				
				&.full {
					flex: none;
					width: 100%;
				}
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

	.notification-popup {
		.notification-options {
			.option-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 20rpx 0;
				border-bottom: 2rpx solid #f0f0f0;
				
				&:last-child {
					border-bottom: none;
				}
				
				.option-text {
					font-size: 28rpx;
					color: #333;
				}
			}
		}
	}
</style>