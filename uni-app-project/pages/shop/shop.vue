<template>
	<view class="container">
		<!-- 积分余额 -->
		<view class="points-balance">
			<view class="balance-card">
				<view class="balance-icon">💎</view>
				<view class="balance-info">
					<view class="balance-title">我的积分</view>
					<view class="balance-amount">{{ userPoints }}</view>
				</view>
				<view class="balance-history" @tap="showPointsHistory">
					<text>积分明细</text>
				</view>
			</view>
		</view>

		<!-- 商品分类 -->
		<view class="category-tabs">
			<view 
				class="tab-item" 
				v-for="(category, index) in categories" 
				:key="index"
				:class="{ 'active': activeCategory === index }"
				@tap="switchCategory(index)"
			>
				<text class="tab-icon">{{ category.icon }}</text>
				<text class="tab-text">{{ category.name }}</text>
			</view>
		</view>

		<!-- 商品列表 -->
		<view class="products-section">
			<view class="section-title">
				<text>{{ categories[activeCategory].name }}</text>
				<text class="product-count">{{ filteredProducts.length }}件商品</text>
			</view>
			
			<view class="products-grid">
				<view 
					class="product-item" 
					v-for="product in filteredProducts" 
					:key="product.id"
					@tap="showProductDetail(product)"
				>
					<view class="product-image">
						<text class="product-emoji">{{ product.emoji }}</text>
						<view class="product-badge" v-if="product.hot">🔥</view>
					</view>
					<view class="product-info">
						<view class="product-name">{{ product.name }}</view>
						<view class="product-desc">{{ product.description }}</view>
						<view class="product-price">
							<text class="price-icon">💎</text>
							<text class="price-amount">{{ product.points }}</text>
						</view>
					</view>
					<view class="product-action">
						<button 
							class="exchange-btn" 
							:class="{ 'disabled': userPoints < product.points }"
							@tap.stop="exchangeProduct(product)"
						>
							{{ userPoints >= product.points ? '兑换' : '积分不足' }}
						</button>
					</view>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view class="empty-state" v-if="filteredProducts.length === 0">
				<view class="empty-icon">🛍️</view>
				<view class="empty-text">暂无商品</view>
				<view class="empty-desc">敬请期待更多精彩商品</view>
			</view>
		</view>

		<!-- 我的兑换记录 -->
		<view class="exchange-records" v-if="exchangeHistory.length > 0">
			<view class="records-title">
				<text>🎁 最近兑换</text>
				<text class="view-all" @tap="showAllRecords">查看全部</text>
			</view>
			<view class="records-list">
				<view 
					class="record-item" 
					v-for="record in recentRecords" 
					:key="record.id"
				>
					<view class="record-icon">{{ record.emoji }}</view>
					<view class="record-info">
						<view class="record-name">{{ record.name }}</view>
						<view class="record-date">{{ record.date }}</view>
					</view>
					<view class="record-points">-{{ record.points }}积分</view>
				</view>
			</view>
		</view>

		<!-- 商品详情弹窗 -->
		<uni-popup ref="productPopup" type="center">
			<view class="product-detail-popup" v-if="selectedProduct">
				<view class="detail-header">
					<view class="detail-image">
						<text class="detail-emoji">{{ selectedProduct.emoji }}</text>
					</view>
					<view class="detail-info">
						<view class="detail-name">{{ selectedProduct.name }}</view>
						<view class="detail-price">
							<text class="price-icon">💎</text>
							<text class="price-amount">{{ selectedProduct.points }}</text>
						</view>
					</view>
				</view>
				<view class="detail-description">
					<view class="desc-title">商品描述</view>
					<view class="desc-content">{{ selectedProduct.fullDescription }}</view>
				</view>
				<view class="detail-actions">
					<button class="cancel-btn" @tap="closeProductDetail">取消</button>
					<button 
						class="exchange-btn" 
						:class="{ 'disabled': userPoints < selectedProduct.points }"
						@tap="exchangeProduct(selectedProduct)"
					>
						{{ userPoints >= selectedProduct.points ? '立即兑换' : '积分不足' }}
					</button>
				</view>
			</view>
		</uni-popup>

		<!-- 积分明细弹窗 -->
		<uni-popup ref="historyPopup" type="bottom">
			<view class="points-history-popup">
				<view class="history-header">
					<view class="history-title">积分明细</view>
					<view class="close-btn" @tap="closePointsHistory">×</view>
				</view>
				<view class="history-list">
					<view 
						class="history-item" 
						v-for="item in pointsHistory" 
						:key="item.id"
					>
						<view class="history-icon">{{ item.type === 'earn' ? '📈' : '📉' }}</view>
						<view class="history-info">
							<view class="history-desc">{{ item.description }}</view>
							<view class="history-date">{{ item.date }}</view>
						</view>
						<view class="history-points" :class="item.type">
							{{ item.type === 'earn' ? '+' : '-' }}{{ item.points }}
						</view>
					</view>
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
				userPoints: 0,
				activeCategory: 0,
				selectedProduct: null,
				categories: [
					{ icon: '🎁', name: '精选推荐' },
					{ icon: '📚', name: '学习用品' },
					{ icon: '🎮', name: '娱乐休闲' },
					{ icon: '🍔', name: '美食零食' },
					{ icon: '🎨', name: '兴趣爱好' }
				],
				products: [
					// 精选推荐
					{
						id: 1,
						name: '30分钟游戏时间',
						description: '可以玩30分钟喜欢的游戏',
						fullDescription: '完成任务获得的奖励！可以用来玩30分钟你最喜欢的游戏，包括手机游戏、电脑游戏或者游戏机。记得要在规定时间内哦！',
						emoji: '🎮',
						points: 50,
						category: 0,
						hot: true
					},
					{
						id: 2,
						name: '选择今晚看什么电影',
						description: '可以选择全家一起看的电影',
						fullDescription: '今晚的电影由你来选择！可以是动画片、冒险片或者你喜欢的任何类型。全家人会一起享受这个美好的电影时光。',
						emoji: '🎬',
						points: 80,
						category: 0,
						hot: true
					},
					{
						id: 3,
						name: '周末外出游玩',
						description: '选择周末的外出活动',
						fullDescription: '周末可以选择一个你想去的地方！可以是公园、游乐场、博物馆或者其他有趣的地方。这将是一个美好的家庭时光。',
						emoji: '🎡',
						points: 200,
						category: 0
					},
					
					// 学习用品
					{
						id: 4,
						name: '精美笔记本',
						description: '可爱卡通图案笔记本',
						fullDescription: '一本精美的笔记本，有可爱的卡通图案封面。可以用来记录学习笔记、画画或者写日记。高质量的纸张，书写流畅。',
						emoji: '📓',
						points: 30,
						category: 1
					},
					{
						id: 5,
						name: '彩色马克笔套装',
						description: '12色彩色马克笔',
						fullDescription: '一套12色的彩色马克笔，颜色鲜艳，适合画画、做手工或者装饰笔记。笔头设计合理，既可以画粗线也可以画细线。',
						emoji: '🖍️',
						points: 60,
						category: 1
					},
					{
						id: 6,
						name: '学习桌面收纳盒',
						description: '多格收纳，整理学习用品',
						fullDescription: '一个实用的桌面收纳盒，有多个格子可以分类收纳笔、橡皮、尺子等学习用品。让你的学习桌面更加整洁有序。',
						emoji: '📦',
						points: 90,
						category: 1
					},
					
					// 娱乐休闲
					{
						id: 7,
						name: '拼图游戏',
						description: '500片风景拼图',
						fullDescription: '一套500片的风景拼图，图案精美，难度适中。可以锻炼观察力和耐心，完成后还可以裱框作为装饰。',
						emoji: '🧩',
						points: 120,
						category: 2
					},
					{
						id: 8,
						name: '魔方',
						description: '经典3x3魔方',
						fullDescription: '经典的3x3魔方，手感顺滑，转动流畅。可以锻炼空间思维能力和手眼协调能力。附带简单的还原教程。',
						emoji: '🎲',
						points: 80,
						category: 2
					},
					
					// 美食零食
					{
						id: 9,
						name: '自制冰淇淋',
						description: '和家人一起制作冰淇淋',
						fullDescription: '周末可以和家人一起制作美味的冰淇淋！选择你喜欢的口味，体验制作的乐趣，最后享受自己亲手制作的美味冰淇淋。',
						emoji: '🍦',
						points: 100,
						category: 3
					},
					{
						id: 10,
						name: '特色小零食',
						description: '一包你喜欢的零食',
						fullDescription: '可以选择一包你最喜欢的零食作为奖励！可以是薯片、饼干、糖果或者其他健康的小零食。记得要适量享用哦！',
						emoji: '🍪',
						points: 40,
						category: 3
					},
					
					// 兴趣爱好
					{
						id: 11,
						name: '手工制作套装',
						description: 'DIY手工材料包',
						fullDescription: '一套完整的手工制作材料包，可以制作各种有趣的手工作品。包含彩纸、胶水、剪刀、装饰材料等，发挥你的创造力！',
						emoji: '✂️',
						points: 150,
						category: 4
					},
					{
						id: 12,
						name: '绘画工具套装',
						description: '水彩笔和画纸套装',
						fullDescription: '专业的绘画工具套装，包含水彩笔、画纸、调色盘等。可以画出美丽的作品，培养艺术兴趣和创造力。',
						emoji: '🎨',
						points: 180,
						category: 4
					}
				],
				exchangeHistory: [],
				pointsHistory: []
			}
		},
		computed: {
			// 过滤当前分类的商品
			filteredProducts() {
				return this.products.filter(product => product.category === this.activeCategory)
			},
			
			// 最近兑换记录（显示最近3条）
			recentRecords() {
				return this.exchangeHistory.slice(0, 3)
			}
		},
		onLoad() {
			this.loadData()
			this.initPointsHistory()
		},
		onShow() {
			this.loadData()
		},
		methods: {
			// 加载数据
			loadData() {
				// 加载用户积分
				const userData = StorageUtil.getUserData()
				this.userPoints = userData.totalPoints || 0
				
				// 加载兑换记录
				this.exchangeHistory = StorageUtil.getExchangeHistory()
				
				// 加载积分明细
				this.pointsHistory = StorageUtil.getPointsHistory()
			},
			
			// 初始化积分明细
			initPointsHistory() {
				if (this.pointsHistory.length === 0) {
					const defaultHistory = [
						{
							id: 1,
							type: 'earn',
							description: '完成数学作业',
							points: 20,
							date: '2024-01-15 18:30'
						},
						{
							id: 2,
							type: 'earn',
							description: '阅读30分钟',
							points: 15,
							date: '2024-01-15 20:00'
						},
						{
							id: 3,
							type: 'spend',
							description: '兑换游戏时间',
							points: 50,
							date: '2024-01-14 19:00'
						},
						{
							id: 4,
							type: 'earn',
							description: '完成英语作业',
							points: 25,
							date: '2024-01-14 17:45'
						}
					]
					
					this.pointsHistory = defaultHistory
				StorageUtil.set('pointsHistory', this.pointsHistory)
				}
			},
			
			// 切换分类
			switchCategory(index) {
				this.activeCategory = index
			},
			
			// 显示商品详情
			showProductDetail(product) {
				this.selectedProduct = product
				this.$refs.productPopup.open()
			},
			
			// 关闭商品详情
			closeProductDetail() {
				this.$refs.productPopup.close()
				this.selectedProduct = null
			},
			
			// 兑换商品
			exchangeProduct(product) {
				// 检查权限
				if (!PermissionUtil.checkPermission(PermissionUtil.PERMISSIONS.SHOP_EXCHANGE)) {
					PermissionUtil.showPermissionDenied()
					return
				}
				
				// 检查积分是否足够
				if (this.userPoints < product.points) {
					uni.showToast({
						title: '积分不足',
						icon: 'none'
					})
					return
				}
				
				// 检查库存
				if (product.stock <= 0) {
					uni.showToast({
						title: '商品已售罄',
						icon: 'none'
					})
					return
				}
				
				uni.showModal({
					title: '确认兑换',
					content: `确定要用${product.points}积分兑换${product.name}吗？`,
					success: (res) => {
						if (res.confirm) {
							try {
								// 执行兑换
								const result = StorageUtil.exchangeProduct(product.id, product.points)
								
								if (result.success) {
									// 减少库存
									product.stock--
									
									// 重新加载数据
									this.loadData()
									
									// 关闭弹窗
									this.closeProductDetail()
									
									uni.showToast({
										title: '兑换成功',
										icon: 'success'
									})
								} else {
									uni.showToast({
										title: result.message || '兑换失败',
										icon: 'none'
									})
								}
							} catch (error) {
								console.error('兑换商品失败:', error)
								uni.showToast({
									title: '兑换失败',
									icon: 'none'
								})
							}
						}
					}
				})
			},
			
			// 显示积分明细
			showPointsHistory() {
				this.$refs.historyPopup.open()
			},
			
			// 关闭积分明细
			closePointsHistory() {
				this.$refs.historyPopup.close()
			},
			
			// 显示所有兑换记录
			showAllRecords() {
				if (this.exchangeHistory.length === 0) {
					uni.showToast({
						title: '暂无兑换记录',
						icon: 'none'
					})
					return
				}
				
				let content = '兑换记录：\n'
				this.exchangeHistory.forEach((record, index) => {
					if (index < 5) { // 只显示前5条
						content += `${record.date} ${record.name} -${record.points}积分\n`
					}
				})
				
				if (this.exchangeHistory.length > 5) {
					content += '...'
				}
				
				uni.showModal({
					title: '兑换记录',
					content: content,
					showCancel: false
				})
			},
			
			// 格式化日期
			formatDate(date) {
				const month = date.getMonth() + 1
				const day = date.getDate()
				return `${month}月${day}日`
			},
			
			// 格式化日期时间
			formatDateTime(date) {
				const month = date.getMonth() + 1
				const day = date.getDate()
				const hour = date.getHours().toString().padStart(2, '0')
				const minute = date.getMinutes().toString().padStart(2, '0')
				return `2024-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour}:${minute}`
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #f8f9fa;
		min-height: 100vh;
	}

	/* 积分余额 */
	.points-balance {
		padding: 20rpx;
		
		.balance-card {
			background: linear-gradient(135deg, #FFD700, #FFA500);
			border-radius: 16rpx;
			padding: 40rpx 30rpx;
			display: flex;
			align-items: center;
			color: white;
			
			.balance-icon {
				font-size: 60rpx;
				margin-right: 30rpx;
			}
			
			.balance-info {
				flex: 1;
				
				.balance-title {
					font-size: 24rpx;
					opacity: 0.8;
					margin-bottom: 8rpx;
				}
				
				.balance-amount {
					font-size: 48rpx;
					font-weight: bold;
				}
			}
			
			.balance-history {
				background: rgba(255, 255, 255, 0.2);
				padding: 16rpx 24rpx;
				border-radius: 20rpx;
				font-size: 24rpx;
			}
		}
	}

	/* 分类标签 */
	.category-tabs {
		display: flex;
		padding: 20rpx;
		gap: 20rpx;
		overflow-x: auto;
		
		.tab-item {
			flex-shrink: 0;
			background: white;
			padding: 20rpx 30rpx;
			border-radius: 25rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			min-width: 120rpx;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
			
			&.active {
				background: #4A90E2;
				color: white;
			}
			
			.tab-icon {
				font-size: 32rpx;
				margin-bottom: 8rpx;
			}
			
			.tab-text {
				font-size: 22rpx;
			}
		}
	}

	/* 商品区域 */
	.products-section {
		padding: 0 20rpx;
		
		.section-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
			font-size: 28rpx;
			font-weight: bold;
			color: #333;
			
			.product-count {
				font-size: 22rpx;
				color: #666;
				font-weight: normal;
			}
		}
		
		.products-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 20rpx;
			margin-bottom: 40rpx;
		}
		
		.product-item {
			background: white;
			border-radius: 16rpx;
			padding: 30rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
			position: relative;
			
			.product-image {
				text-align: center;
				margin-bottom: 20rpx;
				position: relative;
				
				.product-emoji {
					font-size: 60rpx;
				}
				
				.product-badge {
					position: absolute;
					top: -10rpx;
					right: 20rpx;
					font-size: 24rpx;
				}
			}
			
			.product-info {
				margin-bottom: 20rpx;
				
				.product-name {
					font-size: 26rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 8rpx;
				}
				
				.product-desc {
					font-size: 22rpx;
					color: #666;
					margin-bottom: 16rpx;
					line-height: 1.4;
				}
				
				.product-price {
					display: flex;
					align-items: center;
					
					.price-icon {
						font-size: 20rpx;
						margin-right: 8rpx;
					}
					
					.price-amount {
						font-size: 28rpx;
						font-weight: bold;
						color: #FF6B35;
					}
				}
			}
			
			.product-action {
				.exchange-btn {
					width: 100%;
					height: 60rpx;
					background: #4A90E2;
					color: white;
					border: none;
					border-radius: 30rpx;
					font-size: 24rpx;
					
					&.disabled {
						background: #ccc;
						color: #999;
					}
				}
			}
		}
		
		.empty-state {
			text-align: center;
			padding: 80rpx 40rpx;
			
			.empty-icon {
				font-size: 80rpx;
				margin-bottom: 20rpx;
			}
			
			.empty-text {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 12rpx;
			}
			
			.empty-desc {
				font-size: 24rpx;
				color: #666;
			}
		}
	}

	/* 兑换记录 */
	.exchange-records {
		margin: 20rpx;
		background: white;
		border-radius: 16rpx;
		padding: 30rpx;
		
		.records-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;
			font-size: 28rpx;
			font-weight: bold;
			color: #333;
			
			.view-all {
				font-size: 24rpx;
				color: #4A90E2;
				font-weight: normal;
			}
		}
		
		.records-list {
			.record-item {
				display: flex;
				align-items: center;
				padding: 20rpx 0;
				border-bottom: 2rpx solid #f0f0f0;
				
				&:last-child {
					border-bottom: none;
				}
				
				.record-icon {
					font-size: 40rpx;
					margin-right: 20rpx;
				}
				
				.record-info {
					flex: 1;
					
					.record-name {
						font-size: 26rpx;
						color: #333;
						margin-bottom: 8rpx;
					}
					
					.record-date {
						font-size: 22rpx;
						color: #666;
					}
				}
				
				.record-points {
					font-size: 24rpx;
					color: #FF6B35;
					font-weight: bold;
				}
			}
		}
	}

	/* 商品详情弹窗 */
	.product-detail-popup {
		width: 600rpx;
		background: white;
		border-radius: 16rpx;
		padding: 40rpx;
		
		.detail-header {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;
			
			.detail-image {
				margin-right: 30rpx;
				
				.detail-emoji {
					font-size: 80rpx;
				}
			}
			
			.detail-info {
				flex: 1;
				
				.detail-name {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 16rpx;
				}
				
				.detail-price {
					display: flex;
					align-items: center;
					
					.price-icon {
						font-size: 24rpx;
						margin-right: 8rpx;
					}
					
					.price-amount {
						font-size: 36rpx;
						font-weight: bold;
						color: #FF6B35;
					}
				}
			}
		}
		
		.detail-description {
			margin-bottom: 40rpx;
			
			.desc-title {
				font-size: 24rpx;
				color: #666;
				margin-bottom: 16rpx;
			}
			
			.desc-content {
				font-size: 26rpx;
				color: #333;
				line-height: 1.6;
			}
		}
		
		.detail-actions {
			display: flex;
			gap: 20rpx;
			
			.cancel-btn, .exchange-btn {
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
			
			.exchange-btn {
				background: #4A90E2;
				color: white;
				
				&.disabled {
					background: #ccc;
					color: #999;
				}
			}
		}
	}

	/* 积分明细弹窗 */
	.points-history-popup {
		background: white;
		border-radius: 16rpx 16rpx 0 0;
		max-height: 80vh;
		
		.history-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx;
			border-bottom: 2rpx solid #f0f0f0;
			
			.history-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
			
			.close-btn {
				font-size: 40rpx;
				color: #666;
				width: 60rpx;
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
		
		.history-list {
			max-height: 60vh;
			overflow-y: auto;
			padding: 0 30rpx 30rpx;
			
			.history-item {
				display: flex;
				align-items: center;
				padding: 24rpx 0;
				border-bottom: 2rpx solid #f0f0f0;
				
				&:last-child {
					border-bottom: none;
				}
				
				.history-icon {
					font-size: 32rpx;
					margin-right: 20rpx;
				}
				
				.history-info {
					flex: 1;
					
					.history-desc {
						font-size: 26rpx;
						color: #333;
						margin-bottom: 8rpx;
					}
					
					.history-date {
						font-size: 22rpx;
						color: #666;
					}
				}
				
				.history-points {
					font-size: 26rpx;
					font-weight: bold;
					
					&.earn {
						color: #28a745;
					}
					
					&.spend {
						color: #FF6B35;
					}
				}
			}
		}
	}
</style>