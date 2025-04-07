import adapter from '@sveltejs/adapter-static'; // 替换为 adapter-static
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      pages: 'build', // 静态文件输出目录
      assets: 'build', // 静态资源输出目录
      fallback: 'index.html', // 单页应用需要 fallback
      precompress: false // 是否预压缩文件
    }),
    paths: {
      base: '' // 必须与 GitHub Pages 的路径匹配
    }
  }
};

export default config;
