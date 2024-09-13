"use client";  // Add this at the top

import React, { useState } from 'react';
import HeaderNav from '../components/ui/HeaderNav';
import CookieConsent, { getCookieConsentValue, Cookies } from "react-cookie-consent";
import Script from 'next/script';
import Component from '../hooks/used-object-search';
import Link from 'next/link';

const Home = () => {
  const [consent, setConsent] = useState(getCookieConsentValue());
  const [isVisible, setIsVisible] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false); // Controls the chat popup visibility

  const handleAccept = () => {
    setConsent(true);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleReject = () => {
    setConsent(false);
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