import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Clock, Repeat } from "lucide-react";

// Time interval options in minutes
const INTERVAL_OPTIONS = [
  { value: 10, label: "Every 10 minutes" },
  { value: 30, label: "Every 30 minutes" },
  { value: 60, label: "Every 1 hour" },
  { value: 120, label: "Every 2 hours" },
  { value: 180, label: "Every 3 hours" },
  { value: 240, label: "Every 4 hours" },
  { value: 360, label: "Every 6 hours" },
  { value: 480, label: "Every 8 hours" },
  { value: 720, label: "Every 12 hours" },
];

const DhikrSettings = () => {
  const [intervalMinutes, setIntervalMinutes] = useState<number>(60); // Default: 1 hour
  const [duration, setDuration] = useState<number>(10);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    browser.storage.local
      .get(["dhikrIntervalMinutes", "dhikrDuration", "dhikrActive"])
      .then((result) => {
        if (result.dhikrIntervalMinutes)
          setIntervalMinutes(result.dhikrIntervalMinutes);
        if (result.dhikrDuration) setDuration(result.dhikrDuration);
        if (result.dhikrActive !== undefined) setIsActive(result.dhikrActive);
      });
  }, []);

  const handleSave = async () => {
    setStatus("Starting...");
    try {
      await browser.storage.local.set({
        dhikrIntervalMinutes: intervalMinutes,
        dhikrDuration: duration,
        dhikrActive: true,
      });
      setIsActive(true);

      const message = {
        action: "START_DHIKR",
        intervalMinutes,
        duration,
      };

      await browser.runtime.sendMessage(message);
      setStatus(
        "✓ Started! Modal will show every " +
          INTERVAL_OPTIONS.find(
            (opt) => opt.value === intervalMinutes
          )?.label.toLowerCase()
      );
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("POPUP: Error:", error);
      setStatus("✗ Error: " + (error as Error).message);
      setTimeout(() => setStatus(""), 5000);
    }
  };

  const handleStop = async () => {
    setStatus("Stopping...");

    try {
      await browser.storage.local.set({
        dhikrActive: false,
      });
      setIsActive(false);

      await browser.runtime.sendMessage({ action: "STOP_DHIKR" });

      setStatus("✓ Stopped");
      setTimeout(() => setStatus(""), 2000);
    } catch (error) {
      setStatus("✗ Error stopping");
      setTimeout(() => setStatus(""), 3000);
    }
  };

  const handleTest = async () => {
    setStatus("Testing...");

    try {
      await browser.runtime.sendMessage({
        action: "TEST_DHIKR",
        duration: duration,
      });
      setStatus("✓ Test sent! Check your open tabs.");
      setTimeout(() => setStatus(""), 3000);
    } catch (error: any) {
      console.error("POPUP: Test error:", error);
      setStatus("✗ Error: " + error.message);
      setTimeout(() => setStatus(""), 5000);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-white p-4 flex flex-col">
      <div className="flex flex-col text-center items-center gap-2 mb-7 justify-center">
        <div className="w-7 h-7 bg-blue-100 rounded-md flex items-center justify-center">
          <Settings className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Dhikr Settings
          </h1>
          <p className="text-xs text-gray-500">Configure dhikr reminders</p>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <Label
            htmlFor="interval"
            className="text-sm font-medium flex items-center gap-2 mb-2"
          >
            <Repeat className="w-4 h-4" />
            How often to show
          </Label>
          <select
            id="interval"
            value={intervalMinutes}
            onChange={(e) => setIntervalMinutes(parseInt(e.target.value))}
            className="w-full h-9 px-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none text-sm bg-white"
          >
            {INTERVAL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label
            htmlFor="duration"
            className="text-sm font-medium flex items-center gap-2 mb-2"
          >
            <Clock className="w-4 h-4" />
            Duration (seconds to show)
          </Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 10)}
            className="h-9 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter duration in seconds"
          />
        </div>

        <Button
          onClick={handleTest}
          className="w-full h-9 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
        >
          Test Modal (Show Now)
        </Button>

        {!isActive ? (
          <Button
            onClick={handleSave}
            className="w-full h-9 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
          >
            Start Dhikr Reminders
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="flex-1 h-9 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
            >
              Change Settings
            </Button>
            <Button
              onClick={handleStop}
              className="flex-1 h-9 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
            >
              Stop
            </Button>
          </div>
        )}
      </div>

      <div className="mt-3 text-center">
        <p className="text-xs text-gray-400">Configure your dhikr reminders</p>
        {status && (
          <p className="text-xs mt-2 text-blue-600 font-medium">{status}</p>
        )}
      </div>
    </div>
  );
};

export default DhikrSettings;

