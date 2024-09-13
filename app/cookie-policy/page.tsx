import React from 'react';

const CookiePolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">What Are Cookies?</h2>
        <p className="text-base">
          Cookies are small data files stored on your device that help websites
          remember information about your visit.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">How We Use Cookies</h2>
        <p className="text-base">We use cookies to enhance user experience by:</p>
        <ul className="list-disc ml-6 text-base">
          <li>Tracking page usage</li>
          <li>Analyzing visitor behavior through Google Analytics</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Managing Cookies</h2>
        <p className="text-base">
          You can manage cookie preferences and opt-out through your browser
          settings.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Consent</h2>
        <p className="text-base">
          By using our website, you consent to our use of cookies in accordance
          with this policy.
        </p>
      </section>
    </div>
  );
};

export default CookiePolicy;
