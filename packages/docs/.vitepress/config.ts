import { defineConfig } from "vitepress";
import cats from "../../../categories/index.json" with { type: "json" };

export default defineConfig({
  title: "Evora UI Icons",
  description: "Free, open‑source SVG icon components for Vue — tree‑shakable, typed, SSR/CSP‑friendly.",
  cleanUrls: true,
  head: [
    ["link", { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    ["link", { rel: "icon", type: "image/png", href: "/favicon.png" }],
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
    [
      "script",
      {
        "data-utcoffset": "3",
        "data-id": "a797f3e2-b44b-42ab-8604-69724bfffdab",
        src: "https://cdn.counter.dev/script.js",
      },
    ],
  ],
  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "Evora / Icons",
    nav: [
      { text: "Icons", link: "/icons" },
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Usage", link: "/guide/usage" },
      { text: "SSR", link: "/guide/ssr" },
      { text: "License", link: "/license" },
    ],
    sidebar: {
      "/guide/": [
        { text: "Getting Started", link: "/guide/getting-started" },
        { text: "Usage & API", link: "/guide/usage" },
        { text: "SSR & CSP", link: "/guide/ssr" },
      ],
      "/icons/": [
        {
          text: "View",
          items: [
            { text: "All", link: "/icons/" },
            {
              text: "Categories",
              link: "/icons/categories",
              items: [
                ...((cats as any).categories || []).map((c: any) => {
                  const words = String(c.key)
                    .split("-")
                    .map((w: string) => w[0].toUpperCase() + w.slice(1));
                  const text = `${words.join(" & ")}`;
                  return { text, link: `/icons/categories/${c.key}` };
                }),
              ],
            },
          ],
        },
      ],
    },
    socialLinks: [{ icon: "github", link: "https://github.com/evora-ui/evora-icons" }],
    aside: false,
  },
  vite: {},
  // Generate sitemap.xml at build time
  sitemap: {
    hostname: "https://icons.evora.dev",
  },
});
