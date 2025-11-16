import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { User } from "lucide-react";
import logo from "../assets/logo.jpeg";
import { useNavigate } from "react-router-dom";

const TYPING_SPEED = 40;

const conversations = [
  {
    user: "What foods should I avoid to eat?",
    bot:
      "Pregnant women should avoid raw or undercooked meats, eggs, fish high in mercury (e.g., tuna, cod, shark), and unpasteurized dairy products. Recommended foods include fruits, vegetables, whole grains, yogurt, and healthy fats (avocado, nuts). Avoid alcohol and consult a healthcare provider for personalized advice.",
  },
];

const Working = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  const [displayedUserText, setDisplayedUserText] = useState("");
  const [displayedBotText, setDisplayedBotText] = useState("");
  const [showUser, setShowUser] = useState(false);
  const [showBot, setShowBot] = useState(false);

  const userInterval = useRef(null);
  const botInterval = useRef(null);

  const clearAllIntervals = () => {
    clearInterval(userInterval.current);
    clearInterval(botInterval.current);
  };

  const typeText = (text = "", setTextFn, intervalRef, onComplete) => {
    if (!text || typeof text !== "string") return;

    let i = 0;
    setTextFn(""); // reset before typing

    clearInterval(intervalRef.current); // prevent overlaps

    intervalRef.current = setInterval(() => {
      i++;
      setTextFn(text.slice(0, i));

      if (i >= text.length) {
        clearInterval(intervalRef.current);
        if (onComplete) onComplete();
      }
    }, TYPING_SPEED);
  };

  useEffect(() => {
    if (isInView && conversations[0]) {
      clearAllIntervals();

      const { user = "", bot = "" } = conversations[0];

      setShowUser(false);
      setShowBot(false);
      setDisplayedUserText("");
      setDisplayedBotText("");

      setTimeout(() => {
        setShowUser(true);
        typeText(user, setDisplayedUserText, userInterval, () => {
          setShowBot(true);
          typeText(bot, setDisplayedBotText, botInterval);
        });
      }, 300);
    }

    return () => {
      clearAllIntervals();
    };
  }, [isInView]);

  return (
    <section
      id="workflow"   // 🔑 This ID is important for smooth scroll
      ref={ref}
      className="bg-warm-bg py-20 md:py-24 min-h-[600px] flex justify-center font-sans scroll-mt-24"
    >
      <div className="flex max-w-6xl mx-auto px-6 gap-12 w-full max-w-[1200px]">
        {/* Left Side */}
        <div className="w-1/2 flex flex-col justify-center gap-10">
          <div>
            <h2 className="text-5xl font-serif text-warm-primary mb-3">
              Start chatting with{" "}
              <span className="text-warm-primary/70">Maatri</span>
            </h2>
            <p className="text-warm-soft text-lg">
              Choose your preferred language and begin your conversation.
            </p>
          </div>

          {/* Language Buttons */}
          <div className="flex gap-4 max-w-xs">
            <button 
            onClick={() => navigate("/hindi-chatbot")}
            className="flex items-center gap-2 bg-warm-button text-warm-buttonText rounded-xl px-6 py-3 text-lg w-48 justify-center shadow-md hover:opacity-90 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              Hindi Chatbot
            </button>
            <button 
            onClick={() => navigate("/english-chatbot")}
            className="flex items-center gap-2 border border-warm-button rounded-xl px-6 py-3 text-lg w-48 justify-center text-warm-button hover:bg-warm-cardbg transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              English Chatbot
            </button>
          </div>

          {/* Workflow Steps */}
          <div className="flex flex-col gap-4 max-w-xs text-warm-soft">
            <h3 className="font-bold text-xl text-warm-primary">1. Choose a Language</h3>
            <p>Select Hindi or English to begin your conversation.</p>

            <h3 className="font-bold text-xl text-warm-primary mt-4">2. Ask Questions</h3>
            <p>Talk to Maatri about symptoms, feelings, or health info.</p>

            <h3 className="font-bold text-xl text-warm-primary mt-4">3. Get Guidance</h3>
            <p>Maatri responds instantly with care, tips, and clarity.</p>
          </div>
        </div>

        {/* Right Side Chat Simulation */}
        <div className="w-1/2 flex flex-col justify-center max-w-md ml-auto space-y-6">
          {showUser && (
            <motion.div
              className="flex items-start gap-2 justify-end"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-warm-cardbg text-sm p-3 rounded-xl shadow text-gray-800 w-fit max-w-[80%] whitespace-pre-wrap border border-warm-border">
                {displayedUserText}
                {displayedUserText.length <
                  (conversations[0]?.user?.length || 0) && (
                  <span className="animate-pulse">|</span>
                )}
              </div>
              <User className="text-warm-primary mt-1 w-5 h-5" />
            </motion.div>
          )}

          {showBot && (
            <motion.div
              className="flex items-start gap-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={logo}
                alt="Maatri Logo"
                className="mt-1 w-6 h-6 rounded-full border border-warm-border"
                style={{ objectFit: "contain" }}
              />
              <div className="bg-warm-primary text-sm text-warm-accent p-3 rounded-xl shadow w-fit max-w-[80%] whitespace-pre-wrap">
                {displayedBotText}
                {displayedBotText.length <
                  (conversations[0]?.bot?.length || 0) && (
                  <span className="animate-pulse">|</span>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Working;
