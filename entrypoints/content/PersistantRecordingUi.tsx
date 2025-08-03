import { useState } from "react";
import Lottie from "lottie-react";
import loader from "@/assets/loader.json";
import {
  Play,
  Pause,
  Square,
  Minimize2,
  Maximize2,
  X,
  RotateCcw,
  File,
  FileText,
  Copy,
  Download,
} from "lucide-react";

type RecordingState =
  | "initial"
  | "recording"
  | "paused"
  | "stopped"
  | "review"
  | "uploading";

interface Props {
  startRecording: () => void;
  stopRecording: () => void;
  resumeRecording: () => void;
  pauseRecording: () => void;
  time: number;
  recordingState: RecordingState;
  patientName: string;
  saveAndContinue?: () => void;
  newRecording?: () => void;
  isSubmitting?: boolean;
  onClose?: () => void;
}

const formatTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
    2,
    "0"
  )}`;

export default function PersistentRecordingUI(props: Props) {
  const {
    startRecording,
    stopRecording,
    resumeRecording,
    pauseRecording,
    time,
    recordingState,
    patientName,
    isSubmitting,
    newRecording,
    saveAndContinue,
    onClose,
  } = props;
  const [loadingMessage, setLoadingMessage] = useState("");
  const [generatedNote, setGeneratedNote] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const loadingMessages = [
    "Processing recording...",
    "Analyzing audio data...",
    "Generating transcription...",
    "Finalizing results...",
    "Almost there...",
  ];
  const [isMinimized, setIsMinimized] = useState(false);
  const saveToPDF = () => {};
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedNote);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (recordingState === "initial") startRecording();
  useEffect(() => {
    if (recordingState === "uploading") {
      let messageIndex = 0;
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;

        const newMessageIndex = Math.min(
          Math.floor((progress / 100) * loadingMessages.length),
          loadingMessages.length - 1
        );

        if (newMessageIndex !== messageIndex) {
          messageIndex = newMessageIndex;
          setLoadingMessage(loadingMessages[messageIndex]);
        }
      }, 800);

      return () => clearInterval(interval);
    }
  }, [recordingState]);
  useEffect(() => {
    const initialNote = `Patient: ${patientName}
Date: ${new Date().toLocaleDateString()}
Duration: ${formatTime(time)}

CLINICAL NOTES:
The patient presented with chief complaint of persistent headaches over the past 2 weeks. Pain is described as throbbing, primarily located in the temporal region, with intensity ranging from 6-8/10. Patient reports associated photophobia and mild nausea, particularly in the morning hours.

ASSESSMENT:
Based on the clinical presentation and history, this appears consistent with tension-type headaches, possibly with migraine characteristics. No red flag symptoms noted.

PLAN:
1. Trial of over-the-counter NSAIDs for symptomatic relief
2. Recommend stress management techniques and adequate hydration
3. Follow-up in 2 weeks if symptoms persist or worsen
4. Return immediately if severe headache, vision changes, or neurological symptoms develop

