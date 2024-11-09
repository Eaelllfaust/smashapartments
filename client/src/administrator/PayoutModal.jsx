import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Label = styled.label`
  display: block;
  margin: 10px 0 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  background-color: ${props => props.disabled ? '#79b5f9' : '#007bff'};
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  width: 100%;
  &:hover {
    background-color: ${props => props.disabled ? '#79b5f9' : '#0056b3'};
  }
`;

const PayoutModal = ({ booking, listing, onClose }) => {
  const [payoutData, setPayoutData] = useState({
    amount: "",
    date: "",
    remark: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState(crypto.randomUUID());

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayoutData({ ...payoutData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    const payload = {
      vendor: listing.owner,
      booking: booking._id,
      listing: listing._id,
      amount: payoutData.amount,
      date: payoutData.date,
      remark: payoutData.remark,
      submissionId: submissionId
    };

    try {
      await axios.post("/makepayout", payload, {
        headers: {
          "Idempotency-Key": submissionId
        }
      });
      
      toast.success("Payout confirmed successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to confirm payout. Please try again.");
      setSubmissionId(crypto.randomUUID()); // Generate new ID for retry
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose} disabled={isSubmitting}>&times;</CloseButton>
        <h3>Confirm Payout</h3>
        <form onSubmit={handleSubmit}>
          <Label>Amount</Label>
          <Input
            type="number"
            name="amount"
            value={payoutData.amount}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
          <Label>Date</Label>
          <Input
            type="date"
            name="date"
            value={payoutData.date}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
          <Label>Remark</Label>
          <Textarea
            name="remark"
            value={payoutData.remark}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Submit Payout'}
          </SubmitButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PayoutModal;