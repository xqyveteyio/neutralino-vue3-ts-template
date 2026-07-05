// `npm run app:dev` 的入口。
// Linux 上部分显卡驱动（常见于 NVIDIA/虚拟机）与 WebKitGTK 的 DMA-BUF 渲染器不兼容，
// 会导致窗口空白（日志表现为 "Failed to create GBM buffer"），这里默认禁用它。
// 如需强制开启，运行前设置 WEBKIT_DISABLE_DMABUF_RENDERER=0 即可覆盖。
import { spawn } from 'node:child_process';

const env = { ...process.env };
if (process.platform === 'linux' && !('WEBKIT_DISABLE_DMABUF_RENDERER' in env)) {
  env.WEBKIT_DISABLE_DMABUF_RENDERER = '1';
}

const child = spawn('neu run', { stdio: 'inherit', env, shell: true });
child.on('exit', (code) => process.exit(code ?? 0));
