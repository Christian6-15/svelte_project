<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { user, initUser } from '$lib/auth';
  import { logout } from '$lib/auth';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';

  let showDropdown = false; // 控制菜单显示状态
  let timeout: NodeJS.Timeout; // 用于延迟关闭的定时器

  if (browser) {
    initUser();
  }

  $: if (browser && $user && $page.url.pathname === '/login') {
    goto('/');
  }

  function handleLogout() {
    showDropdown = false;
    logout();
    goto('/login');
  }

  function goToHome() {
    goto('/');
  }

  function goToProfile() {
    showDropdown = false;
    goto('/profile');
  }

  function goToLogin() {
    goto('/login');
  }

  function showMenu() {
    if ($user) {
      clearTimeout(timeout);
      showDropdown = true;
    }
  }

  function hideMenu() {
    timeout = setTimeout(() => {
      showDropdown = false;
    }, 300); // 延迟 300ms 关闭
  }

  function handleKeydown(event: KeyboardEvent) {
    if ($user && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      showDropdown = !showDropdown;
    } else if (event.key === 'Escape') {
      showDropdown = false;
    }
  }
</script>

<div class="flex flex-col min-h-screen bg-gray-900">
  <nav class="bg-gray-800 h-16 border-b-2 border-gray-600 sticky top-0 z-50 shadow-lg">
    <div class="w-full flex justify-between items-center px-12 h-full">
      <button
        on:click={goToHome}
        class="text-2xl font-bold text-blue-400 hover:text-blue-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Python 学习平台
      </button>
      <div class="flex items-center space-x-6">
        {#if $user}
          <a
            href="/progress"
            class="text-lg text-gray-300 hover:text-blue-400 transition font-medium {$page.url.pathname === '/progress' ? 'text-blue-400 border-b-2 border-blue-400' : ''}"
          >
            学习进度
          </a>
          <a
            href="/editor"
            class="text-lg text-gray-300 hover:text-blue-400 transition font-medium {$page.url.pathname === '/editor' ? 'text-blue-400 border-b-2 border-blue-400' : ''}"
          >
            在线编辑器
          </a>
          <div
            class="relative"
            role="button"
            tabindex="0"
            on:mouseenter={showMenu}
            on:mouseleave={hideMenu}
            on:focus={showMenu}
            on:blur={hideMenu}
            on:keydown={handleKeydown}
          >
            <div class="flex items-center space-x-2 cursor-pointer p-2 rounded">
              <img
                src={$user?.avatar || '/favicon.png'}
                alt="用户头像"
                class="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
              />
              <span class="text-lg text-gray-300 hidden md:block">{$user?.username || ''}</span>
            </div>
            <div
              role="menu"
              tabindex="0"
              class="{showDropdown ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} absolute top-full right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-xl transition-opacity duration-200 z-50"
              on:mouseenter={showMenu}
              on:mouseleave={hideMenu}
              on:focus={showMenu}
              on:blur={hideMenu}
            >
              <button
                on:click={goToProfile}
                class="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-600 rounded-t-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                个人中心
              </button>
              <button
                on:click={handleLogout}
                class="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-600 rounded-b-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                退出
              </button>
            </div>
          </div>
        {:else}
          <a
            href="/login"
            on:click|preventDefault={goToLogin}
            class="text-lg text-gray-300 hover:text-blue-400 transition font-medium {$page.url.pathname === '/login' ? 'text-blue-400 border-b-2 border-blue-400' : ''}"
          >
            登录
          </a>
        {/if}
      </div>
    </div>
  </nav>

  <main class="flex-1">
    <slot />
  </main>
</div>