import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Mic, User, Activity } from "lucide-react";
import { getLocalAccessToken } from "@/lib/utils";

const RecordPage = () => {
  const accessToken = getLocalAccessToken();
  const [patientName, setPatientName] = useState("");

  const handleRecord = async () => {
    try {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || tab.id === undefined || !tab.url) {
        console.error(
          "No active tab found, tab ID is undefined, or URL is missing."
        );
        toast.error(
          "Cannot start recording: No active tab or invalid tab information."
        );
        return;
      }
      const tabUrl = tab.url;
      if (
        tabUrl.startsWith("chrome://") ||
        tabUrl.startsWith("about:") ||
        tabUrl.startsWith("edge://") ||
        tabUrl.startsWith("moz-extension://") ||
        tabUrl.startsWith("brave://") ||
        tabUrl.startsWith("vivaldi://") ||
        tabUrl.startsWith("file:///")
      ) {
        toast.error("Cannot record on internal browser pages or local files.");
        return;
      }

      if (
        tabUrl.includes("chrome.google.com/webstore") ||
        tabUrl.includes("addons.mozilla.org")
      ) {
        console.warn(
          `Cannot record on browser extension store page: ${tabUrl}`
        );
        toast.error("Cannot record on browser extension store pages.");
        return;
      }

      await browser.runtime.sendMessage({
        action: "MOUNT_WIDGET",
        patientName: patientName,
        accessToken: accessToken,
      });
    } catch (error) {
      console.error("Error sending MOUNT_WIDGET message:", error);
      toast.error("Failed to start recording. Please try again.");
    }
  };

  return (
    <div className=" w-full bg-gradient-to-br from-blue-50 to-white p-4 flex flex-col mt-7">
      <div className="flex flex-col text-center items-center gap-2 mb-7 justify-center ">
        <div className="w-7 h-7 bg-blue-100 rounded-md flex items-center justify-center">
          <Activity className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Record Patient
          </h1>
          <p className="text-xs text-gray-500">Capture patient interactions</p>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        <div className="relative">
          <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input
            type="text"
            placeholder="Enter patient name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="pl-8 h-9  mb-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500 placeholder:text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleRecord()}
          />
        </div>

        <Button
          onClick={handleRecord}
          disabled={!patientName.trim()}
          className="w-full h-9 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 disabled:hover:scale-100 shadow-md hover:shadow-lg disabled:shadow-none"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
              <Mic className="w-2.5 h-2.5" />
            </div>
            Start Recording
          </div>
        </Button>
      </div>

      <div className="mt-3 text-center">
        <p className="text-xs text-gray-400">Secure & HIPAA Compliant</p>
      </div>
    </div>
  );
};

export default RecordPage;
