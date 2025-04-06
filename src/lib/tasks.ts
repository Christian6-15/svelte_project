export interface Task {
  id: number;
  title: string;
  description: string;
  hint?: string;
  expectedOutput: string;
  outputPattern?: string;
  input?: string | null;
  inputExample?: string | null;
  outputExample?: string;
  inputType?: 'string' | 'number' | 'number[]';
  outputType?: 'string' | 'number';
  tutorial?: string;
  knowledgePoint: string;
}

export const tasks: Task[] = [
  // 知识点 1：基础输出（print）
  {
    id: 1,
    title: '说你好',
    description: '请写一个程序，打印 "你好，我是小明！"。',
    hint: '使用 print() 函数，例如 print("你好，我是小明！")。',
    expectedOutput: '你好，我是小明！',
    outputPattern: '^你好，我是小明！$',
    outputExample: '你好，我是小明！',
    input: null,
    inputExample: null,
    outputType: 'string',
    tutorial: '[TITLE]基础输出（print）\n\n[INTRO]print() 是 Python 中用于输出内容的函数，可以将文字或数字显示在屏幕上。\n\n[SYNTAX]print(value1, value2, ..., sep=" ", end="\\n")\n- value1, value2, ...：要输出的内容。\n- sep：多个值之间的分隔符，默认是空格。\n- end：输出结束时的字符，默认是换行符 \\n。\n\n[CODE]print("你好")\nprint("世界")\n\n[OUTPUT]你好\n世界\n\n[CODE]print("你好", "世界", sep="-")\n\n[OUTPUT]你好-世界',
    knowledgePoint: '基础输出（print）',
  },
  // 知识点 2：变量
  {
    id: 2,
    title: '我的年龄',
    description: '请写一个程序，定义一个变量表示你的年龄，然后打印出来，格式为 "我 10 岁了！"。',
    hint: '先定义一个变量，例如 age = 10，然后用 print() 打印，例如 print("我", age, "岁了！")。',
    expectedOutput: '我 10 岁了！',
    outputPattern: '^我 \\d+ 岁了！$',
    outputExample: '我 10 岁了！',
    input: null,
    inputExample: null,
    outputType: 'string',
    tutorial: '[TITLE]变量\n\n[INTRO]变量是用来存储数据的容器，类似于一个有名字的盒子。\n\n[SYNTAX]variable_name = value\n- variable_name：变量名，建议用英文小写字母，清晰易懂。\n- value：可以是数字、字符串等。\n\n[CODE]age = 10\nprint("我", age, "岁了！")\n\n[OUTPUT]我 10 岁了！\n\n[NOTE]- 可以随时改变变量的值，例如 age = 11，再次打印就会显示新值。\n- 可以用变量进行计算，例如 age + 1。',
    knowledgePoint: '变量',
  },
  // 知识点 3：输入（input）
  {
    id: 3,
    title: '问候朋友',
    description: '请写一个程序，问用户 "你叫什么名字？"，然后根据输入的名字打印 "你好，[名字]！"。例如，如果输入是 "小红"，就打印 "你好，小红！"。',
    hint: '使用 input() 获取名字，例如 name = input("你叫什么名字？")，然后用 print() 打印问候语。',
    expectedOutput: '你好，小红！',
    input: '小红',
    inputExample: '小红',
    outputExample: '你好，小红！',
    inputType: 'string',
    outputType: 'string',
    tutorial: '[TITLE]输入（input）\n\n[INTRO]input() 函数让程序可以接收用户的输入，结果是字符串。\n\n[SYNTAX]variable = input(prompt)\n- prompt：提示文字，告诉用户要输入什么。\n- variable：存储输入的变量。\n\n[CODE]name = input("你叫什么名字？")\nprint("你好，", name, "！")\n\n[OUTPUT]你叫什么名字？小红\n你好，小红！\n\n[NOTE]- 如果需要数字，需用 int() 转换，例如 age = int(input("你的年龄？"))。',
    knowledgePoint: '输入（input）',
  },
  // 知识点 4：基本运算
  {
    id: 4,
    title: '计算和',
    description: '请写一个程序，输入两个数字，计算并打印它们的和。例如，输入 5 和 10，打印 15。',
    hint: '使用 input() 获取两个数字，转换为 int，然后相加。',
    expectedOutput: '15',
    input: '5\n10',
    inputExample: '5\n10',
    outputExample: '15',
    inputType: 'number',
    outputType: 'string',
    tutorial: '[TITLE]基本运算\n\n[INTRO]Python 支持多种数学运算，可以用变量和数字进行计算。\n\n[SYNTAX]- 加：+\n- 减：-\n- 乘：*\n- 除：/\n- 整除：//\n- 取余：%\n\n[CODE]num1 = int(input("第一个数字："))\nnum2 = int(input("第二个数字："))\nsum = num1 + num2\nprint(sum)\n\n[OUTPUT]第一个数字：5\n第二个数字：10\n15\n\n[NOTE]- input() 返回字符串，需用 int() 转换为数字。',
    knowledgePoint: '基本运算',
  },
  // 知识点 5：条件语句（if-else）
  {
    id: 5,
    title: '判断奇偶',
    description: '请写一个程序，输入一个数字，判断它是奇数还是偶数，打印 "奇数" 或 "偶数"。例如，输入 4，打印 "偶数"。',
    hint: '使用 input() 获取数字，用 % 运算符判断奇偶，结合 if-else 语句。',
    expectedOutput: '偶数',
    input: '4',
    inputExample: '4',
    outputExample: '偶数',
    inputType: 'number',
    outputType: 'string',
    tutorial: '[TITLE]条件语句（if-else）\n\n[INTRO]条件语句用于根据条件执行不同的代码块。\n\n[SYNTAX]if condition:\n    # 条件为真时执行\nelse:\n    # 条件为假时执行\n\n[CODE]num = int(input("请输入一个数字："))\nif num % 2 == 0:\n    print("偶数")\nelse:\n    print("奇数")\n\n[OUTPUT]请输入一个数字：4\n偶数\n\n[SYNTAX]- 等于：==\n- 不等于：!=\n- 大于：>\n- 小于：<\n- 大于等于：>=\n- 小于等于：<=',
    knowledgePoint: '条件语句（if-else）',
  },
  // 知识点 6：循环（for）
  {
    id: 6,
    title: '打印 1 到 5',
    description: '请写一个程序，打印从 1 到 5 的数字，每行一个数字。',
    hint: '使用 for 循环，例如 for i in range(1, 6)。',
    expectedOutput: '1\n2\n3\n4\n5',
    outputExample: '1\n2\n3\n4\n5',
    input: null,
    inputExample: null,
    outputType: 'string',
    tutorial: '[TITLE]循环（for）\n\n[INTRO]for 循环用于遍历一个序列（如数字、列表等）。\n\n[SYNTAX]for variable in range(start, end):\n    # 循环体\n- range(start, end)：生成从 start 到 end-1 的数字序列。\n\n[CODE]for i in range(1, 6):\n    print(i)\n\n[OUTPUT]1\n2\n3\n4\n5\n\n[NOTE]- range(1, 6) 生成 1 到 5，不包括 6。',
    knowledgePoint: '循环（for）',
  },
  // 知识点 7：循环（while）
  {
    id: 7,
    title: '累加到 10',
    description: '请写一个程序，从 1 开始累加，直到和大于等于 10，打印最终的和。',
    hint: '使用 while 循环，设置一个变量记录和，循环直到和大于等于 10。',
    expectedOutput: '10',
    outputExample: '10',
    input: null,
    inputExample: null,
    outputType: 'string',
    tutorial: '[TITLE]循环（while）\n\n[INTRO]while 循环在条件为真时重复执行代码块。\n\n[SYNTAX]while condition:\n    # 循环体\n\n[CODE]sum = 0\nnum = 1\nwhile sum < 10:\n    sum += num\n    num += 1\nprint(sum)\n\n[OUTPUT]10\n\n[NOTE]- 确保循环条件最终会变为假，否则会陷入死循环。',
    knowledgePoint: '循环（while）',
  },
  // 知识点 8：列表（list）
  {
    id: 8,
    title: '打印列表元素',
    description: '请写一个程序，定义一个包含 3 个数字的列表，打印每个数字，每行一个。',
    hint: '定义一个列表，例如 numbers = [1, 2, 3]，用 for 循环遍历。',
    expectedOutput: '1\n2\n3',
    outputExample: '1\n2\n3',
    input: null,
    inputExample: null,
    outputType: 'string',
    tutorial: '[TITLE]列表（list）\n\n[INTRO]列表是 Python 中用于存储多个数据的结构。\n\n[SYNTAX]my_list = [item1, item2, item3]\n\n[CODE]numbers = [1, 2, 3]\nfor num in numbers:\n    print(num)\n\n[OUTPUT]1\n2\n3\n\n[SYNTAX]- 添加元素：my_list.append(item)\n- 删除元素：my_list.remove(item)\n- 获取长度：len(my_list)',
    knowledgePoint: '列表（list）',
  },
  // 知识点 9：字符串操作
  {
    id: 9,
    title: '字符串长度',
    description: '请写一个程序，输入一个字符串，打印它的长度。例如，输入 "hello"，打印 5。',
    hint: '使用 input() 获取字符串，用 len() 函数计算长度。',
    expectedOutput: '5',
    input: 'hello',
    inputExample: 'hello',
    outputExample: '5',
    inputType: 'string',
    outputType: 'string',
    tutorial: '[TITLE]字符串操作\n\n[INTRO]字符串是 Python 中表示文本的数据类型。\n\n[SYNTAX]- 获取长度：len(string)\n- 转换为大写：string.upper()\n- 转换为小写：string.lower()\n\n[CODE]text = input("请输入一个字符串：")\nprint(len(text))\n\n[OUTPUT]请输入一个字符串：hello\n5',
    knowledgePoint: '字符串操作',
  },
  // 知识点 10：函数
  {
    id: 10,
    title: '定义问候函数',
    description: '请写一个程序，定义一个函数 greet(name)，打印 "你好，[name]！"。调用函数，输入 "小明"，打印 "你好，小明！"。',
    hint: '定义函数 def greet(name)，在函数内用 print() 打印问候语。',
    expectedOutput: '你好，小明！',
    input: '小明',
    inputExample: '小明',
    outputExample: '你好，小明！',
    inputType: 'string',
    outputType: 'string',
    tutorial: '[TITLE]函数\n\n[INTRO]函数是一段可以重复使用的代码块，用于完成特定任务。\n\n[SYNTAX]def function_name(parameter):\n    # 函数体\n\n[CODE]def greet(name):\n    print("你好，", name, "！")\n\nname = input("请输入名字：")\ngreet(name)\n\n[OUTPUT]请输入名字：小明\n你好，小明！',
    knowledgePoint: '函数',
  },
];