import React from "react";
import styled from "styled-components";

// Modal overlay for background dimming
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

// Modal container for language options
const ModalContainer = styled.div`
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
`;

// Language option styling
const LanguageOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  background-color: #f9f9f9;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e5e5e5;
  }

  img {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
`;

// Close button for closing the modal
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

export default function LanguageCurrencyModal({ isOpen, onClose, languages, onLanguageChange }) {
  if (!isOpen) return null;

  // Handle language change and update Google Translate widget
  const handleLanguageChange = (language) => {
    const selectField = document.querySelector(".goog-te-combo");
    if (selectField) {
      // Update language in Google Translate widget
      switch (language) {
        case 'Spanish':
          selectField.value = 'es'; break;
        case 'French':
          selectField.value = 'fr'; break;
        case 'German':
          selectField.value = 'de'; break;
        case 'Yoruba':
          selectField.value = 'yo'; break;
        case 'Hausa':
          selectField.value = 'ha'; break;
        default:
          selectField.value = 'en';
      }

      // Trigger language change
      selectField.dispatchEvent(new Event("change"));
      onLanguageChange(language);
    } else {
      alert("Google Translate widget not found.");
    }

    // Close modal after language selection
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>
          &times; {/* Cross icon for closing */}
        </CloseButton>
        {languages.map((language, index) => (
          <LanguageOption key={index} onClick={() => handleLanguageChange(language.name)}>
            <img src={language.flag} alt={`${language.name} flag`} /> {language.name}
          </LanguageOption>
        ))}
      </ModalContainer>
    </ModalOverlay>
  );
}
