# 🌐 Vercel网站部署完整指南

## 📋 准备工作

### 1. 确认登录状态
- 访问：https://vercel.com/dashboard
- 确认右上角显示您的用户名

## 🚀 部署步骤

### 方法一：通过GitHub仓库部署（推荐）

#### 步骤1：创建GitHub仓库
1. **访问 GitHub**：https://github.com
2. **点击右上角的 "+" 号**
3. **选择 "New repository"**
4. **填写仓库信息**：
   - Repository name: `meiridaka-h5`
   - Description: `每日打卡H5应用`
   - 选择 "Public"
   - 点击 "Create repository"

#### 步骤2：上传项目文件到GitHub
1. **在新创建的仓库页面**，点击 "uploading an existing file"
2. **拖拽以下文件到上传区域**：
   ```
   📁 需要上传的文件：
   ├── index.html          (主页面)
   ├── vercel.json         (配置文件)
   ├── package.json        (项目配置)
   ├── pages/              (页面文件夹)
   ├── utils/              (工具文件夹)
   ├── common/             (公共文件夹)
   └── manifest.json       (应用配置)
   ```
3. **填写提交信息**：`Initial commit - 每日打卡H5应用`
4. **点击 "Commit changes"**

#### 步骤3：在Vercel导入GitHub仓库
1. **回到Vercel控制台**：https://vercel.com/dashboard
2. **点击 "Add New..." → "Project"**
3. **在 "Import Git Repository" 部分**：
   - 找到您刚创建的 `meiridaka-h5` 仓库
   - 点击 "Import"

#### 步骤4：配置项目设置
1. **项目名称**：`meiridaka-h5`
2. **Framework Preset**：选择 "Other" 或 "Static Site"
3. **Root Directory**：保持默认 `./`
4. **Build and Output Settings**：
   - Build Command: `npm run build:h5` (如果有)
   - Output Directory: `dist/build/h5` (如果有构建)
   - Install Command: `npm install`

#### 步骤5：部署
1. **点击 "Deploy" 按钮**
2. **等待部署完成**（通常1-3分钟）
3. **部署成功后会显示访问链接**

### 方法二：直接拖拽上传（简单快速）

#### 步骤1：准备项目文件
1. **打开Finder**，导航到：
   ```
   /Users/qingfeng/Desktop/soft/meiridaka/uni-app-project
   ```

#### 步骤2：访问Vercel部署页面
1. **访问**：https://vercel.com/new
2. **选择 "Browse All Templates"**
3. **或直接拖拽文件夹到页面**

#### 步骤3：上传项目
1. **将整个 `uni-app-project` 文件夹拖拽到Vercel页面**
2. **或者选择关键文件上传**：
   - `index.html`
   - `vercel.json`
   - `package.json`
   - `pages/` 文件夹
   - `utils/` 文件夹
   - `common/` 文件夹

#### 步骤4：配置和部署
1. **项目名称**：输入 `meiridaka-h5`
2. **点击 "Deploy"**
3. **等待部署完成**

## 🎯 部署后的操作

### 获取访问链接
部署成功后，您会看到：
- **生产环境链接**：`https://meiridaka-h5.vercel.app`
- **预览链接**：`https://meiridaka-h5-xxx.vercel.app`

### 自定义域名（可选）
1. **在项目设置中**，找到 "Domains"
2. **添加自定义域名**
3. **按照提示配置DNS**

## 🔧 常见问题解决

### 问题1：上传失败
**解决方案**：
- 确保文件大小不超过100MB
- 检查网络连接
- 尝试分批上传文件

### 问题2：部署失败
**解决方案**：
- 检查 `vercel.json` 配置
- 确保 `package.json` 格式正确
- 查看部署日志中的错误信息

### 问题3：页面无法访问
**解决方案**：
- 确保 `index.html` 在根目录
- 检查文件路径是否正确
- 验证HTML语法

## 📱 测试部署

部署完成后，请测试：
1. **访问主页**：确保页面正常显示
2. **测试功能**：检查各个功能是否正常
3. **移动端适配**：在手机上测试

## 🎉 完成！

恭喜！您的H5应用已经成功部署到Vercel，现在全世界都可以访问了！

---

💡 **小贴士**：
- 每次更新代码后，只需重新上传文件，Vercel会自动重新部署
- 可以在Vercel控制台查看访问统计和性能数据
- 支持自动HTTPS和全球CDN加速