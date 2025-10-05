// 本地存储工具类
class StorageUtil {
	// 存储键名常量
	static KEYS = {
		USER_DATA: 'userData',
		TASKS_DATA: 'tasksData',
		EXCHANGE_HISTORY: 'exchangeHistory',
		POINTS_HISTORY: 'pointsHistory',
		SETTINGS: 'settings',
		ACHIEVEMENTS: 'achievements'
	}

	// 获取数据
	static get(key, defaultValue = null) {
		try {
			const data = uni.getStorageSync(key)
			return data || defaultValue
		} catch (error) {
			console.error('Storage get error:', error)
			return defaultValue
		}
	}

	// 存储数据
	static set(key, value) {
		try {
			uni.setStorageSync(key, value)
			return true
		} catch (error) {
			console.error('Storage set error:', error)
			return false
		}
	}

	// 删除数据
	static remove(key) {
		try {
			uni.removeStorageSync(key)
			return true
		} catch (error) {
			console.error('Storage remove error:', error)
			return false
		}
	}

	// 清空所有数据
	static clear() {
		try {
			uni.clearStorageSync()
			return true
		} catch (error) {
			console.error('Storage clear error:', error)
			return false
		}
	}

	// 清除所有数据并重新初始化默认数据
	static clearAllData() {
		try {
			uni.clearStorageSync()
			this.initDefaultData()
			return true
		} catch (e) {
			console.error('清除数据失败:', e)
			return false
		}
	}

	// 获取用户数据
	static getUserData() {
		return this.get(this.KEYS.USER_DATA, {
			name: '小明',
			role: 'student', // student 或 parent
			totalPoints: 0,
			completedTasks: 0,
			streakDays: 0,
			avatar: '👦',
			joinDate: new Date().toISOString().split('T')[0]
		})
	}

	// 更新用户数据
	static updateUserData(userData) {
		return this.set(this.KEYS.USER_DATA, userData)
	}

	// 获取任务数据
	static getTasksData() {
		return this.get(this.KEYS.TASKS_DATA, [])
	}

	// 更新任务数据
	static updateTasksData(tasksData) {
		return this.set(this.KEYS.TASKS_DATA, tasksData)
	}

	// 添加新任务
	static addTask(task) {
		const tasks = this.getTasksData()
		const newTask = {
			id: Date.now(),
			title: task.title,
			category: task.category || 'personal',
			time: task.time || '',
			points: task.points || 10,
			type: task.type || 'daily', // daily, weekly, monthly
			completed: false,
			createdAt: new Date().toISOString(),
			completedAt: null
		}
		tasks.push(newTask)
		return this.updateTasksData(tasks)
	}

	// 更新任务状态
	static updateTaskStatus(taskId, completed) {
		const tasks = this.getTasksData()
		const taskIndex = tasks.findIndex(task => task.id === taskId)
		
		if (taskIndex !== -1) {
			tasks[taskIndex].completed = completed
			tasks[taskIndex].completedAt = completed ? new Date().toISOString() : null
			
			// 如果是完成任务，更新用户积分和完成数
			if (completed) {
				const userData = this.getUserData()
				userData.totalPoints += tasks[taskIndex].points
				userData.completedTasks += 1
				this.updateUserData(userData)
				
				// 添加积分记录
				this.addPointsHistory({
					type: 'earn',
					description: `完成任务：${tasks[taskIndex].title}`,
					points: tasks[taskIndex].points
				})
			} else {
				// 如果是取消完成，扣除积分和完成数
				const userData = this.getUserData()
				userData.totalPoints = Math.max(0, userData.totalPoints - tasks[taskIndex].points)
				userData.completedTasks = Math.max(0, userData.completedTasks - 1)
				this.updateUserData(userData)
			}
			
			return this.updateTasksData(tasks)
		}
		return false
	}

