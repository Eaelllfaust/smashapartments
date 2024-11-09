import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";


const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index:99;
  padding: 1rem;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: ${slideIn} 0.3s ease-out;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }

  &::before, &::after {
    content: '';
    position: absolute;
    width: 15px;
    height: 2px;
    background-color: #6b7280;
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  resize: vertical;
  font-size: 1rem;
  transition: border-color 0.2s;
  margin-bottom: 1.5rem;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const RatingSection = styled.div`
  margin-bottom: 1.5rem;
`;

const RatingLabel = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const StarContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Star = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 2rem;
  color: ${props => props.active ? "#fbbf24" : "#d1d5db"};
  transition: transform 0.2s, color 0.2s;

  &:hover {
    transform: scale(1.1);
    color: #fbbf24;
  }

  &:focus {
    outline: none;
  }
`;

const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;

  ${props => props.primary ? `
    background-color: #2563eb;
    color: white;
    border: none;

    &:hover {
      background-color: #1d4ed8;
    }

    &:disabled {
      background-color: #93c5fd;
      cursor: not-allowed;
    }
  ` : `
    background-color: white;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover {
      background-color: #f3f4f6;
    }
  `}
`;

const ReviewModal = ({ userId, bookingId, listingId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch existing review when modal opens
    const fetchReview = async () => {
      try {
        const response = await axios.get(`/reviews/${userId}/${bookingId}/${listingId}`);
        if (response.data) {
          setRating(response.data.rating);
          setReview(response.data.review);
        }
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    fetchReview();
  }, [userId, bookingId]);

  const submitReview = async () => {
    if (!rating || !review.trim()) {
      toast.error("Please provide both rating and review");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("/submit-review", {
        userId,
        bookingId,
        listingId,
        rating,
        review: review.trim(),
      });
      if (response.status === 200) {
        toast.success("Review submitted successfully");
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <ModalHeader>
          <Title>Rate and Review</Title>
          <CloseButton onClick={onClose} aria-label="Close" />
        </ModalHeader>

        <ModalBody>
          <TextArea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with us..."
            maxLength={500}
          />

          <RatingSection>
            <RatingLabel>Your Rating</RatingLabel>
            <StarContainer>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  active={star <= rating}
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} stars`}
                >
                  ★
                </Star>
              ))}
            </StarContainer>
          </RatingSection>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            primary 
            onClick={submitReview} 
            disabled={isSubmitting || !rating || !review.trim()}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ReviewModal;
