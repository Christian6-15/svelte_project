<script lang="ts">
    import { onMount, onDestroy, tick } from 'svelte';
    import { browser } from '$app/environment';
    import { tasks, type Task } from '$lib/tasks';
    import { progress, completeTask } from '$lib/auth';

    let pyodide: any;
    let code = '';
    let runOutput = '';
    let runOutputLines: string[] = [];
    let submitOutput = '';
    let submitOutputLines: string[] = [];
    let currentTask: Task | null = null;
    let selectedTaskIndex = 0;
    let isRunOutput = true;
    let editor: any;
    let editorContainer: HTMLDivElement;
    let isSidebarOpen = true;
    let isOutputOpen = false;
    let isRunning = false;
    let currentInput = '';
    let resolveInput: ((value: string) => void) | null = null;
    let terminalElement: HTMLDivElement | null = null;

    // 判断任务是否完成
    function isTaskCompleted(taskId: number): boolean {
      return $progress.some((p: { taskId: number; completed: boolean }) => p.taskId === taskId && p.completed) || false;
    }

    onMount(async () => {
      if (!browser) return;

      const urlParams = new URLSearchParams(window.location.search);
      const taskId = parseInt(urlParams.get('taskId') || '1', 10);
      const taskIndex = tasks.findIndex((task) => task.id === taskId);
      if (taskIndex !== -1) {
        selectedTaskIndex = taskIndex;
        currentTask = tasks[selectedTaskIndex];
      } else {
        runOutput = `错误：未找到任务 ID ${taskId}，请从进度页面重新进入。`;
        isOutputOpen = true;
      }

      const scripts = [
        'https://cdnjs.cloudflare.com/ajax/libs/ace/1.37.1/ace.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/ace/1.37.1/mode-python.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/ace/1.37.1/theme-dracula.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/ace/1.37.1/ext-language_tools.min.js',
      ];

      const loadScripts = scripts.map((src) => {
        return new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = src;
          script.async = false;
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      });

      await Promise.all(loadScripts);

      await tick();
      if (editorContainer) {
        // @ts-ignore
        editor = ace.edit(editorContainer);
        editor.setTheme('ace/theme/dracula');
        editor.session.setMode('ace/mode/python');
        editor.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true,
          fontSize: 20,
          showLineNumbers: true,
          tabSize: 4,
          useSoftTabs: true,
          minLines: 10,
          wrap: true,
          useWorker: false,
        });
        editor.setValue(code, -1);
        editor.on('change', () => {
          code = editor.getValue();
        });
      } else {
        console.error('editorContainer 未绑定');
      }

      await loadPyodide();
    });

    async function loadPyodide(): Promise<void> {
      if (!browser) return;

      const script = document.createElement('script');
      script.src = '/pyodide/pyodide.js';
      return new Promise((resolve) => {
        script.onload = async () => {
          // @ts-ignore
          pyodide = await globalThis.loadPyodide({ indexURL: '/pyodide/' });
          await pyodide.runPythonAsync(`
            import builtins
            original_print = builtins.print
          `);
          resolve();
        };
        document.head.appendChild(script);
      });
    }

    function scrollTerminalToBottom() {
      if (terminalElement) {
        terminalElement.scrollTop = terminalElement.scrollHeight;
      }
    }

    function promptUser(): Promise<string> {
      return new Promise((resolve) => {
        resolveInput = resolve;
        isRunning = true;
        currentInput = '';
        runOutputLines.push(currentInput);
        runOutput = runOutputLines.join('\n') + '<span class="cursor"></span>';
        scrollTerminalToBottom();

        const handleKeydown = (event: KeyboardEvent) => {
          if (!isRunning || !resolveInput) return;

          if (event.key === 'Enter') {
            event.preventDefault();
            const inputValue = currentInput;
            runOutputLines[runOutputLines.length - 1] = inputValue;
            runOutput = runOutputLines.join('\n');
            resolveInput(inputValue);
            resolveInput = null;
            isRunning = false;
            window.removeEventListener('keydown', handleKeydown);
          } else if (event.key === 'Backspace') {
            currentInput = currentInput.slice(0, -1);
            runOutputLines[runOutputLines.length - 1] = currentInput;
            runOutput = runOutputLines.join('\n') + '<span class="cursor"></span>';
          } else if (event.key.length === 1) {
            currentInput += event.key;
            runOutputLines[runOutputLines.length - 1] = currentInput;
            runOutput = runOutputLines.join('\n') + '<span class="cursor"></span>';
          }
          scrollTerminalToBottom();
        };
        window.addEventListener('keydown', handleKeydown);
      });
    }

    async function runCode() {
      if (!code.trim()) {
        runOutput = '请先输入代码！';
        runOutputLines = ['请先输入代码！'];
        isOutputOpen = true;
        isRunOutput = true;
        return;
      }

      isRunOutput = true;
      runOutputLines = [];
      runOutput = '';
      isOutputOpen = true;
      isRunning = true;

      try {
        pyodide.globals.set('appendOutput', (line: string) => {
          runOutputLines.push(line);
          runOutput = runOutputLines.join('\n');
          scrollTerminalToBottom();
        });

        await pyodide.runPythonAsync(`
          def custom_print(*args, **kwargs):
            output = ' '.join(str(arg) for arg in args)
            appendOutput(output)
            return None

          import builtins
          builtins.print = custom_print
        `);

        pyodide.globals.set('promptUser', promptUser);
        await pyodide.runPythonAsync(`
          async def custom_input(prompt=""):
            if prompt:
              appendOutput(prompt)
            user_input = await promptUser()
            return user_input

          import builtins
          builtins.input = custom_input
        `);

        const lines = code.split('\n');
        const wrappedLines = lines.map((line) => {
          return '    ' + line.replace(/\binput\(/g, 'await input(');
        });

        const wrappedCode = `
import asyncio

async def user_code():
${wrappedLines.join('\n')}
    return None

await user_code()
        `;

        await pyodide.runPythonAsync(wrappedCode);
      } catch (error) {
        runOutputLines.push(String(error));
        runOutput = runOutputLines.join('\n');
      } finally {
        isRunning = false;
        resolveInput = null;
        currentInput = '';
      }
    }

    async function submitCode() {
      if (!code.trim()) {
        submitOutput = '请先输入代码！';
        submitOutputLines = ['请先输入代码！'];
        isOutputOpen = true;
        isRunOutput = false;
        return;
      }

      isRunOutput = false;
      submitOutputLines = [];
      submitOutput = '';
      isOutputOpen = true;

      try {
        await pyodide.runPythonAsync(`
          import builtins
          builtins.print = original_print
        `);

        const taskInput = currentTask?.input || '';
        await pyodide.runPythonAsync(`
          import sys
          from io import StringIO
          sys.stdin = StringIO(${JSON.stringify(taskInput + '\n')})
          sys.stdout = StringIO()
        `);
        const result = await pyodide.runPythonAsync(code);
        const stdout = pyodide.globals.get('sys').stdout.getvalue();
        const actualOutput = stdout || (result ? result.toString() : '');

        if (currentTask && currentTask.expectedOutput) {
          const trimmedActualOutput = actualOutput.trim();
          const expectedOutput = currentTask.expectedOutput.trim();
          if (trimmedActualOutput === expectedOutput) {
            submitOutputLines.push('🎉 提交成功，任务完成！');
            await completeTask(currentTask.id);
          } else {
            submitOutputLines.push('😓 提交失败，输出不正确！');
            submitOutputLines.push(`你的输出：\n${trimmedActualOutput}`);
            submitOutputLines.push(`期望输出：\n${expectedOutput}`);
          }
        } else {
          submitOutputLines.push('😓 提交失败：任务配置错误！');
        }
      } catch (error) {
        submitOutputLines.push(`错误日志：\n${String(error)}`);
      } finally {
        await pyodide.runPythonAsync(`
          def custom_print(*args, **kwargs):
            output = ' '.join(str(arg) for arg in args)
            appendOutput(output)
            return None

          import builtins
          builtins.print = custom_print
        `);
      }

      submitOutput = submitOutputLines.join('\n');
    }

    function switchTask(index: number) {
      selectedTaskIndex = index;
      currentTask = tasks[selectedTaskIndex];
      code = '';
      if (editor) {
        editor.setValue(code, -1);
      }
      runOutput = '';
      runOutputLines = [];
      submitOutput = '';
      submitOutputLines = [];
      isRunOutput = true;
    }

    onDestroy(() => {
      if (editor) {
        editor.destroy();
        editor.container.remove();
      }
    });

    function formatTutorial(tutorial: string): { type: string; content: string }[] {
      const paragraphs = tutorial.split('\n\n');
      return paragraphs.map((paragraph) => {
        const match = paragraph.match(/^\[(.*?)\](.*)/s);
        if (match) {
          const type = match[1];
          const content = match[2].trim();
          return { type, content };
        }
        return { type: 'TEXT', content: paragraph };
      });
    }
</script>

<div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
  <div class="flex flex-1 overflow-hidden">
    <!-- 侧边栏（任务列表） -->
    <div class="{isSidebarOpen ? 'w-48' : 'w-0'} bg-gray-900 p-2 transition-all duration-300 border-t-2 border-gray-600">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-blue-400 {isSidebarOpen ? 'block' : 'hidden'}">任务列表</h2>
        <button
          on:click={() => (isSidebarOpen = !isSidebarOpen)}
          class="text-white hover:text-gray-300 w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 fixed top-1/2 transform -translate-y-1/2 {isSidebarOpen ? 'left-44' : 'left-2'} z-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {isSidebarOpen ? '<' : '>'}
        </button>
      </div>
      <div class="h-[calc(100%-4rem)] overflow-auto {isSidebarOpen ? 'block' : 'hidden'}">
        {#each tasks as task, index}
          <button
            on:click={() => switchTask(index)}
            class="w-full p-3 rounded text-left {selectedTaskIndex === index ? 'bg-blue-600' : 'bg-gray-700'} text-gray-200 flex justify-between items-center hover:bg-blue-500 transition my-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <span class="truncate">{task.title}</span>
            {#if isTaskCompleted(task.id)}
              <span class="text-green-400">✔</span>
            {:else}
              <span class="text-gray-400">○</span>
            {/if}
          </button>
        {/each}
      </div>
    </div>

    <div class="flex-1 flex flex-row overflow-hidden">
      <div class="w-5/10 border-l-2 border-r-2 border-t-2 border-gray-600">
        {#if currentTask}
          <div class="h-full overflow-auto bg-gray-800">
            <div class="p-4 flex space-x-2 border-b border-gray-600">
              <button
                on:click={() => switchTask(selectedTaskIndex - 1)}
                disabled={selectedTaskIndex === 0}
                class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                上一题
              </button>
              <button
                on:click={() => switchTask(selectedTaskIndex + 1)}
                disabled={selectedTaskIndex === tasks.length - 1}
                class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                下一题
              </button>
            </div>
            <div class="p-4">
              <h2 class="text-xl font-bold text-white mb-4">{currentTask.title}</h2>
              <p class="text-gray-300 mb-4">{currentTask.description}</p>

              {#if currentTask.tutorial}
                <div class="mt-4">
                  <h3 class="text-lg font-semibold text-gray-200 mb-4">📚 学习内容</h3>
                  <div class="text-gray-300">
                    {#each formatTutorial(currentTask.tutorial) as paragraph, index}
                      {#if index === 1 || (index > 1 && (paragraph.type === 'CODE' || paragraph.type === 'OUTPUT'))}
                        <hr class="border-t border-gray-600 my-4" />
                      {/if}
                      {#if paragraph.type === 'TITLE'}
                        <h4 class="text-lg font-semibold text-white mt-4 mb-4">{paragraph.content}</h4>
                      {:else if paragraph.type === 'INTRO' || paragraph.type === 'SYNTAX'}
                        <p class="mt-2 mb-2 whitespace-pre-wrap">{paragraph.content}</p>
                      {:else if paragraph.type === 'CODE' || paragraph.type === 'OUTPUT'}
                        <pre class="bg-gray-700 p-2 rounded border border-gray-600 text-gray-200 whitespace-pre-wrap my-2">{@html paragraph.content}</pre>
                      {:else if paragraph.type === 'NOTE'}
                        <p class="mt-2 mb-2 whitespace-pre-wrap"><span class="font-bold">注意：</span> {paragraph.content}</p>
                      {:else}
                        <p class="mt-2 mb-2 whitespace-pre-wrap">{paragraph.content}</p>
                      {/if}
                    {/each}
                  </div>
                </div>
              {/if}

              {#if currentTask.hint}
                <div class="mt-4">
                  <p class="text-gray-400 mb-2">💡 提示：</p>
                  <p class="text-gray-300">{currentTask.hint}</p>
                </div>
              {/if}
              <div class="mt-4">
                <p class="text-gray-400 mb-2">📥 输入样例：</p>
                {#if currentTask.inputExample}
                  <pre class="text-gray-300 bg-gray-700 p-2 rounded border border-gray-600 whitespace-pre-wrap">{currentTask.inputExample}</pre>
                {:else}
                  <pre class="text-gray-300 bg-gray-700 p-2 rounded border border-gray-600 whitespace-pre-wrap">无</pre>
                {/if}
              </div>
              <div class="mt-4">
                <p class="text-gray-400 mb-2">📤 输出样例：</p>
                {#if currentTask.outputExample}
                  <pre class="text-gray-300 bg-gray-700 p-2 rounded border border-gray-600 whitespace-pre-wrap">{currentTask.outputExample}</pre>
                {:else if currentTask.expectedOutput}
                  <pre class="text-gray-300 bg-gray-700 p-2 rounded border border-gray-600 whitespace-pre-wrap">{currentTask.expectedOutput}</pre>
                {:else}
                  <pre class="text-gray-300 bg-gray-700 p-2 rounded border border-gray-600 whitespace-pre-wrap">无</pre>
                {/if}
              </div>
            </div>
          </div>
        {/if}
      </div>

      <div class="w-5/10 border-t-2 border-gray-600 flex flex-col">
        <!-- 按钮区域 -->
        <div class="bg-gray-800 p-4 flex space-x-2 border-b border-gray-600">
          <button
            on:click={() => { runCode(); }}
            disabled={isRunning}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            运行代码
          </button>
          <button
            on:click={() => { submitCode(); }}
            disabled={isRunning}
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            提交
          </button>
        </div>
        <div bind:this={editorContainer} class="w-full flex-1"></div>
      </div>
    </div>
  </div>

  <button
    on:click={() => (isOutputOpen = !isOutputOpen)}
    class="fixed bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 z-50 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    {isOutputOpen ? 'v' : '^'}
  </button>

  <div
    class="{isOutputOpen ? 'h-80 opacity-100 p-4 border-t border-gray-600' : 'h-0 opacity-0 p-0'} fixed bottom-0 left-0 right-0 bg-gray-800 z-40 transition-all duration-300"
  >
    <h3 class="text-lg font-semibold text-white mb-2">{isRunOutput ? '运行结果' : '提交结果'}</h3>
    <div
      bind:this={terminalElement}
      class="text-gray-300 h-48 overflow-auto mb-4 bg-gray-700 p-2 rounded-lg whitespace-pre-wrap"
    >
      {#if isRunOutput}
        {@html runOutput}
      {:else}
        {@html submitOutput}
      {/if}
    </div>
  </div>
</div>