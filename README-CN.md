![cover](https://3aed3bd.webp.li/202412301102553.png)

# Heptabase 知识花园

> 使用 Next.js 和 Vercel，几分钟内部署你自己的 Heptabase 驱动的网站。

## 简介

这是一个以优雅方式展示你的 Heptabase 笔记的简单网站。[notes.younglele.cc](https://notes.yanglele.cc)

这是[原始白板](https://app.heptabase.com/w/641ea3e118cf2f1d33cda32e8580f77efa59094fc805b326c9fc8c6dd16489ee)

它使用 [Heptabase](https://heptabase.com/) 作为 CMS，接口来自 [draJiang](https://github.com/draJiang)

## 特性

- 展示 Heptabase 笔记内容
- 使用 ISR 更新 Heptabase 笔记
- 基本保持与 Heptabase 官方风格一致
- 支持深色模式
- 支持移动端
- 支持显示原始笔记链接
- 支持 Spotify 和 豆瓣链接 embed 展示

## 注意事项 ❗

- 在白板中必须添加一个名称为 'About' 的卡片，这个卡片将作为首页展示。
- 直接上传到 Heptabase 的图片和视频无法正常加载。
  - 你可以使用图床服务。
  - YouTube 和 Bilibili 视频可以正常加载。

## 使用方法

所有配置都定义在 [site.config.ts](https://github.com/youngle316/heptabase_garden/blob/main/site.config.ts) 中

本项目需要较新版本的 Node.js（推荐 >= 16）。

1. Fork 此仓库
2. 在 [site.config.ts](https://github.com/youngle316/heptabase_garden/blob/main/site.config.ts) 中修改几个值
3. 在白板中必须添加一个名称为 'About' 的卡片，这个卡片将作为首页展示。
4. npm install
5. npm run dev 在本地测试
6. 部署到 Vercel

我尽量让配置变得简单 — 你真正需要做的就是编辑 `whiteboardId`。

### 如何获取 whiteboardId

![whiteboardId](https://3aed3bd.webp.li/202412301210513.png)

1. 打开 Heptabase 白板
2. 点击`share`按钮
3. 复制白板 id

> app.heptabase.com/w/641ea3e118cf2f1d33cda32e8580f77efa59094fc805b326c9fc8c6dd16489ee，641ea3e118cf2f1d33cda32e8580f77efa59094fc805b326c9fc8c6dd16489ee 就是 whiteboardId

### 如何部署到 Vercel

修改你的 `whiteboardId` 并提交更改后，可以部署到 Vercel。

1. 在 [vercel](https://vercel.com/) 创建新项目
2. 选择你 fork 的仓库并点击 `import` 按钮
3. 点击 `deploy` 按钮

## 更新你的笔记

1. 打开你的 Heptabase 白板
2. 点击`share`按钮
3. 点击`Publish Changes`按钮
4. 刷新你的网站

该项目使用 ISR 更新笔记，所以不需要重新部署项目就能更新笔记。

### 什么是 ISR？

ISR 是 Next.js 的一个特性，允许你在不重建整个站点的情况下更新网站。它通过在构建时生成网站的静态版本，然后在发布新内容时更新静态版本来工作。

在 [page.tsx](https://github.com/youngle316/heptabase_garden/blob/main/app/page.tsx) 中有一个 `revalidate` 值。当值为 3600 时，表示一小时。这表示在成功部署后，第一次打开网页时，如果在一小时内更新了 heptabase 笔记，界面仍然会使用缓存。需要在一小时后再次查看网页，这时后端会重新构建，构建完成后（通常在一两分钟内），刷新页面就会显示最新内容。

你可以根据自己的需求设置它。

## 更新项目

如果你想更新项目，可以执行以下操作：

- 通过 GitHub 网站更新
  - 进入你 fork 的仓库
  - 点击 `Sync fork` 按钮
  - 点击 "Update branch" 继续
- 重新部署项目

## 致谢

项目的灵感和使用的接口来自 [draJiang](https://github.com/draJiang)。