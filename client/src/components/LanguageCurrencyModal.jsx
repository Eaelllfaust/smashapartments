import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
`;

const LanguageOption = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

export default function LanguageCurrencyModal({ isOpen, onClose, languages }) {
  if (!isOpen) return null;
  const handleLanguageChange = (language) => {
    const selectField = document.querySelector(".goog-te-combo");
    if (selectField) {
        switch (language) {
            case 'Spanish':
                selectField.value = 'es';
                break;
            case 'French':
                selectField.value = 'fr';
                break;
            case 'German':
                selectField.value = 'de';
                break;
            case 'Yoruba':
                selectField.value = 'yo';
                break;
            case 'Hausa':
                selectField.value = 'ha';
                break;
            default:
                selectField.value = 'en';
                break;
        }
        selectField.dispatchEvent(new Event("change"));
    }else{
        alert("language error")
    }
    onClose(); // Close the modal
};


  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        {languages.map(({ name, flag, currency }) => (
          <LanguageOption key={name} onClick={() => handleLanguageChange(name)}>
            <img src={flag} alt={`${name} flag`} />
            <div>{name} </div>
          </LanguageOption>
        ))}
      </ModalContainer>
    </ModalOverlay>
  );
}
