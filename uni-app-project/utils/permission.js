// 权限管理工具类
import StorageUtil from './storage.js'

class PermissionUtil {
	// 用户角色常量
	static ROLES = {
		STUDENT: 'student',
		PARENT: 'parent'
	}

	// 权限常量
	static PERMISSIONS = {
		// 任务管理权限
		TASK_CREATE: 'task_create',
		TASK_ADD: 'task_add',
		TASK_EDIT: 'task_edit',
		TASK_DELETE: 'task_delete',
		TASK_VIEW: 'task_view',
		TASK_COMPLETE: 'task_complete',
		
		// 积分管理权限
		POINTS_VIEW: 'points_view',
		POINTS_EDIT: 'points_edit',
		POINTS_HISTORY: 'points_history',
		
		// 商城权限
		SHOP_VIEW: 'shop_view',
		SHOP_EXCHANGE: 'shop_exchange',
		SHOP_MANAGE: 'shop_manage',
		
		// 统计权限
		STATS_VIEW: 'stats_view',
		STATS_EXPORT: 'stats_export',
		
		// 设置权限
		SETTINGS_VIEW: 'settings_view',
		SETTINGS_EDIT: 'settings_edit',
		ROLE_SWITCH: 'role_switch',
		
		// 家长专属权限
		PARENT_MODE: 'parent_mode',
		CHILD_MONITOR: 'child_monitor',
		REWARD_MANAGE: 'reward_manage',
		DATA_ANALYSIS: 'data_analysis'
	}

	// 角色权限映射
	static ROLE_PERMISSIONS = {
		[this.ROLES.STUDENT]: [
			this.PERMISSIONS.TASK_VIEW,
			this.PERMISSIONS.TASK_COMPLETE,
			this.PERMISSIONS.POINTS_VIEW,
			this.PERMISSIONS.POINTS_HISTORY,
			this.PERMISSIONS.SHOP_VIEW,
			this.PERMISSIONS.SHOP_EXCHANGE,
			this.PERMISSIONS.STATS_VIEW,
			this.PERMISSIONS.SETTINGS_VIEW,
			this.PERMISSIONS.ROLE_SWITCH
		],
		[this.ROLES.PARENT]: [
			this.PERMISSIONS.TASK_CREATE,
			this.PERMISSIONS.TASK_ADD,
			this.PERMISSIONS.TASK_EDIT,
			this.PERMISSIONS.TASK_DELETE,
			this.PERMISSIONS.TASK_VIEW,
			this.PERMISSIONS.TASK_COMPLETE,
			this.PERMISSIONS.POINTS_VIEW,
			this.PERMISSIONS.POINTS_EDIT,
			this.PERMISSIONS.POINTS_HISTORY,
			this.PERMISSIONS.SHOP_VIEW,
			this.PERMISSIONS.SHOP_EXCHANGE,
			this.PERMISSIONS.SHOP_MANAGE,
			this.PERMISSIONS.STATS_VIEW,
			this.PERMISSIONS.STATS_EXPORT,
			this.PERMISSIONS.SETTINGS_VIEW,
			this.PERMISSIONS.SETTINGS_EDIT,
			this.PERMISSIONS.ROLE_SWITCH,
			this.PERMISSIONS.PARENT_MODE,
			this.PERMISSIONS.CHILD_MONITOR,
			this.PERMISSIONS.REWARD_MANAGE,
			this.PERMISSIONS.DATA_ANALYSIS
		]
	}

	// 获取当前用户角色
	static getCurrentRole() {
		const userData = StorageUtil.getUserData()
		return userData.role || this.ROLES.STUDENT
	}

	// 检查是否有指定权限
	static hasPermission(permission) {
		const currentRole = this.getCurrentRole()
		const rolePermissions = this.ROLE_PERMISSIONS[currentRole] || []
		return rolePermissions.includes(permission)
	}

	// 检查权限（hasPermission的别名，保持API一致性）
	static checkPermission(permission) {
		return this.hasPermission(permission)
	}

	// 检查是否有多个权限中的任意一个
	static hasAnyPermission(permissions) {
		return permissions.some(permission => this.hasPermission(permission))
	}

	// 检查是否有所有指定权限
	static hasAllPermissions(permissions) {
		return permissions.every(permission => this.hasPermission(permission))
	}

	// 检查是否为学生角色
	static isStudent() {
		return this.getCurrentRole() === this.ROLES.STUDENT
	}

	// 检查是否为家长角色
	static isParent() {
		return this.getCurrentRole() === this.ROLES.PARENT
	}

	// 切换角色
	static switchRole(newRole) {
		if (!Object.values(this.ROLES).includes(newRole)) {
			throw new Error('Invalid role')
		}

		const userData = StorageUtil.getUserData()
		userData.role = newRole
		return StorageUtil.updateUserData(userData)
	}

	// 获取角色显示名称
	static getRoleDisplayName(role = null) {
		const targetRole = role || this.getCurrentRole()
		const roleNames = {
			[this.ROLES.STUDENT]: '学生模式',
			[this.ROLES.PARENT]: '家长模式'
		}
		return roleNames[targetRole] || '未知角色'
	}

	// 获取当前角色的所有权限
	static getCurrentPermissions() {
		const currentRole = this.getCurrentRole()
		return this.ROLE_PERMISSIONS[currentRole] || []
	}

	// 权限检查装饰器（用于页面或方法）
	static requirePermission(permission) {
		return function(target, propertyKey, descriptor) {
			const originalMethod = descriptor.value
			
			descriptor.value = function(...args) {
				if (!PermissionUtil.hasPermission(permission)) {
					uni.showToast({
						title: '权限不足',
						icon: 'none'
					})
					return
				}
				return originalMethod.apply(this, args)
			}
			
			return descriptor
		}
	}

