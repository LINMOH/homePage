---
title: 线程与进程
date: "2025-08-21T00:00:00+08:00"
categories: 计算机科学
summary: "我在这篇文章中学习了进程和线程的概念。进程是操作系统分配资源的基本单位，拥有独立的内存和资源；线程是进程内的执行单元，负责实际运算和任务处理，多个线程共享同一进程的资源。通过理解它们的区别与联系，我明白了单核 CPU 如何通过上下文切换实现“伪并发”，多核 CPU 如何同时运行不同线程提高效率，也认识到线程和进程在并发编程、面试及操作系统学习中的重要性。"
---

注：本片文章讨论的“线程”，是软件线程，而不是硬件线程

## 进程

### 定义

关于进程，*CSAPP* 给出的定义是：

    A process is the operating system’s abstraction for a running program. It consists of the program code, its current activity (program counter and registers), and the process’s resources (memory, files, etc.).

这一段比较难懂，我们来剖析定义：

    A process is the operating system’s abstraction for a running program.
    进程是操作系统对正在运行的程序的抽象。

理解这句话，我们先来理解**什么是“正在运行的程序”**。

**程序**只是在 ROM 里的一堆数据和指令。

而**进程**就是程序被操作系统加载到 ROM 中开始执行的状态。

    It consists of the program code, its current activity, and the process’s resources.
    进程包含程序代码、执行状态和资源。

**执行状态**包括 CPU 寄存器、PC、SP 等。

**资源**包括 RAM、文件、网络等。

**操作系统**会把内存、设备等的访问权限分配给进程。换句话说，**进程是最小的资源分配单位**。

也就是说，**进程是正在运行的程序，是操作系统分配资源的基本单位。它包含：程序代码、执行状态和资源。**

### 上下文切换

在单核 CPU 系统中，一次只能执行一个进程。这显然不能满足人们的需求，于是，**上下文切换**这个技术就诞生了。这颗单核 CPU 会不停地在不同进程中切换，这个切换到过程就是**上下文切换**（Process context switching），操作系统通过这个技术实现“伪并发”。

![上下文切换](https://pic1.imgdb.cn/item/68a71fd458cb8da5c8413328.png)

发生上下文切换时，操作系统会将当前进程的执行状态保存到内存中的控制块（PCB/TCB），然后从内存中恢复下一个进程的执行状态到 CPU 寄存器中。

假设 CPU 从进程 A 切换到进程 B：

1. 保存当前进程状态（Process A）
    - CPU 把寄存器、PC、SP等执行状态保存到 RAM 中的 PCB 中
    - PCB 存在 RAM 中，记录进程的上下文
2. 更新调度信息
    - 操作系统将 Process A 放回就绪队列
    - 选择下一个 Process B 来运行（调度算法）
3. 恢复新进程状态（Process B）
    - CPU 从 Process B 的 PCB 中读取寄存器、PC、SP 等上下文
4. 继续执行 Process B
    - CPU 从 PC 指向的指令开始执行
    - B 线程就像从未被打断过一样继续运行

和游戏存档差不多（？），保存当前游戏进度，然后切换到另一个存档，等需要再切回来时，从上次的进度继续游戏。

## 线程

随着计算机科学的不断进步，人们不满足于同一个进程同时只能做一件事，如：

    你使用单线程浏览器，当它在渲染网页或播放视频时，某个任务卡住（如视频缓冲卡住），整个浏览器进程都会卡住，你连点击按钮都无法响应，用户体验差。
    但是，聪明的你想到了使用多线程：渲染线程处理网页显示、UI 线程响应用户操作、网络线程处理下载、音视频线程播放视频等。这样即使某个任务卡住了，其他任务仍能正常运行，提高效率和用户体验。

### 定义

    A thread of execution is a basic unit of CPU utilization, consisting of a program counter, a register set, and a stack. Threads within the same process share the process’s code and global data.

**线程**是进程内部的处理单元，是 CPU 调度和执行的最小单位。

每一个线程都有自己的**执行状态**：PC、寄存器、栈等。

线程之间共享进程的资源，如堆、全局变量、文件等。

CPU 在工作时：
- 多核 CPU：操作系统调度器可以把同一个进程的不同线程分配到不同核心上同时运行，实现**并发**（并行？）。
- 单核 CPU：操作系统调度器会轮番运行同一个进程的不同线程，实现“伪并发”。

## 进程与线程

| 特点     | 进程（Process）           | 线程（Thread）           |
| ------- | ------------------------ | ----------------------- |
| 定义     | 操作系统资源分配的基本单位  | CPU 调度的基本单位        |
| 资源拥有 | 拥有独立的内存空间和系统资源 | 共享所属进程的内存和资源    |
| 创建销毁 | 创建销毁开销较大           | 创建销毁开销较小           |
| 通信方式 | 进程间通信（IPC）较复杂     | 线程间通信直接访问共享内存  |
| 调度    | 由操作系统调度             | 由进程内的调度器管理        |
| 稳定性  | 一个进程崩溃不影响其他进程   | 一个线程异常可能影响整个进程 |

理解线程与进程的概念及它们的关系，不仅是学习操作系统的基础，也对考研和面试非常有帮助。

比如 2025 校招面试题中，[腾讯](https://github.com/0voice/Campus_recruitment_interview_questions/blob/main/%E8%85%BE%E8%AE%AF/readme.md)、[小鹏](https://www.bilibili.com/video/BV1VkQNY3EfB/?spm_id_from=333.1387.upload.video_card.click&vd_source=1680a6fedc2270f3c093e88857407609)和[字节](https://www.bilibili.com/video/BV1541xYnEsy/?spm_id_from=333.1387.upload.video_card.click&vd_source=b638fdfb9e01b75cd34cc317156b7a8e)等大厂都有关于进程和线程的题目。

总的来说，理解线程和进程是学习并发编程和计算机组成原理的基础，为后续深入学习并发控制、调度算法和多核编程打下坚实基础。

## 参考文献

Bryant, R. E., & O'Hallaron, D. R. (2015). Computer Systems: A Programmer's Perspective (3rd ed.). Pearson.

Microsoft. (n.d.). Processes and threads. Microsoft Learn. Retrieved August 21, 2025, from https://learn.microsoft.com/en-us/windows/win32/procthread/processes-and-threads

Stack Overflow contributors. (n.d.). What is the difference between a process and a thread?. Stack Overflow. Retrieved August 21, 2025, from https://stackoverflow.com/questions/200469/what-is-the-difference-between-a-process-and-a-thread

JavaBetter. (n.d.). Interviewer from Xiaomi: What is the difference between a process and a thread?. JavaBetter. Retrieved August 21, 2025, from https://javabetter.cn/thread/why-need-thread.html

Zhihu contributors. (n.d.). What is the difference between a process and a thread? [In Chinese]. Zhihu. Retrieved August 21, 2025, from https://www.zhihu.com/question/25532384