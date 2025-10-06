---
title: "Getting Started: How to Install and Use Evora UI Icons"
head:
  - - meta
    - name: description
      content: A step‑by‑step guide to installing the Evora UI icon library in your Vue or other modern JavaScript project. Start using free, tree‑shakable icons in minutes.
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "Install Evora UI Icons",
        "step": [
          {"@type":"HowToStep","name":"Install","text":"yarn add @evora-ui/icons-vue"},
          {"@type":"HowToStep","name":"Import","text":"import { EvUser } from '@evora-ui/icons-vue/icons'"},
          {"@type":"HowToStep","name":"Use","text":"<EvUser /> in your Vue component"}
        ]
      }
---

# Getting Started with Evora UI Icons

## Install

```bash
yarn add @evora-ui/icons-vue
# or
npm i @evora-ui/icons-vue
```

## Flat imports (recommended)

```ts
import { EvUser, EvUserFilled } from '@evora-ui/icons-vue/icons'
```

```vue
<EvUser />
<EvUserFilled />
```

## Global `<EvIcon />` via provide

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { createEvoraIcons } from '@evora-ui/icons-vue'
import { EvUser, EvUserFilled } from '@evora-ui/icons-vue/icons'

createApp(App)
  .use(createEvoraIcons({
    icons: {
      'user': EvUser,
      'user-filled': EvUserFilled,
    }
  }))
  .mount('#app')
```

```vue
<EvIcon name="user" />
<EvIcon name="user-filled" color="#222" />
```
