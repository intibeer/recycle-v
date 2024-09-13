import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Introduction</h2>
        <p className="text-base">
          Welcome to recycle.co.uk. We are committed to protecting your personal information and your right to privacy. This policy outlines how we collect, use, and safeguard your data.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Information Collection</h2>
        <p className="text-base">
          When you visit our website, we may collect certain information automatically from your device. This includes:
        </p>
        <ul className="list-disc ml-6 text-base">
          <li><strong>IP addresses</strong></li>
          <li><strong>Device type</strong></li>
          <li><strong>Geographical location</strong> (only for analytics purposes)</li>
        </ul>
        <p className="text-base mt-2">
          We use <strong>Google Analytics</strong> to analyze web traffic and improve our service. Our chatbot may collect data you choose to share during the interaction to enhance its functionality.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Use of Information</h2>
        <p className="text-base">
          We use the information we collect to:
        </p>
        <ul className="list-disc ml-6 text-base">
          <li>Enhance website functionality</li>
          <li>Personalize content</li>
          <li>Perform analytics</li>
        </ul>
        <p className="text-base mt-2">
          We process personal information on the following bases:
        </p>
        <ul className="list-disc ml-6 text-base">
          <li><strong>Consent</strong> you provide</li>
          <li><strong>Legitimate interests</strong></li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Data Sharing and Disclosure</h2>
        <p className="text-base">
          We may share your data with third parties under the following circumstances:
        </p>
        <ul className="list-disc ml-6 text-base">
          <li>Legal obligations</li>
          <li>Service provision needs (without selling or renting data)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Data Protection</h2>
        <p className="text-base">
          We take your security seriously and protect your data through:
        </p>
        <ul className="list-disc ml-6 text-base">
          <li><strong>SSL encryption</strong></li>
          <li>Robust cybersecurity measures</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
        <p className="text-base">
          For any privacy-specific concerns, please contact us at <a href="mailto:inti@recycle.co.uk" className="text-blue-500 underline">inti@recycle.co.uk</a>.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
