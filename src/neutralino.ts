import { app, events, os, window as neuWindow } from '@neutralinojs/lib';

/** 当前页面是否运行在子窗口进程中（子窗口通过 child.html 启动） */
export const isChildWindow = location.pathname.endsWith('/child.html');

const TrayMenuId = {
  Show: 'SHOW',
  OpenChild: 'OPEN_CHILD',
  Quit: 'QUIT',
} as const;

/** 打开子窗口（每次调用都会新建一个独立进程的原生窗口） */
export async function openChildWindow(): Promise<void> {
  // 开发模式下让子窗口也从 Vite dev server 加载，享受 HMR；
  // 生产模式下从子窗口进程自己的静态服务器加载打包产物
  const url = import.meta.env.DEV
    ? `${location.origin}/child.html#/child`
    : '/child.html#/child';

  await neuWindow.create(url, {
    title: '子窗口',
    width: 560,
    height: 440,
    minWidth: 360,
    minHeight: 280,
    center: true,
    exitProcessOnClose: true,
    enableInspector: import.meta.env.DEV,
  });
}

async function setupTray(): Promise<void> {
  // 托盘仅在 window 模式可用；MacOS 下建议使用模板图标
  if (NL_MODE !== 'window') return;

  await os.setTray({
    icon: '/dist/icons/trayIcon.png',
    menuItems: [
      { id: TrayMenuId.Show, text: '显示主窗口' },
      { id: TrayMenuId.OpenChild, text: '打开子窗口' },
      { text: '-' },
      { id: TrayMenuId.Quit, text: '退出' },
    ],
  });

  await events.on('trayMenuItemClicked', (event: CustomEvent<{ id: string }>) => {
    switch (event.detail.id) {
      case TrayMenuId.Show:
        void neuWindow.show();
        void neuWindow.focus();
        break;
      case TrayMenuId.OpenChild:
        void openChildWindow();
        break;
      case TrayMenuId.Quit:
        void app.exit();
        break;
    }
  });
}

/** 初始化原生能力：托盘 + 窗口关闭行为。只应在 Neutralino 环境中调用一次 */
export async function setupNeutralino(): Promise<void> {
  if (isChildWindow) {
    // 子窗口：点关闭按钮直接退出该子进程（双保险，
    // window.create 时也传了 exitProcessOnClose: true）
    await events.on('windowClose', () => void app.exit());
    return;
  }

  // 主窗口：点关闭按钮隐藏到托盘，通过托盘菜单“退出”才真正退出
  await events.on('windowClose', () => void neuWindow.hide());
  await setupTray();
}
