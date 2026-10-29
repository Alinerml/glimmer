# 微光 Glimmer

> 把日子，过成星河。

**微光** 是一个本地优先的微记录应用：每天写下一句话，它会变成你私人星空里的一颗星。它用同一套 React + TypeScript 代码，同时运行在 **Web / PWA、Windows / macOS / Linux 桌面端、Android、iOS** 上。

没有账号，没有云端，没有算法。你的文字只留在自己的设备里；需要换设备时，用一段「星语码」把整片星空带走。

---

## 为什么是它

### 1. 一句话，长成私人星空

每次记录都是一颗有颜色、有位置、有呼吸感的星。心情决定星光颜色，记录时间决定星点位置。写得越久，你的星空越完整。

- 五种心情：静谧、雀跃、心动、疲惫、灵感
- 星点位置由内容 ID 决定，新增微光不会移动旧星星
- 相近的星星会自动连成虚线星座
- 最新点亮的星星有「新星」扩散动画

### 2. 遇见过去

点右上角「遇见过去」，会随机重逢一颗旧星星，并伴随一颗流星。不是信息流，而是一种与旧时光偶遇的体验。

### 3. 星语码：不靠云端的跨设备迁移

这是应用最特别的地方。微光不注册账号、不上传服务器，而是把全部微光压缩成一段 `GLM1.…` 开头的「星语码」：

- **复制星语码** → 在另一台设备粘贴 → 自动合并
- **复制分享链接** → 链接把星语码放在 URL 的 `#` 片段里（浏览器不会把它发送给服务器）
- **二维码** → 手机相机扫码，直接打开带数据的微光页面；在桌面 / 原生端未配置正式分享地址时，二维码会直接编码星语码
- 合并按「时间 + 文本」去重，同一段码导入多次不会产生重复星星

这既是一个轻量的跨端方案，也是一种对「隐私优先」的产品表达：你的记忆不需要先交给一家公司，才能跟着你走。

### 4. 真正的多端同源

```
            React + TypeScript + Vite
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     Web / PWA      Electron      Capacitor
     (Vite dist)    (加载 dist)   (Android / iOS WebView)
```

同一套 UI、数据层、星图算法与星语码格式，五个入口共享一份代码。

---

## 功能一览

- 每日微光记录（140 字以内，支持换行）
- 五种心情与对应的星点颜色
- 私人星空可视化、星座连线、星尘、极光、流星
- 新星点亮动画与轻提示
- 点击星星查看完整记录、时间、心情
- 两次点击确认删除
- 「遇见过去」随机重逢
- 连续记录天数、今日记录数、总记录数
- 星语码导出 / 导入（文本、链接、二维码）
- JSON 完整备份导出 / 导入
- PWA 离线可用、可安装到桌面 / 主屏幕
- 「减少动态效果」开关，并遵循系统 `prefers-reduced-motion`
- Web、Electron、Android、iOS 自适应布局
- 无账号、无后端、无追踪

---

## 技术栈

| 模块 | 技术 |
| --- | --- |
| UI | React 19 + TypeScript |
| 构建 | Vite 7 |
| PWA | vite-plugin-pwa（Workbox） |
| 桌面 | Electron 45 + electron-builder |
| 移动端 | Capacitor 8（Android / iOS） |
| 数据 | `localStorage`，纯前端持久化 |
| 压缩 / 二维码 | lz-string + qrcode |
| 无外部字体 | 使用系统字体，完全离线可用 |

---

## 快速开始

要求：**Node.js 22 LTS 或更高版本**（推荐），npm 10+。

```bash
npm install
npm run dev
```

打开 `http://localhost:5173`。

> 中国网络环境下 Electron 二进制可能下载缓慢。项目不再把镜像写进 `.npmrc`，以免 npm 将其识别为未知配置。安装前先设置环境变量：
>
> ```powershell
> # Windows PowerShell
> $env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
> npm install
> ```
>
> ```bash
> # macOS / Linux
> ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ npm install
> ```
>
> 如果 Electron 安装脚本被 npm 安全策略跳过，可以在同一个终端里手动执行：
>
> ```bash
> node node_modules/electron/install.js
> ```

