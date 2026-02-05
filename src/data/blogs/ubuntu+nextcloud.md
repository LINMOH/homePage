---
title: Ubuntu Server 24.04 + Nextcloud 安装食用指北
date: "2025-07-08T00:00:00+08:00"
categories: 计算机科学
summary: "本文记录了我在旧电脑上搭建 Ubuntu Server 24.04 并安装 Nextcloud 的过程。包括从官网下载镜像、安装系统、分区、配置账户和 SSH、设置静态 IP，以及通过 Snap 安装 Nextcloud。完成后即可在局域网内访问服务器，搭建个人私有云服务。"
---

因为新电脑到手，陪伴了我五年的第一台个人电脑终于从一线退役了。不过退役不等于闲置，正好想起之前折腾过的 Nextcloud。虽然这台电脑性能有点差，但拿来做个私有云服务器还是绰绰有余的。

![20250530 211939](https://s1.imagehub.cc/images/2025/07/08/3ce6ddb43e519d09238c27c3e050089d.jpg)

## Step 1：安装 Ubuntu Server 24.04

因为熟悉 Ubuntu，就直接选它了。

首先从 [Ubuntu 官网](https://ubuntu.com/download/server) 下载服务器版本镜像。

![image](https://s1.imagehub.cc/images/2025/07/08/0b36f6b8327260a5ec675d1029c7c1f8.png)

（我这里用虚拟机重现安装过程）

![image](https://s1.imagehub.cc/images/2025/07/08/7c8795de1598e811e9cde9839dd3750f.png)

语言选择英语，无需多言。

![image](https://s1.imagehub.cc/images/2025/07/08/5a231ae92cd4ed6abbbeef0b83e77aae.png)

键盘布局默认即可。

![image](https://s1.imagehub.cc/images/2025/07/08/c6e243d1bb8a0129a4aaf4ed2ed619b6.png)

如果没有特别需求，不建议选“最小安装”。推荐勾选安装第三方驱动，可以省去后续手动装驱动的麻烦。

![image](https://s1.imagehub.cc/images/2025/07/08/6ed2b1f4589da8b32cd84bcc9d68623b.png)

实体机安装建议使用有线网，或手机通过 USB 共享网络。

![image](https://s1.imagehub.cc/images/2025/07/08/8dcbb5df3fe80a4c5a60d62e1cf05ec6.png)

代理地址一般不需要配置。

![image](https://s1.imagehub.cc/images/2025/07/08/0f51b82cc67a9a1f446d57b8d37a8b34.png)

系统会自动查找最近的镜像源。

![image](https://s1.imagehub.cc/images/2025/07/08/5fccaa63b4a5f865656a8fab4664599f.png)

硬盘选择默认即可，如果有多块硬盘要注意选对目标盘。

![image](https://s1.imagehub.cc/images/2025/07/08/6830fba92415efca07b439e6ba8d9476.png)

建议给根分区（`/`）多分点空间，不然装东西容易捉襟见肘。

![image](https://s1.imagehub.cc/images/2025/07/08/1ff13ec62b2ca9cfdfb6592954123c72.png)

![image](https://s1.imagehub.cc/images/2025/07/08/f8f2a29b03ad438121aa01ee9dddf4ea.png)

我另外还分了个 `/home` 分区。

![image](https://s1.imagehub.cc/images/2025/07/08/bd9b3581fc5f88a91f43a93b5960599c.png)

![image](https://s1.imagehub.cc/images/2025/07/08/a1a0f1e2d093b77018f2569433952067.png)

（分区时，输入一个很大的数字即可分配剩余所有空间）

接着继续即可。

![image](https://s1.imagehub.cc/images/2025/07/08/7f95d2574aedfb8b2831ff359cd3ed61.png)

设置账户和密码。

![image](https://s1.imagehub.cc/images/2025/07/08/16d0fde5d7b849d8bf6e364daabc5ce3.png)

这一步……广告时间？

![image](https://s1.imagehub.cc/images/2025/07/08/7ad6f4f309edeaa4fa8d0ed0363d39b4.png)

我的 ~~笔记本~~ 服务器长期放角落，所以选上安装 SSH，方便远程登录。

![image](https://s1.imagehub.cc/images/2025/07/08/d9313467a5f56aef1076a045c55bf8aa.png)

没有特别需要的服务，直接跳过。

![image](https://s1.imagehub.cc/images/2025/07/08/6a708c5542d043d5761d0f1ccc2747dd.png)

耐心等待安装过程结束。

![image](https://pic1.imgdb.cn/item/686d055958cb8da5c896db29.png)

看到提示重启就说明安装完成！

![](https://pic1.imgdb.cn/item/686d086c58cb8da5c896e6f4.png)

---

## Step 2：配置静态 IP

运行以下命令查看网卡配置文件名：

```bash
ls /etc/netplan
```

比如我的文件是 `50-cloud-init.yaml`，接着编辑它：

```bash
sudo vim /etc/netplan/50-cloud-init.yaml
```

![](https://pic1.imgdb.cn/item/686d0c5a58cb8da5c896f4d7.png)

将内容改为如下格式（注意缩进必须是空格，不能用 Tab）：

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp3s0:  # 请改为你的实际网卡名
      dhcp4: false
      addresses:
        - 192.168.6.129/24  # 改为你想设定的 IP
      gateway4: 192.168.6.1  # 改为你的网关
      nameservers:
        addresses:
          - 1.1.1.1
          - 8.8.8.8
```

保存并退出后，记下你设定的 IP（如 `192.168.6.129`），然后在另一台电脑上测试 SSH 连接：

```bash
ssh mohan@192.168.6.129
```

---

## Step 3：安装 Nextcloud

执行以下命令：

```bash
sudo apt update
sudo apt install snapd
sudo snap install nextcloud
```

安装完成后，在同一局域网的电脑上，用浏览器访问你的服务器 IP（可通过 `ip a` 查看）即可进入 Nextcloud 的安装页面。设置数据库和管理员账户信息后，稍等片刻就能使用你的私有云了。