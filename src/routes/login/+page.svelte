<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { login, register } from '$lib/auth';
  import { user } from '$lib/auth';

  let username = '';
  let password = '';
  let isRegistering = false;
  let errorMessage = '';
  let isLoading = false;

  if (browser && $user) {
    goto('/');
  }

  async function handleSubmit() {
    if (!username.trim() || !password.trim()) {
      errorMessage = '用户名和密码不能为空！';
      return;
    }

    isLoading = true;
    errorMessage = '';

    try {
      if (isRegistering) {
        const success = await register(username, password);
        if (success) {
          errorMessage = '';
          goto('/');
        } else {
          errorMessage = '用户名已存在，请选择其他用户名！';
        }
      } else {
        const success = await login(username, password);
        if (success) {
          errorMessage = '';
          goto('/');
        } else {
          errorMessage = '用户名或密码错误！';
        }
      }
    } catch (err) {
      errorMessage = '操作失败，请稍后再试！';
      console.error('错误:', err);
    } finally {
      isLoading = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
  <div class="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
    <h1 class="text-4xl font-extrabold text-blue-400 mb-6 text-center tracking-tight">
      {isRegistering ? '欢迎注册' : '欢迎登录'}
    </h1>
    {#if errorMessage}
      <p class="text-red-400 mb-4 text-center bg-red-900/20 p-2 rounded-lg">{errorMessage}</p>
    {/if}
    <form on:submit|preventDefault={handleSubmit}>
      <div class="mb-6">
        <label for="username" class="block text-gray-300 mb-2 font-medium">用户名</label>
        <input
          id="username"
          type="text"
          bind:value={username}
          placeholder="请输入用户名"
          class="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          on:keydown={handleKeydown}
          disabled={isLoading}
        />
      </div>
      <div class="mb-8">
        <label for="password" class="block text-gray-300 mb-2 font-medium">密码</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="请输入密码"
          class="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          on:keydown={handleKeydown}
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-500 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {#if isLoading}
          <span class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
            </svg>
            {isRegistering ? '注册中...' : '登录中...'}
          </span>
        {:else}
          {isRegistering ? '注册' : '登录'}
        {/if}
      </button>
    </form>
    <p class="mt-6 text-center text-gray-400">
      <button
        on:click={() => (isRegistering = !isRegistering)}
        class="text-blue-400 hover:text-blue-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isRegistering ? '已有账号？去登录' : '没有账号？去注册'}
      </button>
    </p>
  </div>
</div>