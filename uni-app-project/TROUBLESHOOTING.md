# 故障排除指南 - 外网访问问题

## 🔍 常见问题及解决方案

### 1. 部署状态检查

**首先检查部署是否成功：**

```bash
# 检查部署状态
vercel ls

# 查看最新部署详情
vercel inspect [deployment-url]

# 查看部署日志
vercel logs [deployment-url]
```

### 2. 域名和DNS问题

#### 问题A：使用Vercel默认域名无法访问

**解决方案：**
```bash
# 1. 检查项目列表
vercel ls

# 2. 获取正确的域名
vercel domains ls

# 3. 如果域名显示异常，重新部署
vercel --prod
```

#### 问题B：自定义域名无法访问

**解决方案：**
1. **检查DNS配置**
   ```
   # 检查DNS解析
   nslookup your-domain.com
   dig your-domain.com
   ```

2. **正确的DNS设置**
   - **A记录**: 指向 `76.76.19.61`
   - **CNAME记录**: 指向 `cname.vercel-dns.com`

3. **在Vercel控制台重新验证域名**

### 3. 网络和防火墙问题

#### 问题C：特定网络环境无法访问

**可能原因：**
- 公司/学校防火墙阻止
- 地区网络限制
- ISP DNS问题

**解决方案：**

1. **更换DNS服务器**
   ```bash
   # 使用公共DNS
   # Google DNS: 8.8.8.8, 8.8.4.4
   # Cloudflare DNS: 1.1.1.1, 1.0.0.1
   ```

2. **使用VPN或代理**

3. **尝试不同网络环境**
   - 手机热点
   - 其他WiFi网络

### 4. 应用配置问题

#### 问题D：页面加载但功能异常

**检查清单：**

1. **检查控制台错误**
   ```javascript
   // 在浏览器开发者工具中检查
   console.log('应用状态检查');
   ```

2. **检查资源加载**
   - CSS文件是否正确加载
   - JavaScript文件是否正确加载
   - 图片资源是否可访问

3. **检查API调用**
   - 如果有外部API，检查CORS设置
   - 检查API端点是否可访问

### 5. Vercel平台问题

#### 问题E：Vercel服务异常

**检查方法：**
1. 访问 [Vercel状态页面](https://vercel-status.com)
2. 查看是否有服务中断

**临时解决方案：**
- 等待服务恢复
- 使用其他部署平台（Netlify、GitHub Pages）

### 6. 构建和部署问题

#### 问题F：构建失败导致无法访问

**诊断步骤：**

1. **本地测试构建**
   ```bash
   # 本地构建测试
   npm run build:h5
   
   # 检查构建输出
   ls -la dist/build/h5/
   ```

2. **检查构建日志**
   ```bash
   vercel logs --follow
   ```

3. **常见构建错误修复**
   ```bash
   # 清理缓存
   rm -rf node_modules
   rm package-lock.json
   npm install
   
   # 重新部署
   vercel --prod
   ```

## 🛠️ 快速诊断脚本

让我创建一个自动诊断脚本：