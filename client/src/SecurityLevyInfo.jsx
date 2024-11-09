import React from 'react';
import styled from 'styled-components';

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background-color: #fefefe;
  padding: 40px;
  border: 1px solid #888;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.span`
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  &:hover,
  &:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`;

const SecurityLevyInfo = ({ isOpen, onClose }) => {
  // Close the modal if clicked outside the ModalContent
  const handleOutsideClick = (e) => {
    if (e.target.id === 'modal-wrapper') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper id="modal-wrapper" onClick={handleOutsideClick}>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2 style={{ marginBottom: '30px' }}>Understanding the Security Levy for Property Listings and Rentals</h2>
        <section style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>1. Purpose of the Security Levy</h3>
          <p style={{ marginBottom: '15px' }}>
            <strong>Protection for Property Owners:</strong> The levy acts as a financial cushion for the property owner, covering unexpected damages, excessive cleaning, or repairs due to the tenant's or guest's stay.
          </p>
          <p style={{ marginBottom: '0' }}>
            <strong>Assurance for Platforms:</strong> On platforms where multiple hosts list properties, the security levy ensures that properties are well-maintained, adding a layer of accountability.
          </p>
        </section>
        <section style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>2. How the Security Levy Works</h3>
          <p style={{ marginBottom: '15px' }}>
            <strong>Prepaid or Held Amount:</strong> Typically, the security levy is either paid upfront or held as a reserve on the guest's credit card, with the amount varying by property type, stay duration, and location.
          </p>
          <p style={{ marginBottom: '0' }}>
            <strong>Refundable vs. Non-Refundable:</strong> If the property is left in good condition, the renter receives the levy back after an inspection period. In some cases, the levy is non-refundable and applied to property insurance or maintenance costs.
          </p>
        </section>
        <section style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>3. Security Levy vs. Security Deposit</h3>
          <p style={{ marginBottom: '0' }}>
            The <strong>security levy</strong> is generally smaller and may be non-refundable, while a <strong>security deposit</strong> is larger, refundable, and aimed specifically at damage coverage. Some platforms may charge both a non-refundable security levy and a refundable security deposit.
          </p>
        </section>
        <section style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>4. Applicability and Variability</h3>
          <p style={{ marginBottom: '15px' }}>
            <strong>Short-Term Rentals:</strong> Common for high-turnover properties where incidental damage risk is higher.
          </p>
          <p style={{ marginBottom: '15px' }}>
            <strong>Long-Term Rentals:</strong> Often combined with other fees or replaced by a security deposit.
          </p>
          <p style={{ marginBottom: '0' }}>
            <strong>Rental Platforms and Agencies:</strong> Some platforms allow owners to set levy amounts, while others standardize it across listings.
          </p>
        </section>
        <section style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>5. Transparency and Dispute Resolution</h3>
          <p style={{ marginBottom: '15px' }}>
            <strong>Clear Communication:</strong> Platforms and landlords disclose the security levy at booking to maintain transparency.
          </p>
          <p style={{ marginBottom: '0' }}>
            <strong>Dispute Mechanisms:</strong> Most platforms provide a resolution center for disputes over withheld levies.
          </p>
        </section>
        <p style={{ marginBottom: '0' }}>
          In summary, a security levy manages risk for property owners, ensuring a smoother, more secure experience for both parties in property rentals.
        </p>
      </ModalContent>
    </ModalWrapper>
  );
};

export default SecurityLevyInfo;
