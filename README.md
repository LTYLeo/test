# TAI Teens: Public Beta & Red Teaming Program

公开测试页。三个人设模型（Giggle / Bro / Sweetie），匿名、免登录、免费。

## 结构

```
index.html          页面
assets/
  teens.css         样式（移动端优先）
  teens.js          逻辑
  protocol.js       测试人员协议（中/英）
  config.js         ← 后端地址，换 ngrok 域名时只改这里
  logo.png
```

## 换后端地址

ngrok 免费版每次启动域名都会变。换完之后改 `assets/config.js` 里这一行：

```js
window.TAI_API = "https://xxxx.ngrok-free.app";
```

也可以在 URL 上加 `?api=https://...` 临时覆盖，方便调试。

## 行为

- **刷新即清空。** 对话只存在内存，不写 localStorage。协议里承诺了"下次不展示历史"。
- **每次访问都过协议弹窗。** 因为不持久化，没有"已同意"标记可读。
- **同意记录发到服务端。** `/v1/consent`，带协议版本号和会话 ID。
- **每条回复渲染成多个气泡。** 服务端返回的 `messages` 是拆好的数组。

## 后端

在服务器的 `/data/coding`：

```bash
./deploy_teens.sh start    # 起推理服务 + ngrok
./deploy_teens.sh status
./deploy_teens.sh stop
```

后台看数据：`<公网地址>/admin?token=<TEENS_ADMIN_TOKEN>`

## 移动端处理

| 问题 | 做法 |
|---|---|
| iOS 地址栏导致 100vh 溢出 | 用 `100dvh` |
| 输入框聚焦时页面放大 | `font-size: 16px` |
| 刘海屏底部遮挡 | `env(safe-area-inset-bottom)` |
| 滚到底带动整页回弹 | `overscroll-behavior: contain` |
| 软键盘盖住输入框 | `visualViewport` 监听补偿 |
