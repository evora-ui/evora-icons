---
layout: home
title: "Evora UI Icons: A Free, Tree‑Shakable SVG Icon Library for Vue & React"
titleTemplate: false
head:
  - - meta
    - name: description
      content: "Get started with Evora UI Icons, a free and open‑source library of beautiful SVG icons. Fully tree‑shakable and SSR‑friendly for modern frameworks like Vue and React."
  - - meta
    - property: og:title
      content: "Evora UI Icons: A Free, Tree‑Shakable SVG Icon Library for Vue & React"
  - - meta
    - property: og:description
      content: "Get started with Evora UI Icons, a free and open‑source library of beautiful SVG icons. Fully tree‑shakable and SSR‑friendly for modern frameworks like Vue and React."
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Evora UI Icons",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
hero:
  name: Evora UI Icons
  text: 1500+ Free SVG icon components
  tagline: Free, open‑source, tree‑shakable and SSR/CSP‑friendly. Line & filled variants for modern apps.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Open Icons Gallery
      link: /icons/
features:
  - icon: "🧠"
    title: "Type‑Safe DX & Autocomplete"
    details: "Strict TypeScript types for icon names and props. IDE autocomplete and predictable imports for a faster developer flow."
  - icon: "🔒"
    title: "SSR/CSP Friendly"
    details: "Static VNodes by default — no innerHTML; hydration‑safe in SSR and CSP‑compliant out of the box."
  - icon: "✂️"
    title: "Tree‑Shakable by Design"
    details: "Flat per‑icon imports keep bundles tiny. Import only the SVG icon components you use."
  - icon: "🆓"
    title: "Free & MIT‑Licensed"
    details: "Free, open‑source SVG icons you can use in commercial projects — ideal for Vue icon components and modern web apps."
---
<section class="home-intro">
  <h2 class="tagline">Beautiful, Performant SVG Icons for Modern Web Apps</h2>
  <p class="sub">Free, open‑source, typed and SSR‑ready. Built for Vue — easy to search, import, and customize.</p>

  <div class="stat-cards">
    <div class="card">
      <div class="left"><div class="num">1500+</div><div class="label">Icons</div></div>
      <div class="right"><IconTeaser names="user,chat,play,code,star" :size="18" /></div>
    </div>
    <div class="card">
      <div class="left"><div class="num">2</div><div class="label">Variants</div></div>
      <div class="right"><IconTeaser names="user,user-filled,check,checkmark-filled" :size="18" /></div>
    </div>
    <div class="card">
      <div class="left"><div class="num">MIT</div><div class="label">License</div></div>
      <div class="right"><IconTeaser names="shield,handshake,globe" :size="18" /></div>
    </div>
    <div class="card">
      <div class="left"><div class="num">SSR</div><div class="label">CSP‑safe</div></div>
      <div class="right"><IconTeaser names="server,window,lock" :size="18" /></div>
    </div>
  </div>

  <div class="checklist">
    <span>✓ Tree‑shakable, per‑icon imports</span>
    <span>✓ Strong TypeScript typings</span>
    <span>✓ Static VNode renderers (SSR/CSP)</span>
    <span>✓ Searchable gallery and categories</span>
  </div>

  <p class="sub note"><a class="cta-link" href="/icons/">Open the full gallery →</a></p>
</section>
