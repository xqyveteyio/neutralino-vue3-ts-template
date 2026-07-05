/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Neutralino 注入的全局变量（由 __neutralino_globals.js 或 injectGlobals 提供）
declare const NL_MODE: string;
declare const NL_OS: string;
declare const NL_VERSION: string;
declare const NL_APPVERSION: string;
declare const NL_PORT: number;
