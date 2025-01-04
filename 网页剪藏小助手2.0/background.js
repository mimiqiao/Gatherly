import { FEISHU_CONFIG } from './config.js';

// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveToFeishu",
    title: "保存到飞书多维表格",
    contexts: ["selection"]
  });
});

// 注入提示组件到页面
async function showLoadingNotification(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      // 如果已经存在就先移除
      const existingNotification = document.getElementById('feishu-clipper-notification');
      if (existingNotification) {
        existingNotification.remove();
      }

      // 创建提示元素
      const notification = document.createElement('div');
      notification.id = 'feishu-clipper-notification';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ffffff;
        color: #333333;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 999999;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s;
        display: flex;
        align-items: center;
        gap: 8px;
      `;

      // 添加加载动画
      const spinner = document.createElement('div');
      spinner.style.cssText = `
        width: 16px;
        height: 16px;
        border: 2px solid #2D8CFF;
        border-top-color: transparent;
        border-radius: 50%;
        animation: feishu-clipper-spin 1s linear infinite;
      `;

      // 添加加载动画的关键帧
      const style = document.createElement('style');
      style.textContent = `
        @keyframes feishu-clipper-spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);

      notification.appendChild(spinner);
      notification.appendChild(document.createTextNode('正在保存到飞书多维表格...'));
      document.body.appendChild(notification);
    }
  });
}

// 更新提示为成功状态
async function showSuccessNotification(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const notification = document.getElementById('feishu-clipper-notification');
      if (notification) {
        notification.style.background = '#2D8CFF';
        notification.style.color = '#ffffff';
        notification.innerHTML = '✅ 已成功保存到飞书多维表格';
        
        // 3秒后淡出
        setTimeout(() => {
          notification.style.opacity = '0';
          setTimeout(() => notification.remove(), 300);
        }, 3000);
      }
    }
  });
}

// 更新提示为错误状态
async function showErrorNotification(tabId, error) {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: (errorMessage) => {
      const notification = document.getElementById('feishu-clipper-notification');
      if (notification) {
        notification.style.background = '#ff4d4f';
        notification.style.color = '#ffffff';
        notification.innerHTML = `❌ ${errorMessage}`;
        
        // 3秒后淡出
        setTimeout(() => {
          notification.style.opacity = '0';
          setTimeout(() => notification.remove(), 300);
        }, 3000);
      }
    },
    args: [error.message]
  });
}

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveToFeishu") {
    showLoadingNotification(tab.id);
    saveToFeishu({
      title: tab.title,
      url: tab.url,
      selectedText: info.selectionText,
      timestamp: new Date().toISOString()
    }, tab.id);
  }
});

// 处理插件图标点击
chrome.action.onClicked.addListener((tab) => {
  showLoadingNotification(tab.id);
  saveToFeishu({
    title: tab.title,
    url: tab.url,
    selectedText: "",
    timestamp: new Date().toISOString()
  }, tab.id);
});

// 获取访问令牌
async function getAccessToken() {
  const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "app_id": FEISHU_CONFIG.APP_ID,
      "app_secret": FEISHU_CONFIG.APP_SECRET
    })
  });
  
  const data = await response.json();
  return data.tenant_access_token;
}

// 保存到飞书多维表格的函数
async function saveToFeishu(data, tabId) {
  try {
    const token = await getAccessToken();
    
    const response = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.TABLE_ID}/records`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          "标题": data.title || "",
          "选中的内容": data.selectedText || "",
          "链接": {
            "link": data.url,
            "text": data.title
          },
          "保存时间": new Date().toLocaleString('zh-CN')
        }
      })
    });

    const result = await response.json();
    
    if (result.code === 0) {
      await showSuccessNotification(tabId);
    } else {
      throw new Error(result.msg);
    }
  } catch (error) {
    console.error('保存失败:', error);
    await showErrorNotification(tabId, error);
  }
} 