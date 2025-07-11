import React from 'react';

export default function FAQSection() {
  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq">
        <div className="faq-item">
          <h4>How do I create an account?</h4>
          <p>Click on the "Sign Up" button and fill in your details to create an account.</p>
        </div>
        <div className="faq-item">
          <h4>Is my data secure?</h4>
          <p>Yes, we use industry-standard encryption to protect your data.</p>
        </div>
      </div>
    </section>
  );
}