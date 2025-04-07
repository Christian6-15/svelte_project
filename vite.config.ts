import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    fs: {
      allow: ['..'], // 允许访问 static 目录
    },
    allowedHosts: true // 允许所有主机访问（开发阶段使用）
  },
});