---
title: 用 Hugo + Lotus Docs 重构我的个人笔记网站
date: "2025-07-26T00:00:00+08:00"  
categories: 建站日记
summary: "我将个人笔记网站从 HonKit 主题重构为基于 Hugo 的 Lotus Docs 主题。文章详细介绍了 Hugo、Golang 安装步骤、主题配置，以及首页自动跳转的解决方案，并展示了本地预览与最终部署到 GitHub Pages 的效果，让笔记网站既美观又实用。"
---

我之前搭建的 [个人笔记](https://taten.xyz/) 使用的是 HonKit 的默认主题，界面难免有些简陋。某次在 GitHub 冲浪时偶然发现了这个主题：[Lotus Docs](https://github.com/colinwilson/lotusdocs)，第一眼就被它吸引住了——颜值非常高，而且基于 Hugo 构建，demo 页面直接让我心动：

![demo](https://s1.imagehub.cc/images/2025/07/26/41f160c7df85e9e46b1914277c7315e1.png)

于是，我决定对笔记站进行一次重构。

---

## 安装 Hugo + Golang + Lotus Docs

首先使用 `winget` 安装 Hugo：

```bash
winget install Hugo.Hugo.Extended
```

然后创建一个新站点：

```bash
hugo new site mysite
cd mysite
```

这将在 `mysite` 文件夹中生成 Hugo 项目的基础目录结构。

根据 GitHub 上的 README，这个主题依赖 Golang，因此需要先从 [Golang 官网](https://go.dev/doc/install) 下载并安装 Go。

此外，Lotus Docs 使用了 Hugo 的 Bootstrap 模块，需要将项目初始化为 Hugo 模块：

```bash
hugo mod init github.com/linmoh/note
```

然后在项目根目录执行以下命令以添加主题：

```bash
git init
git submodule add https://github.com/colinwilson/lotusdocs themes/lotusdocs
```

接着，替换配置文件为以下内容（`config.toml`）：

```toml
baseURL = 'http://example.org/'
languageCode = 'en-us'
title = 'Mohan 的笔记本'
contentDir = 'content'
enableEmoji = true

[module]
    [[module.imports]]
        path = "github.com/colinwilson/lotusdocs"
        disable = false
    [[module.imports]]
        path = "github.com/gohugoio/hugo-mod-bootstrap-scss/v5"
        disable = false

[markup]
  [markup.tableOfContents]
    startLevel = 1
    endLevel = 3
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
    [markup.goldmark.parser]
      [markup.goldmark.parser.attribute]
        block = true
```

然后启动本地服务：

```bash
hugo server
```

浏览器打开 `http://127.0.0.1:1313/` 即可看到本地预览效果：

![](https://s1.imagehub.cc/images/2025/07/26/210705d18630de3925330272e8b8ccba.png)

---

## 修改默认首页（登录页）

但我并不想保留主题默认的首页（官方称其为“登录页”），在官方文档中也没有找到禁用的设置项。

于是我采用了最直接的方法，将 `layouts/index.html` 修改为以下内容，实现自动跳转：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0; url=/docs" />
  </head>
<body>
</body>
</html>
```

虽然有点暴力，但确实能用。不过我总觉得这样不太优雅。

偶然间在 Issues 区发现了 [这个](https://github.com/colinwilson/lotusdocs/issues/170)：

![](https://s1.imagehub.cc/images/2025/07/26/c5cf3f53711b3289ac212ada63940e42.png)

思路和我不谋而合，关键是已经有人提交了 Pull Request：

![image](https://s1.imagehub.cc/images/2025/07/26/8f629921c122331ccedf80856deb443d.png)

看起来非常理想，完美契合我的需求。

可惜一看版本计划，该功能预计将在 **3.0** 版本中上线：

![image](https://s1.imagehub.cc/images/2025/07/26/22381ef773f78dca97dee52942ce2dd0.png)

而目前 release 页面中，最新版还是 0.2：

![image](https://s1.imagehub.cc/images/2025/07/26/dc7cb9e9d81e7337905723a37fd00781.png)

也就是说，这个功能暂时还不能直接使用。

回头看看那个 Pull Request，发现其实实现也挺简单粗暴的：

![image](https://s1.imagehub.cc/images/2025/07/26/f5985853e3fbee05c56b9fe2028d0284.png)

他也是通过修改 `layouts/index.html` 来实现跳转，和我的做法大同小异。所以我就直接参考他的代码，拷贝过来了。

经过测试，完美运行：

![image](https://s1.imagehub.cc/images/2025/07/26/b65258a3f3077d840715d973bc883a0d.png)

---

部署到 GitHub 并配置好 GitHub Pages 后，现在你就可以通过这个地址访问我的网站了：

👉 [https://taten.xyz/](https://taten.xyz/)

---

如果你还想添加评论系统、深色模式切换等功能，也可以继续拓展 Hugo 模块。我后续可能会写一篇进阶版教程，敬请期待。

如有问题，欢迎交流！
