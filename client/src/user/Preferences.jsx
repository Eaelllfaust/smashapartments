import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { toast } from 'react-toastify';
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
export default function Preferences() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('');
  const [language, setLanguage] = useState('');
  const [notifications, setNotifications] = useState('');
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signin");
    } else if (user.interface !== 'user') {
      navigate("/");
    }
  }, [user, loading, navigate]);

  // Fetch user preferences on page load
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get('/preferences'); // Adjust the endpoint as needed
        const data = response.data.preferences;

        if (data) {
          setLanguage(data.language);
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };

    fetchPreferences();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    try {
     

      const response = await axios.post('/updatepreferences', {
        currency,
        language,
        notifications,
      });

      if (response.status === 200) {
        toast.success(response.data.message || 'Preferences updated successfully');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  return (
    <>
      <div className="shade_2">
        <h1>Manage account</h1>
        <img src="../assets/linear_bg.png" className="shade_bg" alt="" />
        <div className="shade_item">
          <img src="../assets/bg (2).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="../assets/bg (1).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="../assets/bg (4).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="../assets/bg (3).png" alt="" />
        </div>
      </div>
      <section className="holder">
        <div className="intro">
        <h2>Hello {user && <span>{user.first_name}</span>}</h2>
          <p>Manage your booking experience</p>
        </div>
        <section className="form_area form">
          <div className="div">
            <div className="node_item">
              <h2>
                Manage preferences<img src="../assets/preference.svg" alt="" />
              </h2>
            </div>
            {/* <label htmlFor="currency">Currency</label>
            <br />
            <select
              name="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="NGN">NGN</option>
              <option value="USD">USD</option>
            </select>
            <br /> */}
            <label htmlFor="language">Language</label>
            <br />
            <select
  name="language"
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
>
  {LANGUAGES.map((lang) => (
    <option key={lang.code} value={lang.code}>
      {lang.name}
    </option>
  ))}
</select>
            <br />
            <label htmlFor="notifications">I want to receive promotion emails</label>
            <br />
            <select
              name="notifications"
              value={notifications}
              onChange={(e) => setNotifications(e.target.value)}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <div className="button_5" onClick={handleSubmit}>Update</div>
            <br />
          </div>
        </section>
      </section>
    </>
  );
}