### 常用脚本

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动 Web 开发服务器（监听局域网，手机可访问） |
| `npm run typecheck` | TypeScript 类型检查 |
| `npm run build` | 类型检查并构建 Web/PWA 到 `dist/` |
| `npm run preview` | 预览生产构建（默认 4173） |
| `npm run icons` | 用脚本重新生成 PWA / 应用图标 |
| `npm run native:assets` | 重新生成 Android / iOS 图标与启动画面 |
| `npm run desktop:dev` | Vite + Electron 桌面开发模式 |
| `npm run desktop` | 构建 Web 后用 Electron 打开 |
| `npm run desktop:dist` | 打 Windows 安装包到 `release/` |
| `npm run desktop:pack` | 打当前系统桌面安装包 |
| `npm run cap:add:android` | 重新生成 Android 原生工程（已有 `android/`，通常不需要） |
| `npm run cap:add:ios` | 重新生成 iOS 原生工程（已有 `ios/`，通常不需要） |
| `npm run cap:sync` | 构建 Web 并同步到所有 Capacitor 平台 |
| `npm run cap:android` | 构建、同步并打开 Android Studio |
| `npm run cap:ios` | 构建、同步并打开 Xcode |

---

## 各端运行与打包

### 1. Web / PWA

```bash
npm run build
npm run preview
```

部署 `dist/` 到任意静态托管（Vercel、Netlify、Cloudflare Pages、Nginx、对象存储均可）。

- 生产环境需要 **HTTPS** 才能注册 Service Worker 和安装 PWA（`localhost` 例外）。
- 在 Edge / Chrome 中打开后，点击地址栏的「安装」图标，即可获得桌面 / 移动端图标。
- 离线后页面仍可打开，数据保存在当前浏览器的 `localStorage`。
- Service Worker 只在 Web 端注册；在 Capacitor 原生壳中会主动注销旧 Service Worker 并清理缓存，避免应用升级后命中旧前端资源。

### 2. 桌面端（Windows / macOS / Linux）

```bash
# 开发
npm run desktop:dev

# 构建并直接打开
npm run desktop

# Windows 安装包
npm run desktop:dist

# macOS DMG（需在 macOS 上执行）
npm run desktop:dist:mac

# 当前操作系统安装包
npm run desktop:pack
```

- Windows 产物在 `release/`，默认生成 NSIS 安装包：`Glimmer-1.0.2-win-x64.exe`。
- 安装包未配置代码签名证书，Windows SmartScreen 可能显示「未知发布者」，属于正常现象。
- macOS 安装包必须在 macOS 上构建；Linux 同理。
- Electron 只是加载 Vite 产物 `dist/index.html`，不额外引入 Node 能力：`contextIsolation: true`、`nodeIntegration: false`、`sandbox: true`。
- Electron 使用 `file://` 加载，因此 PWA Service Worker 不会在桌面壳中启用；桌面壳本身已经是本地应用，不需要离线缓存。

### 3. Android（Capacitor）

前置要求：Android Studio、Android SDK、JDK 21（Capacitor 8 推荐）。

`android/` 原生工程已经生成并包含在仓库中，日常开发只需要：

```bash
npm run cap:android       # 构建 Web -> cap sync -> 打开 Android Studio
```

在 Android Studio 中选择设备或模拟器，点击 Run。也可以命令行打包 Debug APK：

```powershell
cd android
.\gradlew.bat assembleDebug
```

产物一般在 `android/app/build/outputs/apk/debug/app-debug.apk`。

> 只有删除了 `android/`、想从零重建时，才需要执行 `npm run cap:add:android`。
> 应用名「微光」、包名 `com.glimmer.stars`、深色主题、启动画面与自适应图标均已配置。

### 4. iOS（Capacitor）

前置要求：macOS、Xcode 16+。Capacitor 8 使用 Swift Package Manager，无需安装 CocoaPods。

