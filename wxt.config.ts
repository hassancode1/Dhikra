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
    permissions: ["activeTab", "storage", "tabs", "scripting"],
    name: "Dhikr Reminder",
    description:
      "A Chrome extension that reminds you with dhikr throughout the day",
    icons: { 32: "icon/icon32.png" },
  },
});
