"use client";

import React, { useState, useEffect } from 'react';
import CookieConsent, { getCookieConsentValue, Cookies } from "react-cookie-consent";
import Component from '../hooks/used-object-search';
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
      <Component />
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        declineButtonText="Reject"
        enableDeclineButton
        onAccept={handleAccept}
        onDecline={handleReject}
        cookieName="userConsentForCookies"
        style={{ background: "#ffffff", color: "black" }}
        buttonStyle={{ color: "#fff", fontSize: "13px", borderRadius: "5px", background: "#328665" }}
        declineButtonStyle={{ color: "#fff", fontSize: "13px", borderRadius: "5px", background: "black" }}
        expires={150}
      >
        This website uses cookies to enhance the user experience.
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
          <div className="relative bg-white rounded-full shadow-lg p-2">
            <button 
              className="absolute top-0 right-0 bg-gray-200 rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
              onClick={handleClose}
            >
              <X size={16} />
            </button>
            <button onClick={toggleChat}>
              <img
                src="/floating.png"
                alt="Chat with Henry"
                className="w-12 h-12 rounded-full"
              />
            </button>
          </div>
        </div>
      )}

      {isChatOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-xl overflow-hidden z-50">
          <div className="flex justify-between items-center p-4 bg-gray-100">
            <h3 className="font-semibold">Chat with Henry</h3>
            <button onClick={toggleChat}>
              <X size={20} />
            </button>
          </div>
          <iframe
            src="https://henry.recycle.co.uk"
            title="Henry's Chat"
            className="w-full h-full border-none"
            allowFullScreen
          />
        </div>
      )}
    </>
  );
};

export default Home;