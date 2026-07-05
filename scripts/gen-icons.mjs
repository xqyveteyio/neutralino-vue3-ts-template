// 生成占位图标（appIcon.png 256x256、trayIcon.png 32x32），无第三方依赖。
// 替换成自己的图标后可以删除此脚本。
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = (crc ^ buf[i]) & 0xff;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function png(size, draw) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    const row = y * (size * 4 + 1);
    raw[row] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = draw(x, y, size);
      const p = row + 1 + x * 4;
      raw[p] = r; raw[p + 1] = g; raw[p + 2] = b; raw[p + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// 圆角方块 + 中心圆点
function drawIcon(x, y, size) {
  const r = size * 0.22;
  const cx = Math.min(Math.max(x, r), size - 1 - r);
  const cy = Math.min(Math.max(y, r), size - 1 - r);
  const inside = (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
  if (!inside) return [0, 0, 0, 0];
  const dc = Math.hypot(x - size / 2, y - size / 2);
  if (dc < size * 0.18) return [255, 255, 255, 255];
  return [79, 140, 255, 255]; // #4f8cff
}

mkdirSync(new URL('../public/icons/', import.meta.url), { recursive: true });
writeFileSync(new URL('../public/icons/appIcon.png', import.meta.url), png(256, drawIcon));
writeFileSync(new URL('../public/icons/trayIcon.png', import.meta.url), png(32, drawIcon));
console.log('icons generated in public/icons/');
