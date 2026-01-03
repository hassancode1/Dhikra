import { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";

interface DhikrModalProps {
  duration: number;
  onClose: () => void;
}

interface DhikrData {
  text: string;
  translation: string;
  source?: string;
}

export default function DhikrModal({ duration, onClose }: DhikrModalProps) {
  const [dhikr, setDhikr] = useState<DhikrData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(duration);

  useEffect(() => {
    const fetchDhikr = async () => {
      setLoading(true);
      setError(null);

      const API_ENDPOINT = "https://api.alquran.cloud/v1/random";
      const fallbackList = [
        {
          text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
          translation: "Glory be to Allah and all praise is due to him",
          source: "Hadith - Muslim",
        },
        {
          text: "لَا إِلَٰهَ إِلَّا اللَّهُ",
          translation: "There is no god but Allah",
          source: "Quran",
        },
        {
          text: "اللَّهُ أَكْبَر",
          translation: "Allah is the Greatest",
          source: "Quran",
        },
        {
          text: "أَسْتَغْفِرُ اللَّه",
          translation: "I seek forgiveness from Allah",
          source: "Hadith",
        },
        {
          text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
          translation: "There is no power nor strength except with Allah",
          source: "Hadith",
        },
        {
          text: "رَبِّ اغْفِرْ لِي",
          translation: "O my Lord, forgive me",
          source: "Quran",
        },
        {
          text: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",
          translation: "O Allah, send blessings upon Muhammad",
          source: "Hadith",
        },
      ];

      try {
        const response = await axios.get(API_ENDPOINT);
        const apiData = response.data?.data;

        if (apiData?.surah && apiData?.ayahs?.length > 0) {
          const ayah = apiData.ayahs[0];
          setDhikr({
            text: ayah.text || "",
            translation: ayah.translation || "",
            source: `Quran - ${
              apiData.surah.englishName || apiData.surah.name || ""
            }`,
          });
        } else {
          throw new Error("Invalid API response");
        }
        console.log("API fetch successful, dhikr set:", dhikr);
      } catch (error) {
        const randomDhikr =
          fallbackList[Math.floor(Math.random() * fallbackList.length)];
        setDhikr(randomDhikr);
      } finally {
        setLoading(false);
      }
    };

    fetchDhikr();
  }, []);

  // Handle closing when timer reaches 0
  useEffect(() => {
    if (timeRemaining === 0) {
      console.log("Timer reached 0, calling onClose");
      const closeTimer = setTimeout(() => {
        console.log("Executing onClose callback");
        onClose();
      }, 100);
      return () => clearTimeout(closeTimer);
    }
  }, [timeRemaining, onClose]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      style={{
        position: "fixed",
        inset: "0",
        zIndex: 999999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        pointerEvents: "auto",
      }}
    >
      <div
        className="relative w-[95%] max-w-5xl rounded-2xl shadow-2xl text-white"
        style={{
          position: "relative",
          width: "95%",
          maxWidth: "64rem",
          background: "#2563eb",
          borderRadius: "1rem",
          padding: "5rem 4rem",
          color: "white",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Close button */}
        <button
          onClick={() => {
            console.log("Close button clicked");
            onClose();
          }}
          className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Close"
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            padding: "0.75rem",
            borderRadius: "50%",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "white",
          }}
        >
          <X size={28} />
        </button>

        {/* Cancel button */}
        <button
          onClick={() => {
            console.log("Cancel button clicked");
            onClose();
          }}
          className="absolute top-6 left-6 px-5 py-2.5 text-base bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-semibold"
          style={{
            position: "absolute",
            top: "1.5rem",
            left: "1.5rem",
            padding: "0.625rem 1.25rem",
            background: "rgba(255, 255, 255, 0.1)",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            color: "white",
            fontSize: "1rem",
            fontWeight: "600",
          }}
        >
          Cancel
        </button>

        {/* Content */}
        <div style={{ paddingTop: "2rem", paddingBottom: "1.5rem" }}>
          {loading ? (
            <div className="text-center py-12">
              <div
                className="w-12 h-12 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"
                style={{
                  width: "3rem",
                  height: "3rem",
                  border: "3px solid rgba(255, 255, 255, 0.3)",
                  borderTop: "3px solid white",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <p
                style={{
                  fontSize: "1.125rem",
                  opacity: 0.9,
                  fontWeight: "500",
                }}
              >
                Loading dhikr...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p style={{ fontSize: "1.125rem", opacity: 0.9 }}>{error}</p>
            </div>
          ) : dhikr ? (
            <>
              <div
                className="text-center mb-8"
                style={{ marginBottom: "3rem" }}
              >
                <h2
                  className="font-bold mb-6"
                  dir="rtl"
                  style={{
                    fontSize: "6rem",
                    fontWeight: "700",
                    lineHeight: "1.2",
                    marginBottom: "2.5rem",
                    letterSpacing: "0",
                    fontFamily:
                      '"Amiri", "Noto Sans Arabic", "Cairo", "Tajawal", "Almarai", "IBM Plex Sans Arabic", "Al Qalam Al Mushaf", "Arabic Typesetting", "Simplified Arabic", "Traditional Arabic", "Arial Unicode MS", "Segoe UI", "Tahoma", serif',
                    color: "white",
                  }}
                >
                  {dhikr.text}
                </h2>
                <p
                  style={{
                    fontSize: "2.5rem",
                    lineHeight: "1.5",
                    marginBottom: "2rem",
                    fontWeight: "400",
                    color: "white",
                  }}
                >
                  "{dhikr.translation}"
                </p>
              </div>
            </>
          ) : null}

          {/* Timer */}
          <div
            className="text-center mt-8 pt-6 border-t border-white/20"
            style={{
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <p
              className="opacity-80 font-medium"
              style={{
                fontSize: "1.125rem",
                opacity: 0.8,
                fontWeight: "500",
              }}
            >
              Closing in {timeRemaining} second{timeRemaining !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

