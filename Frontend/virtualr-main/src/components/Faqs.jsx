import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Faqs = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ english: [], hindi: [] });
  const [language, setLanguage] = useState("english");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFAQs, setFilteredFAQs] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const searchRef = useRef(null);

  // Load JSON data
  useEffect(() => {
    const loadData = async () => {
      try {
        const englishRes = await fetch("/data/faqs_english.json");
        const hindiRes = await fetch("/data/faqs_hindi.json");

        const englishData = await englishRes.json();
        const hindiData = await hindiRes.json();

        setData({ english: englishData, hindi: hindiData });

        // Default FAQs (first 5 Hindi for start)
        setFilteredFAQs(englishData.slice(0, 5));
      } catch (err) {
        console.error("Error loading FAQ data:", err);
      }
    };
    loadData();
  }, []);

  // Update suggestions dynamically
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }

    const matches = data[language]
      .filter((faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5);
    setSuggestions(matches);
  }, [searchTerm, data, language]);

  // Hide suggestions when clicking outside search bar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredFAQs(data[language].slice(0, 5));
    } else {
      const results = data[language].filter((faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFAQs(results);
    }
    setSuggestions([]); // hide suggestions after search
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col items-center p-6 font-sans">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-4 px-4 py-2 bg-warm-button text-warm-buttonText rounded-lg hover:bg-opacity-90 transition"
      >
        ← Back to Resources
      </button>

      {/* Heading */}
      <h1 className="text-3xl font-serif text-warm-primary mb-4 text-center">
        {language === "english"
          ? "Frequently Asked Questions"
          : "अक्सर पूछे जाने वाले प्रश्न"}
      </h1>

      {/* Language Toggle */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => {
            setLanguage("english");
            setFilteredFAQs(data.english.slice(0, 5));
          }}
          className={`px-4 py-2 rounded-full border ${
            language === "english"
              ? "bg-warm-button text-warm-buttonText"
              : "bg-warm-cardbg text-warm-primary border-warm-border"
          }`}
        >
          English
        </button>
        <button
          onClick={() => {
            setLanguage("hindi");
            setFilteredFAQs(data.hindi.slice(0, 5));
          }}
          className={`px-4 py-2 rounded-full border ${
            language === "hindi"
              ? "bg-warm-button text-warm-buttonText"
              : "bg-warm-cardbg text-warm-primary border-warm-border"
          }`}
        >
          हिन्दी
        </button>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-xl mb-6 relative flex" ref={searchRef}>
        <input
          type="text"
          placeholder={
            language === "english" ? "Search questions..." : "प्रश्न खोजें..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
              setSuggestions([]);
            }
          }}
          className="flex-1 px-4 py-2 border border-warm-border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-warm-primary bg-warm-cardbg text-warm-soft placeholder-warm-grayish"
        />
        <button
          onClick={() => {
            handleSearch();
            setSuggestions([]);
          }}
          className="px-4 py-2 bg-warm-button text-warm-buttonText rounded-r-lg hover:bg-warm-accent"
        >
          🔍
        </button>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute top-full mt-3 w-full bg-warm-cardbg border border-warm-border rounded-lg shadow-lg z-10">
            {suggestions.map((item, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setSearchTerm(item.question);
                  setSuggestions([]);
                  setFilteredFAQs([item]);
                }}
                className="px-4 py-2 hover:bg-warm-accent hover:text-warm-primary cursor-pointer transition-colors duration-150"
              >
                {item.question}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* FAQ List */}
      <div className="w-full max-w-2xl space-y-4">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-warm-cardbg border border-warm-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <h2 className="text-lg font-semibold text-warm-primary mb-2">
                {faq.question}
              </h2>
              <p className="text-warm-soft">{faq.answer}</p>
            </div>
          ))
        ) : (
          <p className="text-warm-soft text-center">
            {language === "english"
              ? "No matching questions found."
              : "कोई मिलते-जुलते प्रश्न नहीं मिले।"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Faqs;
