---
title: Amdahl 定律
date: "2025-08-25T00:00:00+08:00"
categories: 计算机科学
summary: "我在这篇文章中学习了 Amdahl 定律，它告诉我系统整体性能的提升受限于未优化部分的比例。即使某部分被大幅加速，如果它只占系统的一小部分，整体提升也不明显。这个定律让我明白，在优化程序或系统时，应该优先优化那些占比大的关键部分，才能真正显著提高整体效率。"
---

## 基本思想

当我们加速系统中某一部分时，整体性能的提升取决于可加速部分在原系统中的占比 $\alpha$ 和加速倍数 $k$。即被优化部分必须足够大且快，才能整体显著加速。

## 公式推导

程序总时间：

$$
T_{old}
$$

可优化部分：

$$
\alpha T_{old}
$$

优化后这部分时间：

$$
\frac{\alpha T_{old}}{k}
$$

新的总时间：

$$
T_{new} = (1-\alpha)T_{old} + \frac{\alpha T_{old}}{k}
= T_{old}\big[(1-\alpha) + \frac{\alpha}{k}\big]
$$

加速比：

$$
S = \frac{T_{old}}{T_{new}} = \frac{1}{(1-\alpha)+\alpha/k}
$$

如果 𝑘 趋向于 ∞ 时，这部分几乎不花费时间：

$$
S_{\infty} = \frac{1}{1-\alpha}
$$

## 例

当 $\alpha = 0.6$，$k=3$ 时：

$$
S = \frac{1}{0.4+0.6/3} = 1.67\times
$$

得出：即使当 60% 的部分提速三倍，整体只快了 1.67 倍。

所以，整体加速受限于未优化部分，优化要尽可能覆盖大比例的系统。

## 参考文献

Bryant, R. E., & O'Hallaron, D. R. (2015). Computer Systems: A Programmer's Perspective (3rd ed.). Pearson.
