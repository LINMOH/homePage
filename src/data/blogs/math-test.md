---
title: "数学公式测试"
date: "2024-01-15"
excerpt: "测试数学公式渲染功能"
tags: ["测试", "数学", "公式"]
readTime: "2 min read"
---

# 数学公式测试

这是一个测试数学公式渲染的博客文章。

## 行内公式

行内公式示例：当 $x = 2$ 时，函数 $f(x) = x^2 + 3x - 5$ 的值为 $f(2) = 2^2 + 3 \times 2 - 5 = 5$。

另一个例子：勾股定理 $a^2 + b^2 = c^2$。

## 块级公式

二次方程求根公式：

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

欧拉公式：

$$
e^{i\pi} + 1 = 0
$$

积分公式：

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## 矩阵

矩阵乘法：

$$
\begin{bmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22}
\end{bmatrix}
\times
\begin{bmatrix}
b_{11} & b_{12} \\
b_{21} & b_{22}
\end{bmatrix}
=
\begin{bmatrix}
a_{11}b_{11} + a_{12}b_{21} & a_{11}b_{12} + a_{12}b_{22} \\
a_{21}b_{11} + a_{22}b_{21} & a_{21}b_{12} + a_{22}b_{22}
\end{bmatrix}
$$

## 求和与极限

求和公式：

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

极限公式：

$$
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$

## 物理公式

质能方程：

$$
E = mc^2
$$

薛定谔方程：

$$
i\hbar \frac{\partial}{\partial t} \Psi(\mathbf{r}, t) = \hat{H} \Psi(\mathbf{r}, t)
$$

## 结论

数学公式渲染功能应该能够正确处理行内公式（使用 $...$）和块级公式（使用 $$...$$）。