PATIENT EDUCATION:
Discussed headache triggers, importance of regular sleep schedule, and when to seek immediate medical attention.`;
    setGeneratedNote(initialNote);
  }, [patientName, time]);

  {
    if (recordingState === "initial") {
      return (
        <div className="fixed bottom-4 left-4 z-50 font-sans">
          <div className="w-80 h-[300px] bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col justify-center items-center mx-auto">
            <Lottie
              autoplay
              loop
              animationData={loader}
              style={{ width: 120, height: 120 }}
            />
          </div>
        </div>
      );
    }
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50 font-sans">
        <div className="w-60 h-16 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2 flex items-center justify-between">
          <span className="font-mono font-bold text-gray-800">
            {formatTime(time)}
          </span>

          <div className="flex gap-2">
            {recordingState === "recording" && (
              <button
                onClick={pauseRecording}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Pause size={16} />
              </button>
            )}
            {recordingState === "paused" && (
              <button
                onClick={resumeRecording}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Play size={16} />
              </button>
            )}
            <button
              onClick={stopRecording}
              className="p-1 hover:bg-gray-100 rounded text-red-500"
            >
              <Square size={16} />
            </button>
            <button onClick={() => setIsMinimized(false)}>
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (recordingState === "uploading") {
    return (
      <div className="fixed bottom-4 left-4 z-50 font-sans">
        <div className="w-80 h-[300px] bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col"></div>
        <div className="fixed bottom-4 left-4 z-50 font-sans">
          <div className="w-80 h-[300px] bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col justify-center items-center mx-auto">
            <Lottie
              autoplay
              loop
              animationData={loader}
              style={{ width: 120, height: 120 }}
            />

            <div className="text-center mt-4 space-y-3">
              <h3 className="text-sm font-normal text-gray-800">
                {loadingMessage}
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (recordingState === "review") {
    return (
      <div className="fixed bottom-4 w-[400px] left-4 z-50 font-sans rounded-md ">
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-green-800">
              Note Generated - {patientName || "Patient"}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={onClose}
              className="text-green-600 cursor-pointer hover:text-green-700"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="flex flex-col h-[420px]">
          <div className="flex-1 p-4 overflow-hidden bg-gray-50">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} className="text-blue-600" />
                <h3 className="font-semibold text-gray-800">Clinical Note</h3>
                <span className="text-xs text-gray-500 ml-auto">Editable</span>
              </div>
              <textarea
                value={generatedNote}
                onChange={(e) => setGeneratedNote(e.target.value)}
                className="flex-1 w-full text-xs text-gray-700 font-mono leading-relaxed resize-none border-none outline-none bg-transparent placeholder-gray-400"
                placeholder="Generated clinical note will appear here..."
                spellCheck={false}
              />
            </div>
          </div>

          <div className="p-4 bg-white border-t border-gray-200 space-y-3">
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className={`flex items-center cursor-pointer justify-center gap-2 px-4 py-2 flex-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  copySuccess
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300"
                }`}
              >
                <Copy size={14} />
                {copySuccess ? "Copied!" : "Copy"}
              </button>

              <button
                onClick={saveToPDF}
                className="flex items-center justify-center cursor-pointer gap-2 px-4 py-2 flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 hover:border-purple-300 rounded-lg text-sm font-medium transition-all duration-200"
              >
                <Download size={14} />
                Save PDF
              </button>
            </div>

            <button
              onClick={newRecording}
              className="flex items-center justify-center cursor-pointer gap-2 px-6 w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
            >
              <FileText size={16} className="drop-shadow-sm" />
              New Recording
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed bottom-4 left-4 z-50 font-sans">
      <div className="w-80 h-[300px] bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col">
        <>
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  recordingState === "paused" ? "bg-yellow-500" : "bg-red-500"
                } ${recordingState === "recording" ? "animate-pulse" : ""}`}
              />
              <span className="text-sm font-medium text-gray-800">
                {recordingState === "paused"
                  ? "Paused"
                  : recordingState === "recording"
                  ? "Recording"
                  : "Stopped"}{" "}
                - {patientName || "Patient"}
              </span>
            </div>
            <div className="flex gap-1 cursor-pointer">
              <button onClick={() => setIsMinimized(true)}>
                <Minimize2 size={14} />
              </button>
              <button onClick={onClose}>
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="text-3xl font-mono font-bold text-gray-800 mb-6">
              {formatTime(time)}
            </div>

            <div className="flex gap-3 w-full items-center justify-center">
              {recordingState === "recording" && (
                <button
                  onClick={pauseRecording}
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 rounded-md text-sm"
                >
                  <Pause size={16} /> Pause
                </button>
              )}
              {recordingState === "paused" && (
                <button
                  onClick={resumeRecording}
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 rounded-md text-sm"
                >
                  <Play size={16} /> Resume
                </button>
              )}
              {(recordingState === "recording" ||
                recordingState === "paused") && (
                <button
                  onClick={stopRecording}
                  className="flex  cursor-pointer items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                >
                  <Square size={16} /> Stop
                </button>
              )}
              {recordingState === "stopped" && (
                <button
                  onClick={saveAndContinue}
                  className="flex items-center cursor-pointer justify-center gap-2 px-6 w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
                >
                  <File size={16} className="drop-shadow-sm" />
                  Save & Continue
                </button>
              )}
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
