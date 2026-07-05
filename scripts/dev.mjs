// `npm run app:dev` 的入口，解决三个问题：
// 1. Linux 上部分显卡驱动（常见于 NVIDIA/虚拟机）与 WebKitGTK 的 DMA-BUF 渲染器
//    不兼容会导致窗口空白（日志表现为 "Failed to create GBM buffer"），默认禁用它；
//    如需强制开启，运行前设置 WEBKIT_DISABLE_DMABUF_RENDERER=0 即可覆盖。
// 2. 如果让 neu CLI 启动 Vite（config 里配 devCommand），应用退出后 Vite 子进程
//    会一直吊着 neu 的事件循环，两者都残留。因此这里由本脚本启动并回收 Vite，
//    config 里不配 devCommand，neu run 只负责等待端口、打补丁和启动原生窗口。
// 3. Ctrl+C 时把信号转发给 neu，让它有机会还原 index.html 里的补丁。
import { spawn, spawnSync } from 'node:child_process';

const isWindows = process.platform === 'win32';
const env = { ...process.env };
if (process.platform === 'linux' && !('WEBKIT_DISABLE_DMABUF_RENDERER' in env)) {
  env.WEBKIT_DISABLE_DMABUF_RENDERER = '1';
}

function run(cmd) {
  // POSIX 下 detached 让每条命令拥有独立进程组，方便整组回收
  return spawn(cmd, { stdio: 'inherit', env, shell: true, detached: !isWindows });
}

function killTree(proc, signal = 'SIGTERM') {
  if (isWindows) {
    spawnSync('taskkill', ['/pid', String(proc.pid), '/T', '/F']);
  } else {
    try {
      process.kill(-proc.pid, signal);
    } catch {
      // 进程组已全部退出
    }
  }
}

const vite = run('npm run dev');
const neu = run('neu run');

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    killTree(neu, sig);
    killTree(vite, sig);
  });
}

// 应用退出（neu run 结束）后回收 Vite
neu.on('exit', (code) => {
  killTree(vite);
  process.exit(code ?? 0);
});

// Vite 意外退出时连带结束应用
vite.on('exit', () => {
  killTree(neu);
});
