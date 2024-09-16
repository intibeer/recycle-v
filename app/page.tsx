"use client";  // Add this at the top

import React, { useState } from 'react';
import CookieConsent, { getCookieConsentValue, Cookies } from "react-cookie-consent";
import Component from '../hooks/used-object-search';
import Script from "next/script";

const Home = () => {
  const [consent, setConsent] = useState<string | undefined>(getCookieConsentValue()); // Ensure it's string or undefined
  const [isVisible, setIsVisible] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false); // Controls the chat popup visibility

  const handleAccept = () => {
    setConsent("true"); // Set consent as a string value
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleReject = () => {
    setConsent("false"); // Set consent as a string value
    Cookies.remove("userConsentForCookies");
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev); // Toggle the chat popup
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
      {consent === "true" && 
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
      }

      {/* Floating button that toggles chat */}
      {isVisible && (
        <div className="floating-container">
          <div className="floating-button">
            <button className="close-button" onClick={handleClose}>
              &times;
            </button>
            <img
              src="/floating.png"
              alt="Floating Button"
              onClick={toggleChat} // Open the chat popup when clicked
            />
          </div>
        </div>
      )}

      {/* Chat popup */}
      {isChatOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            <h3>Chat with Henry</h3>
            <button className="close-chat" onClick={toggleChat}>
              &times;
            </button>
          </div>
          <iframe
            src="https://henry.recycle.co.uk"
            title="Henry's Chat"
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
          />
        </div>
      )}
    </>
  );
};

export default Home;
