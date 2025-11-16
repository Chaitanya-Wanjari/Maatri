import {
  BotMessageSquare,
  BookOpen,
  Languages,
  ShieldCheck,
  FileText,
  HeartPulse,
  PlugZap,
  GlobeLock,
  User,
} from "lucide-react";




export const navItems = [
  { label: "Features", href: "#features" },
  { label: "Working", href: "#workflow" },
  { label: "Resources", href: "#resources" },
  { label: "For Mothers", href: "#resources" },
];

import whoLogo from "../assets/resources/who.jpg";
import wikiLogo from "../assets/resources/wiki.png";
import cdcLogo from "../assets/resources/cdc.png";
import unicefLogo from "../assets/resources/unicef.jpg";
import bookLogo from "../assets/resources/book.png";   
import faqLogo from "../assets/resources/faq.png";  

export const resources = [
  {
    name: "World Health Organization (WHO)",
    link: "https://www.who.int/health-topics/maternal-health",
    image: whoLogo,
    description: "WHO’s official page on maternal and pregnancy health, including guidelines and global health data.",
  },
  {
    name: "Wikipedia - Pregnancy",
    link: "https://en.wikipedia.org/wiki/Pregnancy",
    image: wikiLogo,
    description: "Comprehensive overview of pregnancy, stages, and maternal care from Wikipedia.",
  },
  {
    name: "Centers for Disease Control (CDC)",
    link: "https://www.cdc.gov/reproductivehealth/maternalinfanthealth/",
    image: cdcLogo,
    description: "CDC’s resources on maternal and infant health, including safety guidelines and preventive care.",
  },
  {
    name: "UNICEF - Maternal Health",
    link: "https://www.unicef.org/health/maternal-health",
    image: unicefLogo,
    description: "UNICEF programs supporting maternal health, prenatal and postnatal care worldwide.",
  },
  {
    name: "What to Expect When You’re Expecting",
    link: "https://www.goodreads.com/book/show/862688.What_to_Expect_When_You_re_Expecting",
    image: bookLogo,
    description: "The world’s best-selling pregnancy book offering guidance and answers for expecting mothers.",
  },
  {
    name: "Pregnancy FAQs",
    link: "/faqs", 
    image: faqLogo,
    description: "Frequently asked questions about pregnancy and maternal care",
  },
];


export const features = [
  {
    icon: <Languages size={32} />,
    text: "Bilingual Support",
    description:
      "Ask questions in English, Hindi, or Hinglish. Maatri responds in the same language to ensure accessibility across diverse users.",
  },

  {
    icon: <BookOpen size={32} />,
    text: "Trusted Sources",
    description:
      "Every answer is backed by reliable references, including WHO guidelines, Wikipedia, and the book 'What to Expect When You’re Expecting'.",
  },
  {
    icon: <ShieldCheck size={32} />,
    text: "Safe and Reliable",
    description:
      "All responses are curated for clarity, safety, and relevance — with disclaimers encouraging consultation with healthcare professionals.",
  },
  {
    icon: <FileText size={32} />,
    text: "Wide Coverage",
    description:
      "Covers everyday pregnancy queries — from diet and exercise to symptoms and safe practices — with continuous updates to the knowledge base.",
  },
  {
    icon: <HeartPulse size={32} />,
    text: "Conversational & Empathetic",
    description:
      "Maatri remembers your context, supports follow-up questions, and provides answers in a natural, supportive tone.",
  },
  {
    icon: <User size={32} />,
    text: "Guest Mode",
    description:
      "Use the chatbot without creating an account. Your conversation history won’t be stored, ensuring full privacy and anonymity.",
  },

];


export const checklistItems = [
  {
    title: "Code merge made easy",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
  {
    title: "Review code without worry",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
  {
    title: "AI Assistance to reduce time",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
  {
    title: "Share work in minutes",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
];

export const pricingOptions = [
  {
    title: "Free",
    price: "$0",
    features: [
      "Private board sharing",
      "5 Gb Storage",
      "Web Analytics",
      "Private Mode",
    ],
  },
  {
    title: "Pro",
    price: "$10",
    features: [
      "Private board sharing",
      "10 Gb Storage",
      "Web Analytics (Advance)",
      "Private Mode",
    ],
  },
  {
    title: "Enterprise",
    price: "$200",
    features: [
      "Private board sharing",
      "Unlimited Storage",
      "High Performance Network",
      "Private Mode",
    ],
  },
];

export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Documentation" },
  { href: "#", text: "Tutorials" },
  { href: "#", text: "API Reference" },
  { href: "#", text: "Community Forums" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  { href: "#", text: "System Requirements" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Meetups" },
  { href: "#", text: "Conferences" },
  { href: "#", text: "Hackathons" },
  { href: "#", text: "Jobs" },
];
