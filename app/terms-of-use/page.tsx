import React from 'react';

const TermsOfUse: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Access and Use</h2>
        <p className="text-base">
          Permission to use the website is granted, provided you comply with our terms. Prohibited actions include unauthorized commercial use and data harvesting.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Intellectual Property</h2>
        <p className="text-base">
          Content and trademarks on this site are owned by or licensed to recycle.co.uk. Unauthorized use is prohibited.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Disclaimers</h2>
        <p className="text-base">
          We are not liable for external links or user-generated content. Information on recycling may change and should be verified independently.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Modifications to Terms</h2>
        <p className="text-base">
          We reserve the right to modify these terms at any time. Changes will be communicated through the website.
        </p>
      </section>
    </div>
  );
};

export default TermsOfUse;
