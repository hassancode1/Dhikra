export default defineBackground(() => {
  console.log("=== Dhikr extension background script loaded ===");

  let dhikrIntervalId: NodeJS.Timeout | null = null;

  // Function to show dhikr modal on all tabs
  const showDhikrToAllTabs = async (duration: number) => {
    try {
      console.log("showDhikrToAllTabs: duration =", duration);
      const tabs = await browser.tabs.query({});
      console.log("Found", tabs.length, "tabs");

      for (const tab of tabs) {
        if (
          tab.id &&
          tab.url &&
          !tab.url.startsWith("chrome://") &&
          !tab.url.startsWith("edge://") &&
          !tab.url.startsWith("about:") &&
          !tab.url.startsWith("moz-extension://")
        ) {
          try {
            console.log("Sending to tab", tab.id, ":", tab.url);
            const response = await browser.tabs.sendMessage(tab.id, {
              action: "SHOW_DHIKR_MODAL",
              duration,
            });
            console.log("✓ Message sent to tab", tab.id, response);
          } catch (error: any) {
            // Ignore errors for tabs without content script or special pages
            if (
              error.message?.includes("Could not establish connection") ||
              error.message?.includes("message channel closed")
            ) {
              // This is expected for some tabs - content script not loaded or page doesn't support it
              console.log("⚠ Tab", tab.id, "skipped (no content script)");
            } else {
              console.error(
                "✗ Error sending to tab",
                tab.id,
                ":",
                error.message
              );
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in showDhikrToAllTabs:", error);
    }
  };

  // Function to start dhikr reminders
  const startDhikrReminders = async (
    overrideFrequency?: number,
    overrideDuration?: number
  ) => {
    console.log("startDhikrReminders called");

    // Clear existing interval
    if (dhikrIntervalId) {
      clearInterval(dhikrIntervalId);
      dhikrIntervalId = null;
    }

    // Get settings from storage
    const result = await browser.storage.local.get([
      "dhikrActive",
      "dhikrFrequency",
      "dhikrDuration",
    ]);

    const frequency = overrideFrequency ?? result.dhikrFrequency ?? 1;
    const duration = overrideDuration ?? result.dhikrDuration ?? 10;
    const isActive =
      overrideFrequency !== undefined ? true : result.dhikrActive;

    console.log("Settings:", { frequency, duration, isActive });

    if (isActive && frequency && duration) {
      // Calculate interval (1 hour / frequency)
      const intervalMs = (60 * 60 * 1000) / frequency;
      console.log(
        `Setting interval: ${intervalMs}ms (${frequency} times/hour)`
      );

      // Show immediately
      showDhikrToAllTabs(duration);

      // Set up recurring interval
      dhikrIntervalId = setInterval(() => {
        showDhikrToAllTabs(duration);
      }, intervalMs);

      console.log("✓ Reminders started");
    } else {
      console.log("✗ Not starting - missing settings");
    }
  };

  // Function to stop reminders
  const stopDhikrReminders = () => {
    console.log("stopDhikrReminders called");
    if (dhikrIntervalId) {
      clearInterval(dhikrIntervalId);
      dhikrIntervalId = null;
      console.log("✓ Reminders stopped");
    }
  };

  // Listen for messages from popup
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("📨 Message received:", message.action);

    if (message.action === "START_DHIKR") {
      startDhikrReminders(message.frequency, message.duration);
      sendResponse({ success: true });
    } else if (message.action === "STOP_DHIKR") {
      stopDhikrReminders();
      sendResponse({ success: true });
    } else if (message.action === "TEST_DHIKR") {
      showDhikrToAllTabs(message.duration || 10);
      sendResponse({ success: true });
    }

    return true;
  });

  // Listen for storage changes
  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local") {
      if (
        changes.dhikrActive ||
        changes.dhikrFrequency ||
        changes.dhikrDuration
      ) {
        const newActive = changes.dhikrActive?.newValue;
        if (newActive === false) {
          stopDhikrReminders();
        } else if (newActive === true) {
          startDhikrReminders();
        }
      }
    }
  });

  // Initialize on startup
  startDhikrReminders();

  console.log("=== Background script ready ===");
});
