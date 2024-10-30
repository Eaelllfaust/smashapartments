// ImageRow.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr) 0.8fr;
  gap: 8px;
  height: 200px;
  overflow: hidden;
`;

const GridImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;

const ViewAllOverlay = styled.div`
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

export const ImageRow = ({ images, onImageClick }) => {
  return (
    <ImageGrid>
      {images.slice(0, 3).map((image, index) => (
        <GridImage
          key={index}
          src={`https://smashapartments.com/${image.url}`}
          alt="Property Image"
          onClick={() => onImageClick(index)}
        />
      ))}
      {images.length > 3 && (
        <ViewAllOverlay onClick={() => onImageClick(0)}>
          <span>+{images.length - 3} more</span>
        </ViewAllOverlay>
      )}
    </ImageGrid>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
  color: white;
  z-index: 2;
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  z-index: 2;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  ${props => props.position === 'left' ? 'left: 20px;' : 'right: 20px;'}
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.variant === 'primary' ? `
    background: #007AFF;
    color: white;
    &:hover {
      background: #0056b3;
    }
  ` : `
    background: rgba(255, 255, 255, 0.1);
    color: white;
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `}
`;

export const Modal = ({ 
  images, 
  isOpen, 
  onClose, 
  title, 
  onReserveClick, 
  currentImageIndex, 
  setCurrentImageIndex 
}) => {
  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <Header>
          <h2>{title}</h2>
          <div>
            <StyledButton variant="primary" onClick={onReserveClick}>
              Reserve
            </StyledButton>
            <StyledButton onClick={onClose}>
              Close
            </StyledButton>
          </div>
        </Header>
        <CarouselContainer>
          <CarouselImage 
            src={`https://smashapartments.com/${images[currentImageIndex].url}`} 
            alt="Property"
          />
          <NavigationButton position="left" onClick={handlePrev}>
            ←
          </NavigationButton>
          <NavigationButton position="right" onClick={handleNext}>
            →
          </NavigationButton>
        </CarouselContainer>
      </ModalContent>
    </ModalOverlay>
  );
};