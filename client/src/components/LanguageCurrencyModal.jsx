import React, { useState } from "react";
import styled from "styled-components";
import { Search } from "lucide-react";

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
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eaeaea;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  &:hover {
    color: #333;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: #0071c2;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const LanguageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  padding: 20px;
  overflow-y: auto;
  max-height: calc(80vh - 140px);
`;

const LanguageOption = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: none;
  background: white;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
  width: 100%;
  text-align: left;

  &:hover {
    background-color: #f5f5f5;
  }

  img {
    width: 24px;
    height: 18px;
    object-fit: cover;
    border-radius: 2px;
  }

  span {
    font-size: 14px;
    color: #333;
  }
`;

const LANGUAGES = [
  // Existing primary languages
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'ha', name: 'Hausa' },
  
  // Additional languages
  { code: 'af', name: 'Afrikaans' },
  { code: 'sq', name: 'Albanian' },
  { code: 'am', name: 'Amharic' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hy', name: 'Armenian' },
  { code: 'az', name: 'Azerbaijani' },
  { code: 'eu', name: 'Basque' },
  { code: 'be', name: 'Belarusian' },
  { code: 'bn', name: 'Bengali' },
  { code: 'bs', name: 'Bosnian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'ca', name: 'Catalan' },
  { code: 'ceb', name: 'Cebuano' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'co', name: 'Corsican' },
  { code: 'hr', name: 'Croatian' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'eo', name: 'Esperanto' },
  { code: 'et', name: 'Estonian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fy', name: 'Frisian' },
  { code: 'gl', name: 'Galician' },
  { code: 'ka', name: 'Georgian' },
  { code: 'el', name: 'Greek' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ht', name: 'Haitian Creole' },
  { code: 'haw', name: 'Hawaiian' },
  { code: 'he', name: 'Hebrew' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hmn', name: 'Hmong' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'is', name: 'Icelandic' },
  { code: 'ig', name: 'Igbo' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ga', name: 'Irish' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'jv', name: 'Javanese' },
  { code: 'kn', name: 'Kannada' },
  { code: 'kk', name: 'Kazakh' },
  { code: 'km', name: 'Khmer' },
  { code: 'ko', name: 'Korean' },
  { code: 'ku', name: 'Kurdish' },
  { code: 'ky', name: 'Kyrgyz' },
  { code: 'lo', name: 'Lao' },
  { code: 'la', name: 'Latin' },
  { code: 'lv', name: 'Latvian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'lb', name: 'Luxembourgish' },
  { code: 'mk', name: 'Macedonian' },
  { code: 'mg', name: 'Malagasy' },
  { code: 'ms', name: 'Malay' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mt', name: 'Maltese' },
  { code: 'mi', name: 'Maori' },
  { code: 'mr', name: 'Marathi' },
  { code: 'mn', name: 'Mongolian' },
  { code: 'my', name: 'Myanmar (Burmese)' },
  { code: 'ne', name: 'Nepali' },
  { code: 'no', name: 'Norwegian' },
  { code: 'ny', name: 'Nyanja (Chichewa)' },
  { code: 'or', name: 'Odia (Oriya)' },
  { code: 'ps', name: 'Pashto' },
  { code: 'fa', name: 'Persian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sm', name: 'Samoan' },
  { code: 'gd', name: 'Scots Gaelic' },
  { code: 'sr', name: 'Serbian' },
  { code: 'st', name: 'Sesotho' },
  { code: 'sn', name: 'Shona' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'si', name: 'Sinhala' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'so', name: 'Somali' },
  { code: 'su', name: 'Sundanese' },
  { code: 'sw', name: 'Swahili' },
  { code: 'sv', name: 'Swedish' },
  { code: 'tl', name: 'Tagalog (Filipino)' },
  { code: 'tg', name: 'Tajik' },
  { code: 'ta', name: 'Tamil' },
  { code: 'tt', name: 'Tatar' },
  { code: 'te', name: 'Telugu' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'tk', name: 'Turkmen' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'ug', name: 'Uyghur' },
  { code: 'uz', name: 'Uzbek' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'cy', name: 'Welsh' },
  { code: 'xh', name: 'Xhosa' },
  { code: 'yi', name: 'Yiddish' },
  { code: 'zu', name: 'Zulu' }
];
export default function LanguageCurrencyModal({ isOpen, onClose, onLanguageChange }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const getCountryCode = (languageCode) => {
    const countryMap = {
      'en': 'gb', 'es': 'es', 'fr': 'fr', 'de': 'de', 'yo': 'ng', 'ha': 'ng',
      'ar': 'sa', 'zh': 'cn', 'zh-TW': 'tw', 'ja': 'jp', 'ko': 'kr', 'vi': 'vn',
      'hi': 'in', 'bn': 'bd', 'he': 'il', 'ur': 'pk', 'fa': 'ir', 'el': 'gr',
      'da': 'dk', 'sv': 'se', 'fi': 'fi', 'et': 'ee', 'lv': 'lv', 'lt': 'lt',
      'pl': 'pl', 'cs': 'cz', 'sk': 'sk', 'hu': 'hu', 'ro': 'ro', 'bg': 'bg',
      'hr': 'hr', 'sr': 'rs', 'uk': 'ua', 'ru': 'ru', 'tr': 'tr', 'th': 'th',
      'id': 'id', 'ms': 'my', 'pt': 'pt', 'nl': 'nl', 'af': 'za', 'sq': 'al',
      'am': 'et', 'hy': 'am', 'az': 'az', 'eu': 'es', 'be': 'by', 'bs': 'ba',
      'ca': 'es', 'ceb': 'ph', 'co': 'fr', 'eo': 'eu', 'fil': 'ph', 'gl': 'es',
      'ka': 'ge', 'gu': 'in', 'ht': 'ht', 'haw': 'us', 'ig': 'ng', 'is': 'is',
      'jv': 'id', 'kn': 'in', 'km': 'kh', 'ku': 'iq', 'ky': 'kg', 'lo': 'la',
      'la': 'va', 'lb': 'lu', 'mk': 'mk', 'mg': 'mg', 'ml': 'in', 'mt': 'mt',
      'mi': 'nz', 'mr': 'in', 'mn': 'mn', 'my': 'mm', 'ne': 'np', 'no': 'no',
      'ny': 'mw', 'or': 'in', 'ps': 'af', 'pa': 'in', 'ro': 'ro', 'si': 'lk',
      'sl': 'si', 'so': 'so', 'su': 'id', 'ta': 'in', 'tt': 'ru', 'te': 'in',
      'tg': 'tj', 'tk': 'tm', 'tl': 'ph', 'ug': 'cn', 'uz': 'uz', 'xh': 'za',
      'yi': 'il', 'zu': 'za','sw': 'ke', 'kk': 'kz', 'fy': 'nl'
    };
  
    const baseCode = languageCode.split('-')[0].toLowerCase();
    return countryMap[baseCode] || baseCode;
  };
  

  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageChange = (code, name) => {
    const selectField = document.querySelector(".goog-te-combo");
    if (selectField) {
      selectField.value = code;
      selectField.dispatchEvent(new Event("change"));
      onLanguageChange(name);
    } else {
      alert("Google Translate widget not found.");
    }
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <HeaderContent>
            <Title>Select Language</Title>
            <CloseButton onClick={onClose}>×</CloseButton>
          </HeaderContent>
          
          <SearchContainer>
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
        </ModalHeader>
        
        <LanguageGrid>
          {filteredLanguages.map((lang) => (
            <LanguageOption
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code, lang.name)}
            >
              <img
                src={`https://flagcdn.com/24x18/${getCountryCode(lang.code)}.png`}
                alt={`${lang.name} flag`}
                onError={(e) => {
                  e.target.src = '/assets/placeholder-flag.png';
                  e.target.alt = 'Flag not available';
                }}
              />
              <span>{lang.name}</span>
            </LanguageOption>
          ))}
        </LanguageGrid>
      </ModalContainer>
    </ModalOverlay>
  );
}