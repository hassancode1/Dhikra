import "./style.css";
import ReactDOM from "react-dom/client";
import App from "./App";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",

  async main(ctx) {
    console.log("Hello content script.");
    let patientName = "";
    let accessToken = "";

    const ui = await createShadowRootUi(ctx, {
      name: "wxt-react-example",
      position: "inline",
      anchor: "body",
      append: "first",
      onMount: (container) => {
        const wrapper = document.createElement("div");
        Object.assign(wrapper.style, {
          position: "fixed",
          inset: "auto 0 0 0",
          zIndex: "2147483647",
          pointerEvents: "auto",
        });
        container.append(wrapper);

        const root = ReactDOM.createRoot(wrapper);
        root.render(
          <App
            accessToken={accessToken}
            patientName={patientName}
            onClose={() => root.unmount()}
          />
        );
        return { root, wrapper };
      },
      onRemove: (elements) => {
        elements?.root.unmount();
        elements?.wrapper.remove();
      },
    });

    browser.runtime.onMessage.addListener((event) => {
      if (event.action === "MOUNT_WIDGET") {
        patientName = event.patientName ?? "";
        accessToken = event.accessToken ?? "";
        ui.mount();
      }
      return true;
    });
  },
});
