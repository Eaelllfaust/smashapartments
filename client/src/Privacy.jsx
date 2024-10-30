import React from 'react'

export default function Privacy() {
  return (
    <>
      <div className="shade_2 df">
        <h1>Privacy Policy</h1>
        <p>How we handle and protect your data</p>
        <img src="assets/linear_bg.png" className="shade_bg" alt="" />
        <div className="shade_item">
          <img src="assets/bg (2).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="assets/bg (1).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="assets/bg (4).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="assets/bg (3).png" alt="" />
        </div>
      </div>
      <section className="entry">
        <div>
          <h1>What information do we collect?</h1>
          <br />
          <p>
            We collect personal information when you make a reservation, sign up for our newsletter, or interact with our website/app. This includes your name, contact information, payment details, and preferences. We may also collect device information, browsing history, and location data to improve your experience.
          </p>
          <br />
          <h1>How do we use your information?</h1>
          <br />
          <p>
            We use your information to manage reservations, communicate about your stay, and provide personalized experiences. This includes sending updates, offers, and local information. We also use anonymized data for analysis and service improvement.
          </p>
          <br />
          <h1>How do we protect your data?</h1>
          <br />
          <p>
            We use industry-standard encryption and secure servers to protect your data. We've implemented physical, technical, and administrative measures to prevent unauthorized access, use, or disclosure.
          </p>
          <br />
          <h1>Who do we share your information with?</h1>
          <br />
          <p>
            We share information with service providers who help operate our business (payment processors, marketing agencies, IT support). These providers are contractually obligated to keep your data secure. We may also share data when legally required or during business transactions.
          </p>
          <br />
          <h1>How long do we keep your information?</h1>
          <br />
          <p>
            We retain your information as long as necessary to fulfill our services or as required by law. When no longer needed, we securely delete or anonymize your data according to our retention policies.
          </p>
          <br />
          <h1>What are your privacy rights?</h1>
          <br />
          <p>
            You have the right to access, update, or delete your personal information. You can opt-out of marketing communications and request data deletion, subject to certain exceptions.
          </p>
          <br />
          <h1>How can you contact us about privacy?</h1>
          <br />
          <p>
            For any privacy-related questions or concerns, please contact us at{' '}
            <a className="href" href="mailto:privacy@smashApartments.com">
              privacy@smashApartments.com
            </a>
          </p>
          <br />
          <h1>Do you use cookies or tracking?</h1>
          <br />
          <p>
            We use cookies and similar technologies to improve your experience and analyze website usage. You can control cookie settings through your browser preferences.
          </p>
          <br />
          <h1>How do we handle international data transfers?</h1>
          <br />
          <p>
            If we transfer your data internationally, we ensure appropriate safeguards are in place to protect your information according to applicable data protection laws.
          </p>
          <br />
          <h1>How will we notify you of policy changes?</h1>
          <br />
          <p>
            We'll notify you of any significant changes to our privacy policy via email and/or prominent notice on our website before changes take effect.
          </p>
        </div>
      </section>
    </>
  )
}