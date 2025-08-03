import { useState, useRef } from "react";
import PersistentRecordingUI from "./PersistantRecordingUi";
import { DoctorService } from "@/generated";
import axios from "axios";

const App = ({
  patientName,
  onClose,
  accessToken,
}: {
  patientName: string;
  onClose: () => void;
  accessToken: string;
}) => {
  type RecordingState =
    | "initial"
    | "recording"
    | "paused"
    | "stopped"
    | "uploading"
    | "review";
  const [recordingState, setRecordingState] =
    useState<RecordingState>("initial");
  const [time, setTime] = useState(0);
  const [noteId, setNoteId] = useState("");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const accessToken = getLocalAccessToken();
  // const { authState } = useAuth();
  // console.log(authState);
  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  const resetTimer = () => {
    stopTimer();
    setTime(0);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => chunks.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        chunks.current = [];
        console.log("Recording finished:", blob);
      };

      mr.start();
      setRecordingState("recording");
      startTimer();
    } catch (err) {
      console.error("Mic error:", err);
      onClose();
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      setRecordingState("paused");
      stopTimer();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      setRecordingState("recording");
      startTimer();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
    stopTimer();
    setRecordingState("stopped");
  };

  const newRecording = () => {
    resetTimer();
    startRecording();
    setTranscript("");
  };
  const saveAndContinue = async () => {
    setIsSubmitting(true);
    setRecordingState("uploading");
    setError("");
    try {
      const audioBlob = new Blob(chunks.current, { type: "audio/webm" });

      const formData = new FormData();
      formData.append("audio_file", audioBlob);
      formData.append("patient_name", patientName);
      const res = await axios.post(
        "https://api.saasprohealths.com/doctors/upload/audio",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // setTranscript(res.transcript || "");
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setRecordingState("review");
      setNoteId(res?.data?.data?.id);
      console.log(res.data?.data);
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  const getNoteById = async (noteId: string) => {
    const res = await axios.get(
      `https://api.saasprohealths.com/doctors/visit/${noteId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(res.data, " NOTES");
  };

  // useEffect(() => {
  //   if (!noteId) return;
  //   const interval = setInterval(() => {
  //     getNoteById(noteId);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [noteId]);

  return (
    <>
      <PersistentRecordingUI
        startRecording={startRecording}
        stopRecording={stopRecording}
        resumeRecording={resumeRecording}
        time={time}
        recordingState={recordingState}
        pauseRecording={pauseRecording}
        patientName={patientName}
        saveAndContinue={saveAndContinue}
        isSubmitting={isSubmitting}
        newRecording={newRecording}
        onClose={onClose}
      />
    </>
  );
};
export default App;
