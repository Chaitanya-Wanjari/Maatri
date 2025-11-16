import React, { useState, useRef, useEffect } from "react";
import BotLogo from "../assets/logo.jpeg";
import UserImage from "../assets/heroimage.jpg";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8001/ask";

const welcomeText =
  "नमस्ते! 👋 मैं मातृ हूँ — आपकी मातृत्व स्वास्थ्य सहायक। कृपया बताएं, मैं आपकी कैसे मदद कर सकती हूँ?";

const HindiChatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Welcome message with typing animation
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      i++;
      setMessages([{ text: welcomeText.slice(0, i), sender: "bot", showSources: false }]);
      if (i >= welcomeText.length) clearInterval(typingInterval);
    }, 30);
    return () => clearInterval(typingInterval);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    const question = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();

      const botMessage = {
        text: data.answer,
        disclaimer: data.disclaimer,
        sources: data.sources,
        sender: "bot",
        showSources: false,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ सर्वर से कनेक्शन में समस्या हुई।", sender: "bot", showSources: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const toggleSources = (index) => {
    setMessages((prev) =>
      prev.map((m, i) => (i === index ? { ...m, showSources: !m.showSources } : m))
    );
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-4xl mx-auto border border-warm-border rounded-xl bg-warm-cardbg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-warm-border bg-warm-bg rounded-t-xl">
        <h1 className="text-2xl font-serif text-warm-primary font-bold">
          मातृ — मातृत्व स्वास्थ्य सहायक
        </h1>
        <button
          onClick={() => navigate("/")}
          className="px-3 py-1 bg-warm-button text-warm-buttonText rounded hover:bg-warm-accent transition"
        >
          Home
        </button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "bot" && (
              <img
                src={BotLogo}
                alt="Bot"
                className="w-10 h-10 rounded-full mr-2 border border-warm-border"
              />
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`max-w-[80%] p-3 rounded-xl whitespace-pre-line shadow ${
                msg.sender === "user"
                  ? "bg-warm-primary text-warm-buttonText"
                  : "bg-warm-soft text-warm-bg"
              }`}
            >
              {msg.text}
              {msg.disclaimer && (
                <p className="mt-2 text-xs text-gray-500">{msg.disclaimer}</p>
              )}

              {msg.sources && msg.sources.length > 0 && (
                <>
                  <button
                    className="mt-2 px-2 py-1 bg-warm-accent text-warm-primary rounded hover:opacity-80 transition text-sm"
                    onClick={() => toggleSources(i)}
                  >
                    {msg.showSources ? "स्रोत छुपाएं" : "स्रोत देखें"}
                  </button>
                  {msg.showSources && (
                    <div className="mt-2 space-y-1">
                      {msg.sources.map((s, idx) => (
                        <div
                          key={idx}
                          className="bg-warm-bg border border-warm-border p-2 rounded text-sm text-warm-primary"
                        >
                          <span className="font-semibold">{s.source}:</span> {s.text.slice(0, 80)}...
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
            {msg.sender === "user" && (
              <img
                src={UserImage}
                alt="User"
                className="w-10 h-10 rounded-full ml-2 border border-warm-border"
              />
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2">
            <img
              src={BotLogo}
              alt="Bot"
              className="w-10 h-10 rounded-full mr-2 border border-warm-border"
            />
            <div className="max-w-[70%] p-3 rounded-xl bg-warm-soft flex items-center justify-center space-x-1">
              <span className="w-2.5 h-2.5 bg-warm-primary rounded-full animate-bounce"></span>
              <span className="w-2.5 h-2.5 bg-warm-primary rounded-full animate-bounce delay-150"></span>
              <span className="w-2.5 h-2.5 bg-warm-primary rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex p-3 border-t border-warm-border bg-warm-bg sticky bottom-0">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-xl border border-warm-border focus:outline-none focus:ring-2 focus:ring-warm-accent"
          placeholder="अपना प्रश्न यहाँ लिखें..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="ml-2 px-4 py-2 rounded-xl bg-warm-button text-warm-buttonText hover:bg-warm-accent"
          onClick={sendMessage}
        >
          भेजें
        </button>
      </div>
    </div>
  );
};

export default HindiChatbot;