`ios/` 原生工程同样已经生成。在 macOS 上执行：

```bash
npm run cap:ios           # 构建 Web -> cap sync -> 打开 Xcode
```

在 Xcode 中设置 Team / Bundle Identifier 后，连接真机或模拟器运行。上架 App Store 需要 Apple Developer 账号。

> 只有删除了 `ios/`、想从零重建时，才需要执行 `npm run cap:add:ios`。
> iOS 工程已配置 `UIUserInterfaceStyle = Dark`、浅色状态栏以及品牌启动画面。

> `capacitor.config.ts` 已经配置：
>
> - `appId: com.glimmer.stars`
> - `appName: 微光`
> - `webDir: dist`
> - `androidScheme: https`
> - 深色背景色 `#04060d`
>
> 如果要改包名，请在首次 `cap add` 之前修改 `appId`，否则需要手动改原生工程。

---

## 自动发布（GitHub Actions）

推送 `v*` 标签或在 Actions 页面手动运行「自动发布」，会同时构建：

- Windows NSIS 安装包（`windows-latest`）
- 已签名的 Android APK（`ubuntu-latest` + JDK 21）
- macOS DMG，Intel 与 Apple 芯片各一个（`macos-latest`）

三个平台都成功后，工作流会创建 / 更新对应的 GitHub Release，并附上安装包。

### 只需要配置一次

在仓库的 `Settings → Secrets and variables → Actions` 中添加：

| Secret | 说明 |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | 发布密钥库 `.jks` 的 Base64 文本 |
| `ANDROID_KEYSTORE_PASSWORD` | 密钥库密码 |
| `ANDROID_KEY_ALIAS` | 密钥别名，例如 `glimmer` |
| `ANDROID_KEY_PASSWORD` | 密钥密码 |

生成 Base64（PowerShell）：

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\Users\syj\keystores\glimmer-release.jks'))
```

> 密钥库和密码只放在 GitHub Secrets 中，不要提交到仓库。工作流会校验 APK 的证书指纹，换错密钥会直接失败，避免老用户无法覆盖安装。

### 发布新版本

1. 修改 `package.json`、`android/app/build.gradle`、`ios/App/App.xcodeproj/project.pbxproj` 的版本号，并递增 Android `versionCode`。
2. 提交并推送。
3. 在 GitHub Actions 中运行「自动发布」，或推送标签：

```bash
git tag v1.0.2
git push origin v1.0.2
```

工作流会先检查三端版本号是否一致，不一致会直接停止。

### macOS 签名

默认生成未签名 DMG，用户首次打开需要右键 → 打开。若要正式签名 / 公证，需要 Apple Developer Program 的 Developer ID 证书，并在工作流中补充 `CSC_LINK`、`CSC_KEY_PASSWORD`、`APPLE_ID`、`APPLE_APP_SPECIFIC_PASSWORD`、`APPLE_TEAM_ID` 等 Secrets。

---

## 数据与隐私

- 数据存储键：`glimmer.entries.v1`（微光）、`glimmer.onboarded.v1`（引导状态）、`glimmer.calm-motion.v1`（动效偏好）。
- 数据只存在当前设备的 WebView / 浏览器 / Electron 的 `localStorage` 里。
- 星语码内容格式（v1）：

```json
{
  "v": 1,
  "a": "glimmer",
  "e": [["一句话微光", 0, 1761564000000]]
}
```

  `e` 中每一项是 `[文本, 心情索引, 时间戳]`。心情索引顺序为：静谧、雀跃、心动、疲惫、灵感。
- 星语码使用 lz-string 压缩，因此可以直接放进 URL 的 hash 片段。URL 的 `#` 之后的内容不会发送到服务器。
- JSON 备份包含完整条目与心情，可用于长期归档。
- 应用不上传、不统计、不调用任何第三方接口。

### 换设备流程

