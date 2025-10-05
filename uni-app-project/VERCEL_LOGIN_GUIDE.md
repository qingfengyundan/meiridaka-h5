# Vercel 登录指南

## 🚀 快速登录步骤

### 方法一：浏览器登录（最简单）

1. **访问 Vercel 官网**
   ```
   https://vercel.com
   ```

2. **点击 "Sign Up" 或 "Log In"**

3. **选择登录方式**：
   - ✅ **GitHub**（推荐 - 最方便）
   - GitLab
   - Bitbucket
   - Email

4. **授权登录**
   - 如果选择GitHub，会跳转到GitHub进行授权
   - 点击"Authorize Vercel"完成授权

### 方法二：命令行登录

1. **打开终端**，进入项目目录：
   ```bash
   cd /Users/qingfeng/Desktop/soft/meiridaka/uni-app-project
   ```

2. **执行登录命令**：
   ```bash
   vercel login
   ```

3. **按照提示操作**：
   - 会显示一个设备码（如：ZVDG-HWZN）
   - 访问 https://vercel.com/device
   - 输入设备码
   - 在浏览器中完成登录

4. **确认登录成功**：
   ```bash
   vercel whoami
   ```

## 🎯 登录后的部署步骤

### 快速部署
```bash
# 部署到生产环境
vercel --prod

# 或者预览部署
vercel
```

### 使用我们的部署脚本
```bash
# 使用专用脚本
./deploy-vercel.sh

# 或使用通用脚本
./deploy.sh
```

## 🔧 常见问题解决

### 问题1：命令行登录卡住
**解决方案**：
1. 按 `Ctrl+C` 取消当前命令
2. 直接在浏览器登录 https://vercel.com
3. 登录后再执行 `vercel --prod`

### 问题2：权限错误
**解决方案**：
```bash
# 检查登录状态
vercel whoami

# 如果未登录，重新登录
vercel login
```

### 问题3：项目配置错误
**解决方案**：
```bash
# 检查配置
./check-vercel-config.sh

# 查看配置文件
cat vercel.json
```

## 📱 部署后获取访问链接

部署成功后，Vercel会提供：
- **生产环境链接**：`https://your-project.vercel.app`
- **预览链接**：`https://your-project-xxx.vercel.app`

## 🎉 一键部署命令

如果您已经登录，可以直接运行：
```bash
# 方式1：直接部署
vercel --prod

# 方式2：使用脚本
./deploy-vercel.sh

# 方式3：检查并部署
./check-vercel-config.sh && vercel --prod
```

---

💡 **提示**：首次使用建议先在浏览器登录，这样最简单快捷！