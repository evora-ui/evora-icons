import "./styles/sidebar.css";
import "./styles/layout.css";
import "./styles/colors.css";
import "./styles/icon-all.css";
import "./styles/icon-controls.css";
import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import IconAll from "./components/IconAll.vue";
import IconCategories from "./components/IconCategories.vue";
import IconCategory from "./components/IconCategory.vue";
import IconTeaser from "./components/IconTeaser.vue";

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    DefaultTheme.enhanceApp?.({ app });
    app.component("IconAll", IconAll);
    app.component("IconCategories", IconCategories);
    app.component("IconCategory", IconCategory);
    app.component("IconTeaser", IconTeaser);
  },
};

export default theme;
