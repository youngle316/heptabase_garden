![cover](https://3aed3bd.webp.li/202412301102553.png)

# Heptabase Garden

> Deploy your own Heptabase-powered website in minutes with Next.js and Vercel.

[中文版 README](README-CN.md)

## Intro

This is a simple website that displays your Heptabase notes in a beautiful way. [notes.younglele.cc](https://notes.yanglele.cc)

And this is the [original whiteboard](https://app.heptabase.com/w/641ea3e118cf2f1d33cda32e8580f77efa59094fc805b326c9fc8c6dd16489ee)

It uses [Heptabase](https://heptabase.com/) as a CMS, the interface comes from [draJiang](https://github.com/draJiang)


## Features

- Display the notes content of Heptabase
- Update Heptabase notes using ISR
- Basically consistent with the official style of Heptabase
- Support dark mode
- Support mobile
- Support show links to the original notes
- Support displaying Spotify and Douban links through embedding.

## Notes ❗

- The whiteboard must contain a card named 'About', which will be displayed as the homepage.
- Images and videos uploaded directly to Heptabase cannot be loaded properly.
  - You can use image hosting services.
  - YouTube and Bilibili videos can be loaded properly.


## How to use

All config is defined in [site.config.ts](https://github.com/youngle316/heptabase_garden/blob/main/site.config.ts)

This project requires a recent version of Node.js (recommend >= 16).

1. Fork this repo
2. Change a few values in [site.config.ts](https://github.com/youngle316/heptabase_garden/blob/main/site.config.ts)
3. Must add a card named 'About' to the whiteboard, which will be displayed as the homepage.
4. npm install
5. npm run dev to test locally
6. Deploy to Vercel

I tried to make configuration as easy as possible — All you really need to do to get started is edit `whiteboardId`.

### How to get whiteboardId

![whiteboardId](https://3aed3bd.webp.li/202412301210513.png)

1. Open your Heptabase whiteboard
2. Click the share button
3. Copy the whiteboard id

> app.heptabase.com/w/641ea3e118cf2f1d33cda32e8580f77efa59094fc805b326c9fc8c6dd16489ee， 641ea3e118cf2f1d33cda32e8580f77efa59094fc805b326c9fc8c6dd16489ee is whiteboardId

### How to deploy to Vercel

After change your `whiteboardId` and commit your changes, you can deploy to Vercel.

1. create a new proeject in [vercel](https://vercel.com/)
2. select your forked repo and click `import` button
3. click `deploy` button

## Update your notes

1. Open your Heptabase whiteboard
2. Click the share button
3. Click the Publish Changes Button
4. Refresh your website

The Project uses ISR to update the notes, so you don't need to redeploy to update the notes.

### What is ISR?

ISR is a feature of Next.js that allows you to update your website without rebuilding the entire site. It works by generating a static version of your site at build time, and then updating the static version when new content is published.

There is a `revalidate` in [page.tsx](https://github.com/youngle316/heptabase_garden/blob/main/app/page.tsx). When the value is 3600, it means one hour. It indicates that after the successful deployment, the webpage was opened for the first time, and the heptabase notes were updated within an hour. The interface will not display the latest content. You need to check the webpage again after an hour. At this time, the backend will rebuild, and after the rebuild is completed (usually within one or two minutes), refreshing the page will display the latest content.

You can set it according to your needs.

## Update Project

If you want to update the project, you can do the following:

- Update via the GitHub website
  - Enter the repository you forked.
  - Click the `Sync fork` button
  - Click "Update branch" to proceed.
- Redeploy Project

## Thanks

The project's inspiration and the interfaces used are from [draJiang](https://github.com/draJiang).
