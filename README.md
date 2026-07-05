# neutralino-vue3-ts-template

基于 2026 年最新版本的 Neutralino 桌面应用模板：

| 组件 | 版本 |
| --- | --- |
| Neutralinojs（binary / client） | 6.8.0 |
| @neutralinojs/neu CLI | 11.x |
| Vite | 7.x |
| Vue | 3.5+ |
| vue-router | 5.x（hash 模式） |
| TypeScript | 5.9，严格模式 |

内置功能：

- **热更新（HMR）**：开发时由 Vite dev server 提供页面，`neu run` 自动补丁 `index.html` 注入 Neutralino 全局变量，改代码即时生效且保留组件状态
- **系统托盘**：关闭主窗口隐藏到托盘；托盘菜单包含「显示主窗口 / 打开子窗口 / 退出」
- **子窗口**：托盘菜单或首页按钮均可打开独立进程的原生子窗口（多页面入口 `child.html`），开发模式下子窗口同样走 Vite 享受 HMR
- **路由切换**：`vue-router` hash 模式 + 懒加载路由，主窗口与子窗口共用一套路由表

## 快速开始

```bash
npm install
npm run setup     # 下载 Neutralino 6.8.0 二进制 + 首次构建前端
npm run app:dev   # 开发模式：Vite HMR + 原生窗口
```

其它命令：

```bash
npm run dev        # 仅启动 Vite（纯浏览器调试，原生 API 不可用）
npm run build      # 仅构建前端到 dist/
npm run app:build  # 构建发布包到 release/（含各平台二进制 + zip）
```

## 目录结构

```
├── neutralino.config.json   # Neutralino 配置（窗口、托盘权限、frontendLibrary/HMR）
├── index.html               # 主窗口入口（含 __neutralino_globals.js，供 neu CLI 补丁实现 HMR）
├── child.html               # 子窗口入口（独立进程，靠 injectGlobals 注入全局变量）
├── vite.config.ts           # Vite 多页面配置（main + child），端口 5173
├── src/
│   ├── main.ts              # 应用入口：Neutralino init + Vue 挂载
│   ├── neutralino.ts        # 原生集成：托盘菜单、子窗口创建、窗口关闭行为
│   ├── router/index.ts      # 路由表（/、/about、/child）
│   └── views/               # 页面组件
├── scripts/gen-icons.mjs    # 占位图标生成器（换成自己的图标后可删除）
└── public/icons/            # 应用图标与托盘图标（构建时复制到 dist/icons/）
```

## 工作原理速记

- **HMR**：`npm run app:dev`（`scripts/dev.mjs`）分别启动 Vite 和 `neu run`；neu 等 5173 端口就绪后把 `index.html` 里 `__neutralino_globals.js` 的 src 临时改写到 Neutralino 服务器地址，再以 `--url=http://localhost:5173` 启动原生窗口。应用退出后 dev.mjs 会整组回收 Vite 进程（Vite 不由 neu 的 `devCommand` 启动，否则应用退出后 Vite 和 neu 都会残留）。**开发中避免强杀进程**，否则手动检查 `index.html` 的补丁是否被还原。
- **托盘**：`os.setTray()` 设置图标与菜单，监听 `trayMenuItemClicked` 事件分发动作。托盘图标路径 `/dist/icons/trayIcon.png` 相对应用目录，与打包资源路径一致。
- **子窗口**：`window.create()` 会为每个窗口 spawn 一个全新的 Neutralino 进程（互相隔离、不共享内存）。子窗口入口 `child.html` 不引用 `__neutralino_globals.js`，全局变量由配置里 `modes.window.injectGlobals: true` 从原生侧注入，避免开发模式下被补丁成主进程的连接信息。跨窗口共享数据可用 `storage` API 或 `events.broadcast`。因为进程相互独立，主进程退出不会自动带走子窗口，模板会记录每个子窗口的 PID，托盘「退出」时先结束所有子窗口进程再退出主进程。
- **路由**：使用 hash 模式（`createWebHashHistory`），静态服务器无需重写规则；子窗口打开 `child.html#/child` 直达子窗口页面。

## 常见问题

- **窗口空白（Linux）**：部分显卡驱动（常见于 NVIDIA、虚拟机）与 WebKitGTK 的 DMA-BUF 渲染器不兼容，日志表现为 `Failed to create GBM buffer: Invalid argument`。`npm run app:dev` 已通过 `scripts/dev.mjs` 自动设置 `WEBKIT_DISABLE_DMABUF_RENDERER=1` 规避；如果直接运行 `release/` 里的二进制也遇到空白，同样加上该环境变量启动：`WEBKIT_DISABLE_DMABUF_RENDERER=1 ./neutralino-vue3-ts-linux_x64`。
- **托盘不显示（Linux）**：GNOME 需要 AppIndicator 扩展；托盘仅在 `window` 模式下可用。
- **纯浏览器打开 5173 报错**：正常，原生 API 需要 Neutralino 环境；模板已做降级处理，页面仍可渲染。
- **升级 Neutralino**：`npx neu update --latest` 会自动改写配置中的版本号并下载新二进制，同时把 `package.json` 里的 `@neutralinojs/lib` 升到同一版本。