	// 更新任务
	static updateTask(taskId, updatedTask) {
		try {
			const tasks = this.getTasksData()
			const taskIndex = tasks.findIndex(task => task.id === taskId)
			
			if (taskIndex === -1) {
				return false
			}
			
			tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask }
			return this.updateTasksData(tasks)
		} catch (error) {
			console.error('更新任务失败:', error)
			return false
		}
	}

	// 删除任务
	static deleteTask(taskId) {
		const tasks = this.getTasksData()
		const filteredTasks = tasks.filter(task => task.id !== taskId)
		return this.updateTasksData(filteredTasks)
	}

	// 获取兑换历史
	static getExchangeHistory() {
		return this.get(this.KEYS.EXCHANGE_HISTORY, [])
	}

	// 添加兑换记录
	static addExchangeRecord(record) {
		const history = this.getExchangeHistory()
		const newRecord = {
			id: Date.now(),
			name: record.name,
			emoji: record.emoji,
			points: record.points,
			date: this.formatDate(new Date()),
			timestamp: new Date().toISOString()
		}
		history.unshift(newRecord)
		return this.set(this.KEYS.EXCHANGE_HISTORY, history)
	}

	// 获取积分历史
	static getPointsHistory() {
		return this.get(this.KEYS.POINTS_HISTORY, [])
	}

	// 添加积分记录
	static addPointsHistory(record) {
		const history = this.getPointsHistory()
		const newRecord = {
			id: Date.now(),
			type: record.type, // earn 或 spend
			description: record.description,
			points: record.points,
			date: this.formatDateTime(new Date()),
			timestamp: new Date().toISOString()
		}
		history.unshift(newRecord)
		
		// 只保留最近100条记录
		if (history.length > 100) {
			history.splice(100)
		}
		
		return this.set(this.KEYS.POINTS_HISTORY, history)
	}

	// 兑换商品
	static exchangeProduct(productId, points) {
		try {
			const userData = this.getUserData()
			
			// 检查积分是否足够
			if (userData.totalPoints < points) {
				return {
					success: false,
					message: '积分不足'
				}
			}
			
			// 扣除积分
			userData.totalPoints -= points
			this.updateUserData(userData)
			
			// 添加兑换记录
			const exchangeRecord = {
				id: Date.now(),
				productId: productId,
				points: points,
				date: this.formatDate(new Date()),
				status: '已发放'
			}
			this.addExchangeRecord(exchangeRecord)
			
			// 添加积分记录
			const pointsRecord = {
				type: 'spend',
				points: points,
				description: `兑换商品 (ID: ${productId})`
			}
			this.addPointsHistory(pointsRecord)
			
			return {
				success: true,
				message: '兑换成功'
			}
		} catch (error) {
			console.error('兑换商品失败:', error)
			return {
				success: false,
				message: '兑换失败'
			}
		}
	}

	// 获取设置
	static getSettings() {
		return this.get(this.KEYS.SETTINGS, {
			notifications: {
				taskReminder: true,
				dailyReport: true,
				achievement: true
			},
			theme: 'light', // light 或 dark
			language: 'zh-CN',
			privacy: {
				dataCollection: false,
				analytics: false
			}
		})
	}

	// 更新设置
	static updateSettings(settings) {
		return this.set(this.KEYS.SETTINGS, settings)
	}

	// 获取成就数据
	static getAchievements() {
		return this.get(this.KEYS.ACHIEVEMENTS, {
			firstTask: false,
			streak7: false,
			streak30: false,
			points100: false,
			points500: false,
			points1000: false,
			tasks50: false,
			tasks100: false,
			perfectWeek: false
		})
	}

	// 更新成就
	static updateAchievements(achievements) {
		return this.set(this.KEYS.ACHIEVEMENTS, achievements)
	}

	// 检查并解锁成就
	static checkAchievements() {
		const userData = this.getUserData()
		const achievements = this.getAchievements()
		let newAchievements = false

		// 第一个任务
		if (!achievements.firstTask && userData.completedTasks >= 1) {
			achievements.firstTask = true
			newAchievements = true
		}

		// 连续打卡
		if (!achievements.streak7 && userData.streakDays >= 7) {
			achievements.streak7 = true
			newAchievements = true
		}

		if (!achievements.streak30 && userData.streakDays >= 30) {
			achievements.streak30 = true
			newAchievements = true
		}

		// 积分成就
		if (!achievements.points100 && userData.totalPoints >= 100) {
			achievements.points100 = true
			newAchievements = true
		}

		if (!achievements.points500 && userData.totalPoints >= 500) {
			achievements.points500 = true
			newAchievements = true
		}

		if (!achievements.points1000 && userData.totalPoints >= 1000) {
			achievements.points1000 = true
			newAchievements = true
		}

		// 任务完成数成就
		if (!achievements.tasks50 && userData.completedTasks >= 50) {
			achievements.tasks50 = true
			newAchievements = true
		}

		if (!achievements.tasks100 && userData.completedTasks >= 100) {
			achievements.tasks100 = true
			newAchievements = true
		}

		if (newAchievements) {
			this.updateAchievements(achievements)
		}

		return newAchievements
	}

	// 初始化默认数据
	static initDefaultData() {
		// 初始化用户数据
		if (!this.get(this.KEYS.USER_DATA)) {
			this.updateUserData(this.getUserData())
		}

		// 初始化默认任务
		if (this.getTasksData().length === 0) {
			const defaultTasks = [
				{
					id: 1,
					title: '完成数学作业',
					category: 'school',
					time: '18:00',
					points: 20,
					type: 'daily',
					completed: false,
					createdAt: new Date().toISOString(),
					completedAt: null
				},
				{
					id: 2,
					title: '阅读30分钟',
					category: 'personal',
					time: '20:00',
					points: 15,
					type: 'daily',
					completed: false,
					createdAt: new Date().toISOString(),
					completedAt: null
				},
				{
					id: 3,
					title: '整理房间',
					category: 'personal',
					time: '',
					points: 25,
					type: 'weekly',
					completed: false,
					createdAt: new Date().toISOString(),
					completedAt: null
				}
			]
			this.updateTasksData(defaultTasks)
		}

		// 初始化设置
		if (!this.get(this.KEYS.SETTINGS)) {
			this.updateSettings(this.getSettings())
		}

		// 初始化成就
		if (!this.get(this.KEYS.ACHIEVEMENTS)) {
			this.updateAchievements(this.getAchievements())
		}
	}

	// 格式化日期
	static formatDate(date) {
		const month = date.getMonth() + 1
		const day = date.getDate()
		return `${month}月${day}日`
	}

	// 格式化日期时间
	static formatDateTime(date) {
		const year = date.getFullYear()
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const day = date.getDate().toString().padStart(2, '0')
		const hour = date.getHours().toString().padStart(2, '0')
		const minute = date.getMinutes().toString().padStart(2, '0')
		return `${year}-${month}-${day} ${hour}:${minute}`
	}

	// 获取今日任务
	static getTodayTasks() {
		const tasks = this.getTasksData()
		const today = new Date()
		const todayStr = today.toISOString().split('T')[0]

		return tasks.filter(task => {
			if (task.type === 'daily') {
				return true // 每日任务都显示
			} else if (task.type === 'weekly') {
				// 周任务：本周内显示
				const taskDate = new Date(task.createdAt)
				const weekStart = new Date(today)
				weekStart.setDate(today.getDate() - today.getDay())
				return taskDate >= weekStart
			} else if (task.type === 'monthly') {
				// 月任务：本月内显示
				const taskDate = new Date(task.createdAt)
				return taskDate.getMonth() === today.getMonth() && 
				       taskDate.getFullYear() === today.getFullYear()
			}
			return false
		})
	}

	// 计算完成率
	static getCompletionStats() {
		const tasks = this.getTodayTasks()
		const total = tasks.length
		const completed = tasks.filter(task => task.completed).length
		const rate = total > 0 ? Math.round((completed / total) * 100) : 0

		return {
			total,
			completed,
			pending: total - completed,
			rate
		}
	}

	// 获取统计数据
	static getStatistics() {
		const userData = this.getUserData()
		const tasks = this.getTasksData()
		const completedTasks = tasks.filter(task => task.completed)
		
		// 计算连续打卡天数
		let streakDays = 0
		const today = new Date()
		for (let i = 0; i < 30; i++) {
			const checkDate = new Date(today)
			checkDate.setDate(today.getDate() - i)
			const dateStr = this.formatDate(checkDate)
			
			const dayTasks = tasks.filter(task => {
				if (!task.completedAt) return false
				const completedDate = new Date(task.completedAt)
				return this.formatDate(completedDate) === dateStr
			})
			
			if (dayTasks.length > 0) {
				streakDays = i + 1
			} else if (i > 0) {
				break
			}
		}
		
		// 计算完成率
		const completionRates = {
			daily: 0,
			weekly: 0,
			monthly: 0
		}
		
		// 计算每周统计
		const weeklyStats = []
		for (let i = 0; i < 7; i++) {
			const date = new Date()
			date.setDate(date.getDate() - i)
			const dateStr = this.formatDate(date)
			
			const dayTasks = tasks.filter(task => {
				if (!task.completedAt) return false
				const completedDate = new Date(task.completedAt)
				return this.formatDate(completedDate) === dateStr
			})
			
			weeklyStats.unshift({
				date: dateStr,
				completed: dayTasks.length,
				points: dayTasks.reduce((sum, task) => sum + (task.points || 0), 0)
			})
		}
		
		// 积分趋势
		const pointsHistory = this.getPointsHistory()
		const pointsTrend = pointsHistory.slice(0, 7).map(record => ({
			date: record.date,
			points: record.points,
			type: record.type
		}))
		
		// 分类统计
		const categoryStats = [
			{
				name: '学习任务',
				completed: completedTasks.filter(task => task.category === 'school').length,
				total: tasks.filter(task => task.category === 'school').length
			},
			{
				name: '个人任务',
				completed: completedTasks.filter(task => task.category === 'personal').length,
				total: tasks.filter(task => task.category === 'personal').length
			}
		]
		
		// 总体统计
		const overallStats = {
			totalTasks: tasks.length,
			completedTasks: completedTasks.length,
			totalPoints: userData.totalPoints || 0,
			streakDays: streakDays,
			completionRate: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0
		}
		
		return {
			overallStats,
			completionRates,
			weeklyStats,
			pointsTrend,
			categoryStats
		}
	}
}

export default StorageUtil