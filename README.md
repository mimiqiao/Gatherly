# 网页剪藏小助手

一个简单高效的 Chrome 扩展程序，帮助您快速保存网页内容到飞书多维表格。

## 功能特性

- 🔘 一键保存：点击扩展图标即可保存当前网页
- ✂️ 选择性保存：支持选中文本后右键保存
- 🔄 实时反馈：优雅的加载和保存状态提示
- 📋 保存内容包括：
  - 网页标题
  - 选中的内容（如果有）
  - 网页链接（支持飞书超链接格式）
  - 保存时间

## 安装方法

1. 下载源代码
   ```bash
   git clone [仓库地址]
   ```

2. 在 Chrome 浏览器中安装
   - 打开 Chrome 浏览器
   - 访问 `chrome://extensions/`
   - 开启右上角的"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目文件夹

## 配置说明

1. 在 `config.js` 中配置您的飞书应用信息：
   ```javascript
   export const FEISHU_CONFIG = {
     APP_ID: '您的飞书应用 ID',
     APP_SECRET: '您的飞书应用密钥',
     BASE_ID: '多维表格 ID',
     TABLE_ID: '表格 ID'
   };
   ```

2. 确保您的飞书多维表格包含以下字段：
   - 标题（文本类型）
   - 选中的内容（文本类型）
   - 链接（超链接类型）
   - 保存时间（文本类型）

### 获取配置信息

#### 1. 获取 APP_ID 和 APP_SECRET
1. 访问[飞书开放平台](https://open.feishu.cn/app)
2. 创建或选择一个已有应用
3. 在应用详情页面的"凭证与基础信息"中可以找到：
   - APP_ID：即"应用凭证"中的 App ID
   - APP_SECRET：即"应用凭证"中的 App Secret

#### 2. 获取 BASE_ID 和 TABLE_ID
1. 打开您的飞书多维表格
2. 从URL中获取信息：
   ```
   https://waytoagi.feishu.cn/base/VVGIbSMr7aPoqEsYg0Kc7noCn3c?table=tblr92PoZbPIw6OJ
                           ↑                                     ↑
                        BASE_ID                              TABLE_ID
   ```
   - BASE_ID：URL中 base/ 后面的一串字符
   - TABLE_ID：URL中 table= 后面的一串字符

### 权限配置
1. 在飞书开放平台的应用详情页
2. 进入"权限管理"
3. 搜索并开启以下权限：
   - `多维表格`：读写权限
   - `多维表格单个表格数据读写`：读写权限
4. 在"版本管理与发布"中创建版本并发布
5. 在"安装应用"中安装应用到企业

## 使用方法

### 保存整个网页
1. 在任意网页点击扩展图标
2. 等待保存成功提示

### 保存选中内容
1. 选中网页中的任意文本
2. 右键点击，选择"保存到飞书多维表格"
3. 等待保存成功提示

## 项目结构 