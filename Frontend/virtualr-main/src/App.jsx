import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Workflow from "./components/Workflow";
import Footer from "./components/Footer";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import EnglishChatbot from "./components/EnglishChatbot"; 
import HindiChatbot from "./components/HindiChatbot";
import Faqs from "./components/Faqs";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />  
      <FeatureSection />
      <Workflow />
      <Testimonials />
      <Footer />

      
      <div className="max-w-7xl mx-auto px-6">
        
        
        
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/english-chatbot" element={<EnglishChatbot />} />
        <Route path="/hindi-chatbot" element={<HindiChatbot />} />
        <Route path="/faqs" element={<Faqs />} /> 
      </Routes>
    </Router>
  );
};


export default App;