1. 旧设备：打开「同频」→ 复制星语码 / 分享链接 / 展示二维码。
2. 新设备：打开微光 → 「同频」→ 粘贴星语码 → 合并。
3. 或者：手机扫码分享链接，页面会自动打开「同频」并带入星语码（需要 Web 版或已配置正式分享地址）。
4. 建议同时导出一份 JSON 备份，作为长期保险。

> Web 端二维码指向**当前访问地址**。在本地开发时，手机需要访问电脑的局域网地址，例如 `http://192.168.1.20:5173`，而不是 `localhost`。部署到线上后，二维码会指向正式域名。

### 分享链接与部署地址

Web 版会自动使用当前访问地址生成分享链接。Electron 加载的是 `file://`，Capacitor 加载的是 `https://localhost`，这两个地址其他设备都打不开，因此桌面 / 原生版需要告诉构建「正式的微光网页在哪里」：

```powershell
# Windows PowerShell
$env:VITE_SHARE_BASE_URL="https://glimmer.example.com/"
npm run desktop:dist
# 或
$env:VITE_SHARE_BASE_URL="https://glimmer.example.com/"
npm run cap:sync
```

```bash
# macOS / Linux
VITE_SHARE_BASE_URL=https://glimmer.example.com/ npm run cap:sync
```

也可以复制 `.env.example` 为 `.env`，填入 `VITE_SHARE_BASE_URL`。该值在构建时写入前端。

- 配置后：桌面 / Android / iOS 的「复制分享链接」和二维码会指向正式网页，打开即可自动导入。
- 未配置时：分享链接按钮会禁用，二维码改为直接编码星语码；扫码后复制文本，粘贴到另一台设备的「同频」中仍然可以合并。
- 星语码本身永远可用，不依赖任何网址或网络。

---

## 目录结构

```
.
├─ src/
│  ├─ App.tsx                  # 应用状态与页面编排
│  ├─ components/
│  │  ├─ Sky.tsx               # 星空、星点、星座连线、流星
│  │  ├─ Composer.tsx          # 记录输入与心情选择
│  │  ├─ DetailSheet.tsx       # 单颗星的详情弹层
│  │  ├─ SyncSheet.tsx         # 星语码 / 链接 / 二维码
│  │  ├─ SettingsSheet.tsx     # JSON 备份、动效、安装
│  │  ├─ Onboarding.tsx        # 首次引导
│  │  └─ Icons.tsx             # 内联 SVG 图标
│  ├─ lib/
│  │  ├─ data.ts               # 本地存储、合并、压缩/解压
│  │  ├─ constellation.ts      # 星点布局与连线算法
│  │  ├─ date.ts               # 日期、连续天数
│  │  ├─ platform.ts           # 判断 Capacitor 原生壳
│  │  └─ clipboard.ts          # 剪贴板降级方案
│  ├─ pwa.ts                   # 仅 Web 注册 Service Worker
│  ├─ types.ts                 # 数据模型与心情定义
│  └─ styles.css               # 全部视觉与响应式样式
├─ electron/
│  ├─ main.cjs                 # 桌面窗口与安全配置
│  └─ icon.png
├─ android/                    # Capacitor Android 原生工程
├─ ios/                        # Capacitor iOS 原生工程
├─ scripts/
│  ├─ make-icons.mjs           # 生成 PWA / Electron 图标
│  └─ make-native-assets.mjs   # 生成 Android / iOS 图标与启动画面
├─ public/
│  ├─ favicon.svg
│  └─ icons/                   # 192 / 512 / maskable / apple-touch
├─ capacitor.config.ts
├─ vite.config.ts
├─ .env.example                # 可选：配置正式分享地址
└─ dist/                       # 构建产物（不提交）
```

---

## 设计与实现说明

### 星点布局

`src/lib/constellation.ts` 使用内容 ID 生成确定性随机数，并通过拒绝采样在椭圆区域内放置星点，保持最小间距。因为新微光只会追加到数组末尾，旧星点不会因为新增记录而移动。

星座连线会把每颗星连到最近的邻居，仅当距离在阈值内才绘制。密度越高，星空越像一片真实的星图。

