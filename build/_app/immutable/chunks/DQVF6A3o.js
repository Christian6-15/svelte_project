const n=[{id:1,title:"说你好",description:'请写一个程序，打印 "你好，我是小明！"。',hint:'使用 print() 函数，例如 print("你好，我是小明！")。',expectedOutput:"你好，我是小明！",outputPattern:"^你好，我是小明！$",outputExample:"你好，我是小明！",input:null,inputExample:null,outputType:"string",tutorial:`[TITLE]基础输出（print）

[INTRO]print() 是 Python 中用于输出内容的函数，可以将文字或数字显示在屏幕上。

[SYNTAX]print(value1, value2, ..., sep=" ", end="\\n")
- value1, value2, ...：要输出的内容。
- sep：多个值之间的分隔符，默认是空格。
- end：输出结束时的字符，默认是换行符 \\n。

[CODE]print("你好")
print("世界")

[OUTPUT]你好
世界

[CODE]print("你好", "世界", sep="-")

[OUTPUT]你好-世界`,knowledgePoint:"基础输出（print）"},{id:2,title:"我的年龄",description:'请写一个程序，定义一个变量表示你的年龄，然后打印出来，格式为 "我 10 岁了！"。',hint:'先定义一个变量，例如 age = 10，然后用 print() 打印，例如 print("我", age, "岁了！")。',expectedOutput:"我 10 岁了！",outputPattern:"^我 \\d+ 岁了！$",outputExample:"我 10 岁了！",input:null,inputExample:null,outputType:"string",tutorial:`[TITLE]变量

[INTRO]变量是用来存储数据的容器，类似于一个有名字的盒子。

[SYNTAX]variable_name = value
- variable_name：变量名，建议用英文小写字母，清晰易懂。
- value：可以是数字、字符串等。

[CODE]age = 10
print("我", age, "岁了！")

[OUTPUT]我 10 岁了！

[NOTE]- 可以随时改变变量的值，例如 age = 11，再次打印就会显示新值。
- 可以用变量进行计算，例如 age + 1。`,knowledgePoint:"变量"},{id:3,title:"问候朋友",description:'请写一个程序，问用户 "你叫什么名字？"，然后根据输入的名字打印 "你好，[名字]！"。例如，如果输入是 "小红"，就打印 "你好，小红！"。',hint:'使用 input() 获取名字，例如 name = input("你叫什么名字？")，然后用 print() 打印问候语。',expectedOutput:"你好，小红！",input:"小红",inputExample:"小红",outputExample:"你好，小红！",inputType:"string",outputType:"string",tutorial:`[TITLE]输入（input）

[INTRO]input() 函数让程序可以接收用户的输入，结果是字符串。

[SYNTAX]variable = input(prompt)
- prompt：提示文字，告诉用户要输入什么。
- variable：存储输入的变量。

[CODE]name = input("你叫什么名字？")
print("你好，", name, "！")

[OUTPUT]你叫什么名字？小红
你好，小红！

[NOTE]- 如果需要数字，需用 int() 转换，例如 age = int(input("你的年龄？"))。`,knowledgePoint:"输入（input）"},{id:4,title:"计算和",description:"请写一个程序，输入两个数字，计算并打印它们的和。例如，输入 5 和 10，打印 15。",hint:"使用 input() 获取两个数字，转换为 int，然后相加。",expectedOutput:"15",input:`5
10`,inputExample:`5
10`,outputExample:"15",inputType:"number",outputType:"string",tutorial:`[TITLE]基本运算

[INTRO]Python 支持多种数学运算，可以用变量和数字进行计算。

[SYNTAX]- 加：+
- 减：-
- 乘：*
- 除：/
- 整除：//
- 取余：%

[CODE]num1 = int(input("第一个数字："))
num2 = int(input("第二个数字："))
sum = num1 + num2
print(sum)

[OUTPUT]第一个数字：5
第二个数字：10
15

[NOTE]- input() 返回字符串，需用 int() 转换为数字。`,knowledgePoint:"基本运算"},{id:5,title:"判断奇偶",description:'请写一个程序，输入一个数字，判断它是奇数还是偶数，打印 "奇数" 或 "偶数"。例如，输入 4，打印 "偶数"。',hint:"使用 input() 获取数字，用 % 运算符判断奇偶，结合 if-else 语句。",expectedOutput:"偶数",input:"4",inputExample:"4",outputExample:"偶数",inputType:"number",outputType:"string",tutorial:`[TITLE]条件语句（if-else）

[INTRO]条件语句用于根据条件执行不同的代码块。

[SYNTAX]if condition:
    # 条件为真时执行
else:
    # 条件为假时执行

[CODE]num = int(input("请输入一个数字："))
if num % 2 == 0:
    print("偶数")
else:
    print("奇数")

[OUTPUT]请输入一个数字：4
偶数

[SYNTAX]- 等于：==
- 不等于：!=
- 大于：>
- 小于：<
- 大于等于：>=
- 小于等于：<=`,knowledgePoint:"条件语句（if-else）"},{id:6,title:"打印 1 到 5",description:"请写一个程序，打印从 1 到 5 的数字，每行一个数字。",hint:"使用 for 循环，例如 for i in range(1, 6)。",expectedOutput:`1
2
3
4
5`,outputExample:`1
2
3
4
5`,input:null,inputExample:null,outputType:"string",tutorial:`[TITLE]循环（for）

[INTRO]for 循环用于遍历一个序列（如数字、列表等）。

[SYNTAX]for variable in range(start, end):
    # 循环体
- range(start, end)：生成从 start 到 end-1 的数字序列。

[CODE]for i in range(1, 6):
    print(i)

[OUTPUT]1
2
3
4
5

[NOTE]- range(1, 6) 生成 1 到 5，不包括 6。`,knowledgePoint:"循环（for）"},{id:7,title:"累加到 10",description:"请写一个程序，从 1 开始累加，直到和大于等于 10，打印最终的和。",hint:"使用 while 循环，设置一个变量记录和，循环直到和大于等于 10。",expectedOutput:"10",outputExample:"10",input:null,inputExample:null,outputType:"string",tutorial:`[TITLE]循环（while）

[INTRO]while 循环在条件为真时重复执行代码块。

[SYNTAX]while condition:
    # 循环体

[CODE]sum = 0
num = 1
while sum < 10:
    sum += num
    num += 1
print(sum)

[OUTPUT]10

[NOTE]- 确保循环条件最终会变为假，否则会陷入死循环。`,knowledgePoint:"循环（while）"},{id:8,title:"打印列表元素",description:"请写一个程序，定义一个包含 3 个数字的列表，打印每个数字，每行一个。",hint:"定义一个列表，例如 numbers = [1, 2, 3]，用 for 循环遍历。",expectedOutput:`1
2
3`,outputExample:`1
2
3`,input:null,inputExample:null,outputType:"string",tutorial:`[TITLE]列表（list）

[INTRO]列表是 Python 中用于存储多个数据的结构。

[SYNTAX]my_list = [item1, item2, item3]

[CODE]numbers = [1, 2, 3]
for num in numbers:
    print(num)

[OUTPUT]1
2
3

[SYNTAX]- 添加元素：my_list.append(item)
- 删除元素：my_list.remove(item)
- 获取长度：len(my_list)`,knowledgePoint:"列表（list）"},{id:9,title:"字符串长度",description:'请写一个程序，输入一个字符串，打印它的长度。例如，输入 "hello"，打印 5。',hint:"使用 input() 获取字符串，用 len() 函数计算长度。",expectedOutput:"5",input:"hello",inputExample:"hello",outputExample:"5",inputType:"string",outputType:"string",tutorial:`[TITLE]字符串操作

[INTRO]字符串是 Python 中表示文本的数据类型。

[SYNTAX]- 获取长度：len(string)
- 转换为大写：string.upper()
- 转换为小写：string.lower()

[CODE]text = input("请输入一个字符串：")
print(len(text))

[OUTPUT]请输入一个字符串：hello
5`,knowledgePoint:"字符串操作"},{id:10,title:"定义问候函数",description:'请写一个程序，定义一个函数 greet(name)，打印 "你好，[name]！"。调用函数，输入 "小明"，打印 "你好，小明！"。',hint:"定义函数 def greet(name)，在函数内用 print() 打印问候语。",expectedOutput:"你好，小明！",input:"小明",inputExample:"小明",outputExample:"你好，小明！",inputType:"string",outputType:"string",tutorial:`[TITLE]函数

[INTRO]函数是一段可以重复使用的代码块，用于完成特定任务。

[SYNTAX]def function_name(parameter):
    # 函数体

[CODE]def greet(name):
    print("你好，", name, "！")

name = input("请输入名字：")
greet(name)

[OUTPUT]请输入名字：小明
你好，小明！`,knowledgePoint:"函数"}];export{n as t};
