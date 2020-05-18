

# About
配合pos接单和后台管理项目 项目地址：https://github.com/soymikey/vue-online-order-client-koa2.git

:yum: 前端项目演示地址：[接单和管理系统](http://pos.migaox.com)，或者可以扫描二维码访问：

![](./assets/qr.png)

整个项目分为两部分：前台项目接口、后台管理接口，共30多个。涉及登陆、注册、添加商品、商品展示、购物车、下单、用户中心等，构成一个完整的流程。



__注：此项目纯属个人瞎搞，不用于任何商业用途。__

## 技术栈

nodejs + koa2 + mongodb + mongoose + jsonwebtoken + captchapng

## 项目运行

```
项目运行之前，请确保系统已经安装以下应用
1、node (6.0 及以上版本)
2、mongodb (开启状态) 端口19999
```

```
git clone https://github.com/soymikey/online-order-backend-koa2.git

cd online-order-backend-koa2

npm install 或 yarn(推荐)

npm run dev

访问: http://localhost:4000（如果已启动前台程序，则不需打开此地址）

```