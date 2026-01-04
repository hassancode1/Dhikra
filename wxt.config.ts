import { defineConfig } from "wxt";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"),
      },
    },
  }),
  manifest: {
    permissions: ["activeTab", "storage", "tabs", "scripting", "alarms"],
    name: "Dhikr Reminder",
    description:
      "A Chrome extension that reminds you with dhikr throughout the day",
    version: "1.0.0",
    icons: {
      16: "icon/16.png",
      32: "icon/32.png",
      48: "icon/48.png",
      96: "icon/96.png",
      128: "icon/128.png",
    },
  },
});
