<script lang="ts">
  import { progress } from '$lib/auth';
  import { tasks } from '$lib/tasks';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let expanded: { [key: string]: boolean } = {};

  onMount(() => {});

  function toggleExpand(knowledgePoint: string) {
    expanded[knowledgePoint] = !expanded[knowledgePoint];
  }

  function handleKeydown(event: KeyboardEvent, knowledgePoint: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExpand(knowledgePoint);
    }
  }

  function goToTask(knowledgePoint: string) {
    const task = tasks.find((task) => task.knowledgePoint === knowledgePoint);
    if (task) {
      goto(`/editor?taskId=${task.id}`);
    }
  }

  function isTaskCompleted(knowledgePoint: string): boolean {
    const task = tasks.find((task) => task.knowledgePoint === knowledgePoint);
    if (!task) return false;
    return $progress.some((p: { taskId: number; completed: boolean }) => p.taskId === task.id && p.completed) || false;
  }

  $: knowledgePoints = Array.from(new Set(tasks.map((task) => task.knowledgePoint)));
  $: completedTasks = $progress ? $progress.filter((p: { taskId: number; completed: boolean }) => p.completed).length : 0;
  $: totalTasks = tasks.length;
  $: progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
</script>

<div class="min-h-screen bg-gray-900 p-6">
  <div class="container mx-auto">
    <h1 class="text-4xl font-bold text-blue-400 mb-8 text-center">学习进度</h1>

    <div class="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
      <h2 class="text-2xl font-semibold text-white mb-4">学习概览</h2>
      <p class="text-lg text-gray-300 mb-4">已完成任务：{completedTasks}/{totalTasks}</p>
      <div class="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          class="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
          style="width: {progressPercentage}%"
        ></div>
      </div>
    </div>

    {#if knowledgePoints.length === 0}
      <p class="text-gray-400 text-center">暂无知识点可显示。</p>
    {:else}
      <div class="space-y-6">
        {#each knowledgePoints as knowledgePoint}
          <div
            class="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            role="button"
            tabindex="0"
            on:click={() => toggleExpand(knowledgePoint)}
            on:keydown={(event) => handleKeydown(event, knowledgePoint)}
          >
            <div class="flex justify-between items-center">
              <div class="flex items-center space-x-2">
                <span class="text-xl font-semibold text-white">知识点：{knowledgePoint}</span>
                <!-- 添加展开提示 -->
                <span class="text-sm text-gray-400">
                  ({expanded[knowledgePoint] ? '点击收起' : '点击展开查看详情'})
                </span>
              </div>
              <div class="flex items-center space-x-4">
                <button
                  on:click|stopPropagation={() => goToTask(knowledgePoint)}
                  class="px-4 py-2 {isTaskCompleted(knowledgePoint)
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {isTaskCompleted(knowledgePoint) ? '重新练习' : '去完成'}
                </button>
              </div>
            </div>
            {#if expanded[knowledgePoint]}
              <div class="mt-6 text-gray-300 prose max-w-none">
                {#if tasks.find((task) => task.knowledgePoint === knowledgePoint)?.tutorial}
                  {@html tasks
                    .find((task) => task.knowledgePoint === knowledgePoint)
                    ?.tutorial?.replace(/\n/g, '<br>')}
                {:else}
                  <p>暂无教程内容。</p>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>