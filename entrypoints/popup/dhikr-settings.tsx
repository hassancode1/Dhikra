import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Clock, Repeat } from "lucide-react";

const DhikrSettings = () => {
  const [frequency, setFrequency] = useState<number>(1);
  const [duration, setDuration] = useState<number>(10);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    browser.storage.local.get(["dhikrFrequency", "dhikrDuration", "dhikrActive"]).then((result) => {
      if (result.dhikrFrequency) setFrequency(result.dhikrFrequency);
      if (result.dhikrDuration) setDuration(result.dhikrDuration);
      if (result.dhikrActive !== undefined) setIsActive(result.dhikrActive);
    });
  }, []);

  const handleSave = async () => {
    setStatus("Starting...");
    console.log("POPUP: Start clicked - frequency:", frequency, "duration:", duration);
    
    try {
      // Save to storage
      await browser.storage.local.set({
        dhikrFrequency: frequency,
        dhikrDuration: duration,
        dhikrActive: true,
      });
      setIsActive(true);
      
      // Send message to background script
      const message = { 
        action: "START_DHIKR",
        frequency,
        duration,
      };
      
      console.log("POPUP: Sending to background:", message);
      const response = await browser.runtime.sendMessage(message);
      console.log("POPUP: Background response:", response);
      
      setStatus("✓ Started! Modal should appear on open tabs.");
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("POPUP: Error:", error);
      setStatus("✗ Error: " + (error as Error).message);
      setTimeout(() => setStatus(""), 5000);
    }
  };

  const handleStop = async () => {
    console.log("POPUP: Stop clicked");
    setStatus("Stopping...");
    
    try {
      await browser.storage.local.set({
        dhikrActive: false,
      });
      setIsActive(false);
      
      await browser.runtime.sendMessage({ action: "STOP_DHIKR" });
      console.log("POPUP: Stop message sent");
      
      setStatus("✓ Stopped");
      setTimeout(() => setStatus(""), 2000);
    } catch (error) {
      console.error("POPUP: Stop error:", error);
      setStatus("✗ Error stopping");
      setTimeout(() => setStatus(""), 3000);
    }
  };

  const handleTest = async () => {
    setStatus("Testing...");
    console.log("POPUP: Test clicked - duration:", duration);
    
    try {
      // Send test message via background script
      await browser.runtime.sendMessage({
        action: "TEST_DHIKR",
        duration: duration,
      });
      console.log("POPUP: Test message sent");
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
          <h1 className="text-xl font-semibold text-gray-900">Dhikr Settings</h1>
          <p className="text-xs text-gray-500">Configure dhikr reminders</p>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <Label htmlFor="frequency" className="text-sm font-medium flex items-center gap-2 mb-2">
            <Repeat className="w-4 h-4" />
            Frequency (how many times)
          </Label>
          <Input
            id="frequency"
            type="number"
            min="1"
            value={frequency}
            onChange={(e) => setFrequency(parseInt(e.target.value) || 1)}
            className="h-9 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter frequency"
          />
        </div>

        <div>
          <Label htmlFor="duration" className="text-sm font-medium flex items-center gap-2 mb-2">
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
          <Button
            onClick={handleStop}
            className="w-full h-9 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
          >
            Stop Dhikr Reminders
          </Button>
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

