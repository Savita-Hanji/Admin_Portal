import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaBus, FaGlobeAmericas } from "react-icons/fa";
import { MdLanguage } from "react-icons/md";

const LanguageScreen = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const handleLanguageSelect = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("selectedLanguage", lang); // Store language preference
    navigate("/login");
  };

  // Available languages with display names
  const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
    // Add more languages as needed
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-gray-50 px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 w-full max-w-md text-center transition-all duration-300 hover:shadow-xl">
        {/* Logo with Bus Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full mb-3">
            <FaBus className="text-4xl text-blue-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Track My Bus
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Powered by Solapur Municipal Corporation
          </p>
        </div>

        {/* Language Selection Section */}
        <div className="mb-2 flex items-center justify-center text-gray-700">
          <MdLanguage className="mr-2 text-xl" />
          <h2 className="text-xl font-semibold">
            Choose Language <span className="text-gray-500">/ भाषा निवडा</span>
          </h2>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          Select your preferred language
        </p>

        {/* Language Buttons */}
        <div className="flex flex-col gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-between
                ${
                  i18n.language === lang.code
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
            >
              <span>{lang.name}</span>
              <span className="text-sm opacity-80">{lang.nativeName}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center text-gray-500 text-sm">
            <FaGlobeAmericas className="mr-2" />
            <span>Solapur Public Transport System</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageScreen;
