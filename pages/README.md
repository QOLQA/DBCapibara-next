# Empty pages folder

This folder exists to satisfy Next.js requirements when using Feature-Sliced Design (FSD) with the App Router.

Next.js will try to use `src/pages` as the Pages Router if this folder does not exist at the project root, which would break the build when using FSD layers inside `src/`.

See: [FSD Usage with Next.js](https://feature-sliced.design/docs/guides/tech/with-nextjs)
