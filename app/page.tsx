"use client";

import React, { useState, useEffect } from 'react';
import CookieConsent, { getCookieConsentValue, Cookies } from "react-cookie-consent";
import UsedObjectSearch from '../hooks/used-object-search';
import Script from "next/script";
import { X } from 'lucide-react';

const Home: React.FC = () => {
  const [consent, setConsent] = useState<string | undefined>(undefined);
  const [isVisible, setIsVisible] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    setConsent(getCookieConsentValue());
  }, []);

  const handleAccept = () => {
    setConsent("true");
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleReject = () => {
    setConsent("false");
    Cookies.remove("userConsentForCookies");
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <>
      <UsedObjectSearch />
      <CookieConsent
        location="bottom"
        buttonText="Accept All"
        declineButtonText="Reject All"
        enableDeclineButton
        onAccept={handleAccept}
        onDecline={handleReject}
        cookieName="userConsentForCookies"
        expires={150}
        overlay
        style={{ 
          background: "rgba(255, 255, 255, 0.95)",
          color: "#333",
          maxWidth: "420px",
          padding: "1rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          margin: "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "14px",
          lineHeight: "1.5"
        }}
        buttonStyle={{ 
          background: "#328665", 
          color: "white", 
          fontSize: "14px", 
          borderRadius: "4px",
          padding: "8px 16px",
          fontWeight: "600",
          marginTop: "12px",
          marginRight: "8px"
        }}
        declineButtonStyle={{ 
          background: "transparent", 
          color: "#333", 
          fontSize: "14px", 
          borderRadius: "4px",
          padding: "8px 16px",
          border: "1px solid #ccc",
          fontWeight: "600",
          marginTop: "12px"
        }}
        contentStyle={{
          margin: "0",
          padding: "0"
        }}
        buttonWrapperClasses="flex flex-wrap justify-center gap-2 mt-3"
      >
        <div className="mb-3">
          <h4 className="font-heading text-sm mb-2">Cookie Preferences</h4>
          <p>
            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
            By clicking &quot;Accept All&quot; you consent to our use of cookies.
          </p>
        </div>
      </CookieConsent>
      {consent === "true" && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-MK0WETNJGT"
            strategy="afterInteractive"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-MK0WETNJGT');
              `,
            }}
          /> 
        </>
      )}

      {isVisible && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="relative">
            <button 
              className="absolute top-0 right-0 bg-gray-200 rounded-full transform translate-x-1/2 -translate-y-1/2"
              onClick={handleClose}
            >
              <X size={16} />
            </button>
            <button onClick={toggleChat}>
              <img
                src="/floating.png"
                alt="Chat with Henry"
                className="w-20 h-20 rounded-full"
              />
            </button>
          </div>
        </div>
      )}

      {isChatOpen && (
        <div className="fixed bottom-0 right-0 w-full md:w-96 h-[500px] md:h-[700px] md:bottom-20 md:right-4 bg-custom-green rounded-t-lg md:rounded-lg shadow-xl text-white z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <h3 className="font-semibold font-heading text-sm md:text-base">Chat with Henry</h3>
            <button onClick={toggleChat} className="p-1 hover:bg-white/10 rounded-full transition-colors" aria-label="Close chat">
              <X size={18} />
            </button>
          </div>
          <div className="flex-grow overflow-hidden">
            <iframe
              src="https://henry.recycle.co.uk"
              title="Henry's Chat"
              className="w-full h-full border-none"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;