	// 检查任务操作权限
	static canCreateTask() {
		return this.hasPermission(this.PERMISSIONS.TASK_CREATE)
	}

	static canEditTask() {
		return this.hasPermission(this.PERMISSIONS.TASK_EDIT)
	}

	static canDeleteTask() {
		return this.hasPermission(this.PERMISSIONS.TASK_DELETE)
	}

	static canCompleteTask() {
		return this.hasPermission(this.PERMISSIONS.TASK_COMPLETE)
	}

	// 检查积分操作权限
	static canViewPoints() {
		return this.hasPermission(this.PERMISSIONS.POINTS_VIEW)
	}

	static canEditPoints() {
		return this.hasPermission(this.PERMISSIONS.POINTS_EDIT)
	}

	// 检查商城操作权限
	static canViewShop() {
		return this.hasPermission(this.PERMISSIONS.SHOP_VIEW)
	}

	static canExchangeItems() {
		return this.hasPermission(this.PERMISSIONS.SHOP_EXCHANGE)
	}

	static canManageShop() {
		return this.hasPermission(this.PERMISSIONS.SHOP_MANAGE)
	}

	// 检查家长专属权限
	static canAccessParentMode() {
		return this.hasPermission(this.PERMISSIONS.PARENT_MODE)
	}

	static canMonitorChild() {
		return this.hasPermission(this.PERMISSIONS.CHILD_MONITOR)
	}

	static canManageRewards() {
		return this.hasPermission(this.PERMISSIONS.REWARD_MANAGE)
	}

	static canAnalyzeData() {
		return this.hasPermission(this.PERMISSIONS.DATA_ANALYSIS)
	}

	// 获取受限功能提示
	static getRestrictedMessage(permission) {
		const messages = {
			[this.PERMISSIONS.TASK_CREATE]: '只有家长可以创建新任务',
			[this.PERMISSIONS.TASK_EDIT]: '只有家长可以编辑任务',
			[this.PERMISSIONS.TASK_DELETE]: '只有家长可以删除任务',
			[this.PERMISSIONS.POINTS_EDIT]: '只有家长可以修改积分',
			[this.PERMISSIONS.SHOP_MANAGE]: '只有家长可以管理商城',
			[this.PERMISSIONS.PARENT_MODE]: '请切换到家长模式',
			[this.PERMISSIONS.CHILD_MONITOR]: '只有家长可以查看监控数据',
			[this.PERMISSIONS.REWARD_MANAGE]: '只有家长可以管理奖励',
			[this.PERMISSIONS.DATA_ANALYSIS]: '只有家长可以查看数据分析'
		}
		return messages[permission] || '权限不足'
	}

	// 显示权限不足提示
	static showPermissionDenied(permission) {
		const message = this.getRestrictedMessage(permission)
		uni.showModal({
			title: '权限提示',
			content: message,
			showCancel: false,
			confirmText: '我知道了'
		})
	}

	// 权限验证中间件
	static checkPermissionMiddleware(permission, showTip = true) {
		const hasPermission = this.hasPermission(permission)
		if (!hasPermission && showTip) {
			this.showPermissionDenied(permission)
		}
		return hasPermission
	}

	// 获取页面访问权限配置
	static getPagePermissions() {
		return {
			'/pages/index/index': [this.PERMISSIONS.TASK_VIEW],
			'/pages/tasks/tasks': [this.PERMISSIONS.TASK_VIEW],
			'/pages/stats/stats': [this.PERMISSIONS.STATS_VIEW],
			'/pages/profile/profile': [this.PERMISSIONS.SETTINGS_VIEW],
			'/pages/parent/parent': [this.PERMISSIONS.PARENT_MODE],
			'/pages/shop/shop': [this.PERMISSIONS.SHOP_VIEW]
		}
	}

	// 检查页面访问权限
	static canAccessPage(pagePath) {
		const pagePermissions = this.getPagePermissions()
		const requiredPermissions = pagePermissions[pagePath]
		
		if (!requiredPermissions) {
			return true // 没有配置权限要求的页面默认允许访问
		}
		
		return this.hasAnyPermission(requiredPermissions)
	}

	// 获取导航栏配置（根据权限过滤）
	static getFilteredTabBar() {
		const allTabs = [
			{
				pagePath: '/pages/index/index',
				text: '首页',
				iconPath: '/static/icons/home.png',
				selectedIconPath: '/static/icons/home-active.png',
				permission: this.PERMISSIONS.TASK_VIEW
			},
			{
				pagePath: '/pages/tasks/tasks',
				text: '任务',
				iconPath: '/static/icons/tasks.png',
				selectedIconPath: '/static/icons/tasks-active.png',
				permission: this.PERMISSIONS.TASK_VIEW
			},
			{
				pagePath: '/pages/stats/stats',
				text: '统计',
				iconPath: '/static/icons/stats.png',
				selectedIconPath: '/static/icons/stats-active.png',
				permission: this.PERMISSIONS.STATS_VIEW
			},
			{
				pagePath: '/pages/profile/profile',
				text: '我的',
				iconPath: '/static/icons/profile.png',
				selectedIconPath: '/static/icons/profile-active.png',
				permission: this.PERMISSIONS.SETTINGS_VIEW
			}
		]

		return allTabs.filter(tab => this.hasPermission(tab.permission))
	}

	// 初始化权限系统
	static init() {
		// 检查是否有有效的用户角色
		const userData = StorageUtil.getUserData()
		if (!userData.role || !Object.values(this.ROLES).includes(userData.role)) {
			// 默认设置为学生角色
			userData.role = this.ROLES.STUDENT
			StorageUtil.updateUserData(userData)
		}
	}
}

export default PermissionUtil