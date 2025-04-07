<script lang="ts">
  import { user, progress } from '$lib/auth';
  import { tasks } from '$lib/tasks';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let username = $user?.username || '';
  let oldPassword = '';
  let newPassword = '';
  let avatarFile: File | null = null;
  let avatarPreview = $user?.avatar || '/favicon.png';
  let completedTasks: { taskId: number; completed: boolean }[] = [];
  let isSaving = false;
  let errors: { [key: string]: string } = {};

  onMount(() => {
    if (!$user) {
      goto('/login');
    }
    completedTasks = $progress.filter((p) => p.completed);
  });

  function validateForm(): boolean {
    errors = {};

    // 用户名验证：3-20 字符，仅允许字母、数字和下划线
    if (username && username !== $user?.username) {
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        errors.username = '用户名必须为 3-20 个字符，仅允许字母、数字和下划线';
      }
    }

    // 密码验证
    if (newPassword) {
      if (!oldPassword) {
        errors.oldPassword = '请输入旧密码';
      }
      if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        errors.newPassword = '新密码必须至少 8 位，包含字母和数字';
      }
    } else if (oldPassword) {
      errors.newPassword = '请输入新密码';
    }

    return Object.keys(errors).length === 0;
  }

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      avatarFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        avatarPreview = e.target?.result as string;
      };
      reader.readAsDataURL(avatarFile);
    }
  }

  function resetAvatar() {
    avatarFile = null;
    avatarPreview = $user?.avatar || '/favicon.png';
    const input = document.getElementById('avatar-upload') as HTMLInputElement;
    if (input) input.value = '';
  }

  async function handleSave() {
    if (isSaving) return;
    if (!validateForm()) return;

    isSaving = true;

    const updatedData: { newUsername?: string; oldPassword?: string; password?: string; avatar?: string } = {};
    if (username && username !== $user?.username) updatedData.newUsername = username;
    if (newPassword) {
      updatedData.oldPassword = oldPassword; // 包含旧密码
      updatedData.password = newPassword;
    }

    if (avatarFile) {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (uploadResponse.ok) {
        const { path } = await uploadResponse.json();
        updatedData.avatar = path;
        avatarPreview = path;
      } else {
        const { message } = await uploadResponse.json();
        errors.upload = `上传头像失败：${message}`;
        isSaving = false;
        return;
      }
    }

    if (Object.keys(updatedData).length > 0) {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedUser = {
          ...$user!,
          username: updatedData.newUsername || $user!.username,
          avatar: updatedData.avatar || $user!.avatar,
        };
        user.set(updatedUser);
        // 清空密码输入
        oldPassword = '';
        newPassword = '';
        errors = {};
        // 使用 Toast 提示
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50';
        toast.textContent = '用户信息已更新！';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      } else {
        const { error } = await response.json();
        if (error === '旧密码错误') {
          errors.oldPassword = error; // 专门处理旧密码错误
        } else {
          errors.api = `更新失败：${error}`;
        }
      }
    } else {
      errors.api = '没有需要更新的信息！';
    }

    isSaving = false;
  }

  function goToTask(taskId: number) {
    goto(`/editor?taskId=${taskId}`);
  }
</script>

<div class="min-h-screen bg-gray-900 p-6">
  <div class="container mx-auto">
    <h1 class="text-4xl font-bold text-blue-400 mb-8 text-center">个人中心</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- 用户信息卡片 -->
      <div class="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 hover:shadow-xl transition-shadow duration-300">
        <h2 class="text-2xl font-semibold text-white mb-6">用户信息</h2>
        <div class="flex items-center space-x-4 mb-6">
          <img src={avatarPreview} alt="用户头像" class="w-20 h-20 rounded-full object-cover border-2 border-blue-500" />
          <div class="flex space-x-2">
            <label
              for="avatar-upload"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              更换头像
            </label>
            <button
              on:click={resetAvatar}
              disabled={!avatarFile}
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 disabled:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              撤销
            </button>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              on:change={handleFileChange}
              class="hidden"
            />
          </div>
        </div>
        <div class="mb-6">
          <label for="username" class="block text-gray-300 mb-2 font-medium">用户名</label>
          <input
            type="text"
            id="username"
            bind:value={username}
            class="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          {#if errors.username}
            <p class="text-red-400 text-sm mt-1">{errors.username}</p>
          {/if}
        </div>
        <div class="mb-6">
          <label for="old-password" class="block text-gray-300 mb-2 font-medium">旧密码</label>
          <input
            type="password"
            id="old-password"
            bind:value={oldPassword}
            placeholder="请输入旧密码"
            class="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          {#if errors.oldPassword}
            <p class="text-red-400 text-sm mt-1">{errors.oldPassword}</p>
          {/if}
        </div>
        <div class="mb-6">
          <label for="new-password" class="block text-gray-300 mb-2 font-medium">新密码</label>
          <input
            type="password"
            id="new-password"
            bind:value={newPassword}
            placeholder="留空则不修改"
            class="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          {#if errors.newPassword}
            <p class="text-red-400 text-sm mt-1">{errors.newPassword}</p>
          {/if}
        </div>
        {#if errors.api}
          <p class="text-red-400 text-sm mb-4">{errors.api}</p>
        {/if}
        <button
          on:click={handleSave}
          disabled={isSaving}
          class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
        >
          {#if isSaving}
            <svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            保存中...
          {:else}
            保存修改
          {/if}
        </button>
      </div>

      <!-- 已完成题目卡片 -->
      <div class="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 hover:shadow-xl transition-shadow duration-300">
        <h2 class="text-2xl font-semibold text-white mb-6">已完成题目</h2>
        {#if completedTasks.length === 0}
          <p class="text-gray-400">你还没有完成任何题目，快去练习吧！</p>
        {:else}
          <div class="max-h-96 overflow-auto">
            <ul class="space-y-3">
              {#each completedTasks as task}
                {#if tasks.find((t) => t.id === task.taskId)}
                  <li class="flex items-center justify-between bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition">
                    <button
                      on:click={() => goToTask(task.taskId)}
                      class="text-blue-400 hover:text-blue-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {tasks.find((t) => t.id === task.taskId)?.title}
                    </button>
                    <span class="text-green-400">✓</span>
                  </li>
                {/if}
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>