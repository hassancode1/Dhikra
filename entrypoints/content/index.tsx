import "./style.css";
import ReactDOM from "react-dom/client";
import DhikrModal from "./DhikrModal";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",

  async main(ctx) {
    console.log("Dhikr content script loaded.");
    let dhikrModalRoot: ReactDOM.Root | null = null;
    let dhikrModalWrapper: HTMLDivElement | null = null;
    let isClosing = false;

    const closeModal = () => {
      if (isClosing) return;
      isClosing = true;
      setTimeout(() => {
        if (dhikrModalRoot) {
          try {
            dhikrModalRoot.unmount();
          } catch (error) {
            console.error("Error unmounting:", error);
          }
          dhikrModalRoot = null;
        }
        if (dhikrModalWrapper) {
          dhikrModalWrapper.remove();
          dhikrModalWrapper = null;
        }
        isClosing = false;
      }, 0);
    };

    const showDhikrModal = (duration: number) => {
      if (dhikrModalRoot || dhikrModalWrapper) {
        closeModal();
        setTimeout(() => {
          createNewModal(duration);
        }, 100);
        return;
      }

      createNewModal(duration);
    };

    const createNewModal = (duration: number) => {
      if (!document.body) {
        return;
      }

      const wrapper = document.createElement("div");
      wrapper.id = "dhikr-modal-container";
      wrapper.style.cssText =
        "position: fixed; inset: 0; z-index: 999999999; pointer-events: auto;";
      document.body.appendChild(wrapper);

      const root = ReactDOM.createRoot(wrapper);
      dhikrModalRoot = root;
      dhikrModalWrapper = wrapper;

      root.render(<DhikrModal duration={duration} onClose={closeModal} />);
    };

    // Listen for messages from background script to show modal
    browser.runtime.onMessage.addListener((event, sender, sendResponse) => {
      if (event.action === "SHOW_DHIKR_MODAL") {
        const duration = event.duration || 10;
        try {
          showDhikrModal(duration);
          sendResponse({ success: true });
        } catch (error) {
          sendResponse({ success: false, error: String(error) });
        }
        return true;
      }
      return false;
    });
  },
});
