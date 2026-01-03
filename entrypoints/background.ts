export default defineBackground(() => {
  console.log("=== Dhikr extension background script loaded ===");

  let dhikrIntervalId: NodeJS.Timeout | null = null;
  let alarmName = "dhikr-reminder";

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
    overrideIntervalMinutes?: number,
    overrideDuration?: number
  ) => {
    console.log("startDhikrReminders called");

    // Clear existing interval
    if (dhikrIntervalId) {
      clearInterval(dhikrIntervalId);
      dhikrIntervalId = null;
    }

    const result = await browser.storage.local.get([
      "dhikrActive",
      "dhikrIntervalMinutes",
      "dhikrDuration",
    ]);

    const intervalMinutes =
      overrideIntervalMinutes ?? result.dhikrIntervalMinutes ?? 60;
    const duration = overrideDuration ?? result.dhikrDuration ?? 10;
    const isActive =
      overrideIntervalMinutes !== undefined ? true : result.dhikrActive;

    console.log("Settings:", { intervalMinutes, duration, isActive });

    if (isActive && intervalMinutes && duration) {
      // Convert minutes to milliseconds
      const intervalMs = intervalMinutes * 60 * 1000;

      showDhikrToAllTabs(duration);

      try {
        await browser.alarms.clear(alarmName);
      } catch (e) {}

      dhikrIntervalId = setInterval(() => {
        showDhikrToAllTabs(duration);
      }, intervalMs);

      console.log(
        `✓ Reminders started - showing every ${intervalMinutes} minutes`
      );
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
    }
    // Clear alarms
    try {
      browser.alarms.clear(alarmName);
    } catch (e) {
      // Alarms API might not be available
    }
    console.log("✓ Reminders stopped");
  };

  // Listen for messages from popup
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("📨 Message received:", message.action);

    if (message.action === "START_DHIKR") {
      startDhikrReminders(message.intervalMinutes, message.duration);
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
        changes.dhikrIntervalMinutes ||
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