### 星图交互

- 悬停 / 聚焦：星点放大，显示相对日期和心情
- 点击：打开详情
- 「遇见过去」：随机挑选一颗旧星，触发流星并打开详情
- 删除：两次点击确认，避免误触

### 动效与无障碍

- 所有动效都使用 CSS 实现，不引入动画库
- 遵循 `prefers-reduced-motion`
- 应用内提供「减少动态效果」开关
- 关键按钮和星点带有 `aria-label`，弹层使用 `role="dialog"` 与 `aria-modal`
- 支持键盘操作与 `Escape` 关闭弹层

### 自定义

- 心情名称 / 颜色：`src/types.ts`
- 星点位置范围 / 连线规则：`src/lib/constellation.ts`
- 星语码格式：`src/lib/data.ts`
- 品牌图标：修改 `scripts/make-icons.mjs` 与 `scripts/make-native-assets.mjs`，然后执行 `npm run icons && npm run native:assets`
- 用户可见文案：`src/components/` 与 `src/App.tsx`
- 主题色 / 字号 / 断点：`src/styles.css`

---

## 已验证内容

在 Windows + Edge + Electron 环境下已完成：

- `npm run typecheck`
- `npm run build`
- 记录新增、刷新后持久化
- 星语码导出、分享链接导入、重复导入去重
- 二维码生成
- 「遇见过去」、详情查看、两次点击删除
- JSON 导出 / 导入、清空星空
- 动效开关与偏好持久化
- PWA 生产构建、Manifest、Service Worker、离线刷新
- Service Worker 仅 Web 注册；模拟 Capacitor 环境时能注销并清理缓存
- 分享链接、二维码；模拟 Capacitor 环境时禁用链接并回退为星语码二维码
- Electron 壳启动、记录写入、Node 能力隔离
- 桌面 1440 / 移动 390 两种布局截图检查
- Windows NSIS 安装包构建成功；`release/win-unpacked/微光.exe` 启动并显示主窗口
- Capacitor `cap sync`：Web 产物已同步进 Android / iOS 工程
- Android / iOS 应用名、包名、深色主题、图标与启动画面配置
- **未在本机验证 Android Gradle 编译与 iOS Xcode 编译**：当前 Windows 环境没有 Android Studio SDK 与 Xcode，需要在对应平台完成最终打包

---

## 已知边界

- **不是实时同步**：星语码是手动搬运方案，适合低频换设备和隐私优先的场景；如果需要多设备实时同步，可以后续接入自托管 WebSocket / Supabase 等后端，但会打破「无账号、无服务器」的当前取舍。
- **原生打包依赖本机 SDK**：本仓库已经包含 `android/` 与 `ios/` 工程、图标、启动画面和最新 Web 产物。Android 仍需 Android Studio + SDK，iOS 仍需 macOS + Xcode；无法在 Windows 上直接产出 iOS 包。
- **iOS 工程在 Windows 上生成**：Xcode 工程结构、Swift Package 与 Web 产物都已就位，但依赖解析、签名与编译必须在 macOS 上完成。
- **二维码容量有限**：微光数量很多时，星语码可能超出二维码容量，此时仍可使用复制星语码 / 分享链接。代码中已做长度判断。
- **桌面 / 原生版的分享链接依赖正式域名**：未配置 `VITE_SHARE_BASE_URL` 时，分享链接会禁用，二维码退化为纯星语码；这是为了保证不会生成 `file://` 或 `https://localhost` 这类其他设备无法访问的链接。
- **浏览器存储会被清空**：清除站点数据、卸载应用或使用隐私模式都可能导致数据丢失。请定期导出 JSON。
- **分享链接包含明文内容**：星语码不是加密，只是压缩。分享前请确认内容是否适合出现在链接里。

---

## 一句话总结

微光用「一句话 → 一颗星 → 一段可带走的星语码」，把跨端同步这件通常需要账号和后端的事情，做成了一次轻量、私密、带一点浪漫的仪式。

把日子，过成星河。
