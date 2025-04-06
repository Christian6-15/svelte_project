<script lang="ts">
  import { tasks, type Task } from '$lib/tasks';
  import { progress } from '$lib/auth';
  import { goto } from '$app/navigation';

  let challengeTask: Task | null = null;

  // 抽取未完成任务
  function drawChallenge() {
    const incompleteTasks = tasks.filter(
      (task) => !$progress.some((p: { taskId: number; completed: boolean }) => p.taskId === task.id && p.completed)
    );
    if (incompleteTasks.length > 0) {
      const randomIndex = Math.floor(Math.random() * incompleteTasks.length);
      challengeTask = incompleteTasks[randomIndex];
    } else {
      challengeTask = null;
    }
  }

  function startChallenge() {
    if (challengeTask) {
      goto(`/editor?taskId=${challengeTask.id}`);
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
  <!-- 英雄区 -->
  <section class="flex flex-col items-center justify-center h-screen text-center px-4">
    <h1 class="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
      探索 Python 的无限可能
    </h1>
    <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
      通过互动练习和详细教程，从零开始掌握 Python 编程，开启你的技术之旅！
    </p>

    <!-- 抽取挑战按钮 -->
    {#if !challengeTask}
      <button
        on:click={drawChallenge}
        class="px-8 py-4 bg-blue-600 text-white rounded-full text-xl font-semibold hover:bg-blue-700 transition transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500 mb-10"
      >
        🎲 抽取挑战
      </button>
    {/if}

    <!-- 挑战卡片 -->
    {#if challengeTask}
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mt-10 fade-in">
        <h2 class="text-2xl font-semibold text-blue-400 mb-4">🎯 你的挑战</h2>
        <p class="text-gray-200 mb-4">
          任务：<span class="font-bold text-white">{challengeTask.title}</span>
        </p>
        <p class="text-gray-300 mb-6">{challengeTask.description}</p>
        <div class="flex space-x-4">
          <button
            on:click={startChallenge}
            class="px-6 py-3 bg-green-600 text-white rounded-full text-lg font-semibold hover:bg-green-700 transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500"
          >
            立即挑战
          </button>
          <button
            on:click={drawChallenge}
            class="px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500"
          >
            重新抽取
          </button>
        </div>
      </div>
    {/if}
  </section>

  <!-- 特性区 -->
  <section class="py-16 px-4 container mx-auto">
    <h2 class="text-4xl font-bold text-center text-blue-400 mb-12">为什么选择我们？</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
        <svg class="w-12 h-12 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h3 class="text-2xl font-semibold text-white mb-2">互动练习</h3>
        <p class="text-gray-300">在线编写和运行代码，实时反馈，快速掌握技能。</p>
      </div>
      <div class="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
        <svg class="w-12 h-12 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253" />
        </svg>
        <h3 class="text-2xl font-semibold text-white mb-2">丰富教程</h3>
        <p class="text-gray-300">从基础到进阶，全面覆盖 Python 核心知识点。</p>
      </div>
      <div class="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
        <svg class="w-12 h-12 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 class="text-2xl font-semibold text-white mb-2">进度跟踪</h3>
        <p class="text-gray-300">实时记录学习进度，清晰了解你的成长路径。</p>
      </div>
    </div>
  </section>

  <footer class="py-8 bg-gray-900 text-center text-gray-400">
    <p>© 2025 Python 学习平台. 保留所有权利。</p>
  </footer>
</div>

<style>
  .fade-in {
    animation: fade-in 0.5s ease-in;
  }

  @keyframes fade-in {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>