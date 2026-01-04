import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface DhikrModalProps {
  duration: number;
  onClose: () => void;
}

interface DhikrData {
  text: string;
  translation: string;
  source?: string;
}

const DHIKR_LIST: DhikrData[] = [
  {
    text: "SubhanAllah",
    translation: "Glory be to Allah",
    source: "Hadith",
  },
  {
    text: "SubhanAllahi wa bihamdihi",
    translation: "Glory be to Allah and all praise is due to Him",
    source: "Hadith - Muslim",
  },
  {
    text: "La ilaha illa Allah",
    translation: "There is no god but Allah",
    source: "Quran",
  },
  {
    text: "Allahu Akbar",
    translation: "Allah is the Greatest",
    source: "Quran",
  },
  {
    text: "Astaghfirullah",
    translation: "I seek forgiveness from Allah",
    source: "Hadith",
  },
  {
    text: "La hawla wa la quwwata illa billah",
    translation: "There is no power nor strength except with Allah",
    source: "Hadith",
  },
  {
    text: "Rabbi ighfir li",
    translation: "O my Lord, forgive me",
    source: "Quran",
  },
  {
    text: "Allahumma salli ala Muhammad",
    translation: "O Allah, send blessings upon Muhammad",
    source: "Hadith",
  },
  {
    text: "SubhanAllahi wa bihamdihi SubhanAllahil Azeem",
    translation:
      "Glory be to Allah and all praise is due to Him, Glory be to Allah, the Great",
    source: "Hadith",
  },
  {
    text: "Rabbana atina fid dunya hasanatan wa fil akhirati hasanatan wa qina azaban nar",
    translation:
      "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire",
    source: "Quran 2:201",
  },
  {
    text: "Allahumma anta rabbi la ilaha illa anta khalaqtani wa ana abduka",
    translation:
      "O Allah, You are my Lord, there is no god but You. You created me and I am Your servant",
    source: "Hadith",
  },
  {
    text: "Hasbiyallahu la ilaha illa huwa alayhi tawakkaltu",
    translation:
      "Allah is sufficient for me. There is no god but Him. In Him I put my trust",
    source: "Quran 9:129",
  },
  {
    text: "Rabbi ij'alni muqeemas salati wa min zurriyyati",
    translation:
      "My Lord, make me an establisher of prayer, and from my descendants",
    source: "Quran 14:40",
  },
  {
    text: "Allahumma inni as'alukal afwa wal afiyah",
    translation: "O Allah, I ask You for forgiveness and well-being",
    source: "Hadith",
  },
  {
    text: "SubhanAllahi walhamdulillahi wa la ilaha illa Allahu wallahu akbar",
    translation:
      "Glory be to Allah, all praise is due to Allah, there is no god but Allah, and Allah is the Greatest",
    source: "Hadith",
  },
  {
    text: "Rabbana taqabbal minna innaka antas samee'ul aleem",
    translation:
      "Our Lord, accept from us. Indeed, You are the Hearing, the Knowing",
    source: "Quran 2:127",
  },
  {
    text: "Allahumma barik li fi ma razaqtani",
    translation: "O Allah, bless me in what You have provided me",
    source: "Hadith",
  },
  {
    text: "Rabbi zidni ilma",
    translation: "My Lord, increase me in knowledge",
    source: "Quran 20:114",
  },
  {
    text: "Allahumma inni a'udhu bika min azabi jahannam",
    translation: "O Allah, I seek refuge in You from the punishment of Hell",
    source: "Hadith",
  },
  {
    text: "La ilaha illa anta subhanaka inni kuntu minaz zalimin",
    translation:
      "There is no god but You. Glory be to You. Indeed, I have been of the wrongdoers",
    source: "Quran 21:87",
  },
  {
    text: "Rabbi ishrah li sadri wa yassir li amri",
    translation: "My Lord, expand for me my breast and ease for me my task",
    source: "Quran 20:25-26",
  },
  {
    text: "Allahumma rahmataka arju",
    translation: "O Allah, I hope for Your mercy",
    source: "Hadith",
  },
  {
    text: "SubhanAllahil Azeem wa bihamdihi",
    translation: "Glory be to Allah, the Great, and all praise is due to Him",
    source: "Hadith",
  },
  {
    text: "Rabbana la tu'akhidhna in naseena aw akhta'na",
    translation:
      "Our Lord, do not impose blame upon us if we have forgotten or erred",
    source: "Quran 2:286",
  },
  {
    text: "Allahumma antas salam wa minkas salam",
    translation: "O Allah, You are Peace, and from You comes peace",
    source: "Hadith",
  },
  {
    text: "Hasbunallahu wa ni'mal wakeel",
    translation:
      "Allah is sufficient for us, and He is the best Disposer of affairs",
    source: "Quran 3:173",
  },
  {
    text: "Rabbi hab li hukma",
    translation: "My Lord, grant me wisdom",
    source: "Quran 26:83",
  },
  {
    text: "Allahumma inni as'alukal huda wat tuqa",
    translation: "O Allah, I ask You for guidance and piety",
    source: "Hadith",
  },
  {
    text: "Subhana rabbiyal a'la",
    translation: "Glory be to my Lord, the Most High, the Most Exalted",
    source: "Hadith",
  },
  {
    text: "Rabbana amanna faghfir lana warhamna",
    translation:
      "Our Lord, we have believed, so forgive us and have mercy upon us",
    source: "Quran 23:109",
  },
  {
    text: "Allahumma a'idhni min sharri ma amiltu",
    translation: "O Allah, protect me from the evil of what I have done",
    source: "Hadith",
  },
  {
    text: "La ilaha illa Allahu Muhammadur rasulullah",
    translation:
      "There is no god but Allah, Muhammad is the Messenger of Allah",
    source: "Shahada",
  },
  {
    text: "Rabbi a'udhu bika min hamazatish shayatin",
    translation:
      "My Lord, I seek refuge in You from the suggestions of the devils",
    source: "Quran 23:97",
  },
  {
    text: "Allahumma aslih li deeni alladhi huwa ismatu amri",
    translation:
      "O Allah, make my religion right for me, which is the safeguard of my affairs",
    source: "Hadith",
  },
  {
    text: "SubhanAllahi wa bihamdihi adada khalqihi",
    translation:
      "Glory be to Allah and all praise is due to Him, by the number of His creation",
    source: "Hadith",
  },
  {
    text: "Rabbana la tuzigh qulubana ba'da idh hadaytana",
    translation:
      "Our Lord, do not let our hearts deviate after You have guided us",
    source: "Quran 3:8",
  },
  {
    text: "Allahumma inni as'alukal jannah",
    translation: "O Allah, I ask You for Paradise",
    source: "Hadith",
  },
  {
    text: "Hasbiyallahu wa ni'mal wakeel",
    translation: "Allah is sufficient for me, and He is the best Trustee",
    source: "Quran 3:173",
  },
  {
    text: "Rabbi ij'alni shakiran li ni'matika",
    translation: "My Lord, make me grateful for Your favor",
    source: "Quran 27:19",
  },
  {
    text: "Allahumma tahhir qalbi",
    translation: "O Allah, purify my heart",
    source: "Hadith",
  },
  {
    text: "SubhanAllahi walhamdulillah",
    translation: "Glory be to Allah and all praise is due to Allah",
    source: "Hadith",
  },
  {
    text: "Rabbana zalamna anfusana wa in lam taghfir lana wa tarhamna lanakunanna minal khasirin",
    translation:
      "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers",
    source: "Quran 7:23",
  },
  {
    text: "Allahumma a'idhni minal kasal",
    translation: "O Allah, protect me from laziness",
    source: "Hadith",
  },
  {
    text: "La hawla wa la quwwata illa billahil a'liyyil azeem",
    translation:
      "There is no power nor strength except with Allah, the Most High, the Most Great",
    source: "Hadith",
  },
  {
    text: "Rabbi irhamhuma kama rabbayani saghira",
    translation:
      "My Lord, have mercy upon them as they brought me up when I was small",
    source: "Quran 17:24",
  },
  {
    text: "Allahumma inni as'aluka sihatan fi iman",
    translation: "O Allah, I ask You for health in faith",
    source: "Hadith",
  },
  {
    text: "Rabbana amanna bima anzalta",
    translation: "Our Lord, we have believed in what You revealed",
    source: "Quran 3:53",
  },
  {
    text: "Allahumma ya muqallibal qulub thabbit qalbi ala deenik",
    translation:
      "O Allah, O Turner of hearts, make my heart firm upon Your religion",
    source: "Hadith",
  },
  {
    text: "La ilaha illa Allahu wahdahu la sharika lahu",
    translation: "There is no god but Allah alone, with no partner to Him",
    source: "Hadith",
  },
  {
    text: "Rabbi hab li min ladunka zurriyyatan tayyibah",
    translation: "My Lord, grant me from Yourself a good offspring",
    source: "Quran 3:38",
  },
  {
    text: "Allahumma inni a'udhu bika minal hammi wal hazan",
    translation: "O Allah, I seek refuge in You from grief and sadness",
    source: "Hadith",
  },
];

export default function DhikrModal({ duration, onClose }: DhikrModalProps) {
  const [dhikr, setDhikr] = useState<DhikrData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(duration);

  useEffect(() => {
    // Randomly select a dhikr from the list
    const randomDhikr =
      DHIKR_LIST[Math.floor(Math.random() * DHIKR_LIST.length)];
    setDhikr(randomDhikr);
  }, []);

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
          {dhikr ? (
            <>
              <div
                className="text-center mb-8"
                style={{ marginBottom: "3rem" }}
              >
                <h2
                  className="font-bold mb-6"
                  style={{
                    fontSize: "6rem",
                    fontWeight: "700",
                    lineHeight: "1.2",
                    marginBottom: "2.5rem",
                    letterSpacing: "0.05em",
                    fontFamily:
                      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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

