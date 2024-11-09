import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import LanguageCurrencyModal from "./LanguageCurrencyModal";
import { UserContext } from "../../context/userContext";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export default function Navbar() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [language, setLanguage] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState({
    name: "English",
    flag: "/assets/uk-flag.gif",
  });

  const languages = [
    { name: "English", code: "en", flag: "https://flagcdn.com/48x36/gb.png" },
    { name: "Spanish", code: "es", flag: "https://flagcdn.com/48x36/es.png" },
    { name: "French", code: "fr", flag: "https://flagcdn.com/48x36/fr.png" },
    { name: "German", code: "de", flag: "https://flagcdn.com/48x36/de.png" },
    { name: "Yoruba", code: "yo", flag: "https://flagcdn.com/48x36/ng.png" },
    { name: "Hausa", code: "ha", flag: "https://flagcdn.com/48x36/ng.png" },
    { name: "Arabic", code: "ar", flag: "https://flagcdn.com/48x36/sa.png" },
    { name: "Chinese (Simplified)", code: "zh", flag: "https://flagcdn.com/48x36/cn.png" },
    { name: "Chinese (Traditional)", code: "zh-TW", flag: "https://flagcdn.com/48x36/tw.png" },
    { name: "Japanese", code: "ja", flag: "https://flagcdn.com/48x36/jp.png" },
    { name: "Korean", code: "ko", flag: "https://flagcdn.com/48x36/kr.png" },
    { name: "Vietnamese", code: "vi", flag: "https://flagcdn.com/48x36/vn.png" },
    { name: "Hindi", code: "hi", flag: "https://flagcdn.com/48x36/in.png" },
    { name: "Bengali", code: "bn", flag: "https://flagcdn.com/48x36/bd.png" },
    { name: "Hebrew", code: "he", flag: "https://flagcdn.com/48x36/il.png" },
    { name: "Urdu", code: "ur", flag: "https://flagcdn.com/48x36/pk.png" },
    { name: "Persian", code: "fa", flag: "https://flagcdn.com/48x36/ir.png" },
    { name: "Greek", code: "el", flag: "https://flagcdn.com/48x36/gr.png" },
    { name: "Danish", code: "da", flag: "https://flagcdn.com/48x36/dk.png" },
    { name: "Swedish", code: "sv", flag: "https://flagcdn.com/48x36/se.png" },
    { name: "Finnish", code: "fi", flag: "https://flagcdn.com/48x36/fi.png" },
    { name: "Estonian", code: "et", flag: "https://flagcdn.com/48x36/ee.png" },
    { name: "Latvian", code: "lv", flag: "https://flagcdn.com/48x36/lv.png" },
    { name: "Lithuanian", code: "lt", flag: "https://flagcdn.com/48x36/lt.png" },
    { name: "Polish", code: "pl", flag: "https://flagcdn.com/48x36/pl.png" },
    { name: "Czech", code: "cs", flag: "https://flagcdn.com/48x36/cz.png" },
    { name: "Slovak", code: "sk", flag: "https://flagcdn.com/48x36/sk.png" },
    { name: "Hungarian", code: "hu", flag: "https://flagcdn.com/48x36/hu.png" },
    { name: "Romanian", code: "ro", flag: "https://flagcdn.com/48x36/ro.png" },
    { name: "Bulgarian", code: "bg", flag: "https://flagcdn.com/48x36/bg.png" },
    { name: "Croatian", code: "hr", flag: "https://flagcdn.com/48x36/hr.png" },
    { name: "Serbian", code: "sr", flag: "https://flagcdn.com/48x36/rs.png" },
    { name: "Ukrainian", code: "uk", flag: "https://flagcdn.com/48x36/ua.png" },
    { name: "Russian", code: "ru", flag: "https://flagcdn.com/48x36/ru.png" },
    { name: "Turkish", code: "tr", flag: "https://flagcdn.com/48x36/tr.png" },
    { name: "Thai", code: "th", flag: "https://flagcdn.com/48x36/th.png" },
    { name: "Indonesian", code: "id", flag: "https://flagcdn.com/48x36/id.png" },
    { name: "Malay", code: "ms", flag: "https://flagcdn.com/48x36/my.png" },
    { name: "Portuguese", code: "pt", flag: "https://flagcdn.com/48x36/pt.png" },
    { name: "Dutch", code: "nl", flag: "https://flagcdn.com/48x36/nl.png" },
    { name: "Afrikaans", code: "af", flag: "https://flagcdn.com/48x36/za.png" },
    { name: "Albanian", code: "sq", flag: "https://flagcdn.com/48x36/al.png" },
    { name: "Amharic", code: "am", flag: "https://flagcdn.com/48x36/et.png" },
    { name: "Armenian", code: "hy", flag: "https://flagcdn.com/48x36/am.png" },
    { name: "Azerbaijani", code: "az", flag: "https://flagcdn.com/48x36/az.png" },
    { name: "Basque", code: "eu", flag: "https://flagcdn.com/48x36/es.png" },
    { name: "Belarusian", code: "be", flag: "https://flagcdn.com/48x36/by.png" },
    { name: "Bosnian", code: "bs", flag: "https://flagcdn.com/48x36/ba.png" },
    { name: "Catalan", code: "ca", flag: "https://flagcdn.com/48x36/es.png" },
    { name: "Cebuano", code: "ceb", flag: "https://flagcdn.com/48x36/ph.png" },
    { name: "Corsican", code: "co", flag: "https://flagcdn.com/48x36/fr.png" },
    { name: "Esperanto", code: "eo", flag: "https://flagcdn.com/48x36/eu.png" },
    { name: "Filipino", code: "fil", flag: "https://flagcdn.com/48x36/ph.png" },
    { name: "Galician", code: "gl", flag: "https://flagcdn.com/48x36/es.png" },
    { name: "Georgian", code: "ka", flag: "https://flagcdn.com/48x36/ge.png" },
    { name: "Gujarati", code: "gu", flag: "https://flagcdn.com/48x36/in.png" },
    { name: "Haitian Creole", code: "ht", flag: "https://flagcdn.com/48x36/ht.png" },
    { name: "Hawaiian", code: "haw", flag: "https://flagcdn.com/48x36/us.png" },
    { name: "Igbo", code: "ig", flag: "https://flagcdn.com/48x36/ng.png" },
    { name: "Icelandic", code: "is", flag: "https://flagcdn.com/48x36/is.png" },
    { name: "Javanese", code: "jv", flag: "https://flagcdn.com/48x36/id.png" },
    { name: "Kannada", code: "kn", flag: "https://flagcdn.com/48x36/in.png" },
    { name: "Khmer", code: "km", flag: "https://flagcdn.com/48x36/kh.png" },
    { name: "Kurdish", code: "ku", flag: "https://flagcdn.com/48x36/iq.png" },
    { name: "Kyrgyz", code: "ky", flag: "https://flagcdn.com/48x36/kg.png" },
    { name: "Lao", code: "lo", flag: "https://flagcdn.com/48x36/la.png" },
    { name: "Latin", code: "la", flag: "https://flagcdn.com/48x36/va.png" },
    { name: "Luxembourgish", code: "lb", flag: "https://flagcdn.com/48x36/lu.png" },
    { name: "Macedonian", code: "mk", flag: "https://flagcdn.com/48x36/mk.png" },
    { name: "Malagasy", code: "mg", flag: "https://flagcdn.com/48x36/mg.png" },
    { name: "Malayalam", code: "ml", flag: "https://flagcdn.com/48x36/in.png" },
    { name: "Maltese", code: "mt", flag: "https://flagcdn.com/48x36/mt.png" },
    { name: "Maori", code: "mi", flag: "https://flagcdn.com/48x36/nz.png" },
    { name: "Marathi", code: "mr", flag: "https://flagcdn.com/48x36/in.png" },
    { name: "Mongolian", code: "mn", flag: "https://flagcdn.com/48x36/mn.png" },
    { name: "Burmese", code: "my", flag: "https://flagcdn.com/48x36/mm.png" },
    { name: "Nepali", code: "ne", flag: "https://flagcdn.com/48x36/np.png" },
    { name: "Norwegian", code: "no", flag: "https://flagcdn.com/48x36/no.png" },
    { name: "Nyanja", code: "ny", flag: "https://flagcdn.com/48x36/mw.png" },
    { name: "Odia", code: "or", flag: "https://flagcdn.com/48x36/in.png" },
    { name: "Pashto", code: "ps", flag: "https://flagcdn.com/48x36/af.png" },
    { name: "Punjabi", code: "pa", flag: "https://flagcdn.com/48x36/in.png" },
    { name: "Sinhala", code: "si", flag: "https://flagcdn.com/48x36/lk.png" },
    { name: "Slovenian", code: "sl", flag: "https://flagcdn.com/48x36/si.png" },
    { name: "Somali", code: "so", flag: "https://flagcdn.com/48x36/so.png" },
    { name: "Sundanese", code: "su", flag: "https://flagcdn.com/48x36/id.png" },
    { name: "Tamil", code: "ta", flag: "https://flagcdn.com/48x36/in.png" },
    { name: "Tatar", code: "tt", flag: "https://flagcdn.com/48x36/ru.png" },
    { name: "Telugu", code: "te", flag: "https://flagcdn.com/48x36/in.png" },
    { name: "Tajik", code: "tg", flag: "https://flagcdn.com/48x36/tj.png" },
    { name: "Turkmen", code: "tk", flag: "https://flagcdn.com/48x36/tm.png" },
    { name: "Tagalog", code: "tl", flag: "https://flagcdn.com/48x36/ph.png" },
    { name: "Uyghur", code: "ug", flag: "https://flagcdn.com/48x36/cn.png" },
    { name: "Uzbek", code: "uz", flag: "https://flagcdn.com/48x36/uz.png" },
    { name: "Xhosa", code: "xh", flag: "https://flagcdn.com/48x36/za.png" },
    { name: "Yiddish", code: "yi", flag: "https://flagcdn.com/48x36/il.png" },
    { name: "Zulu", code: "zu", flag: "https://flagcdn.com/48x36/za.png" },
    { name: "Swahili", code: "sw", flag: "https://flagcdn.com/48x36/ke.png" },
    { name: "Kazakh", code: "kk", flag: "https://flagcdn.com/48x36/kz.png" },
    { name: "Frisian", code: "fy", flag: "https://flagcdn.com/48x36/nl.png" }
  ];
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const setInitialLanguage = () => {
    const selectField = document.querySelector(".goog-te-combo");
    if (selectField) {
      const selectedLang = selectField.value.toLowerCase();
      const matchingLanguage = languages.find((lang) =>
        lang.name.toLowerCase().includes(selectedLang)
      );
      if (matchingLanguage) {
        setCurrentLanguage(matchingLanguage);
      }
    }
  };
  const updateGoogleTranslate = (languageCode) => {
    const selectField = document.querySelector(".goog-te-combo");
    if (selectField) {
      selectField.value = languageCode;
      selectField.dispatchEvent(new Event("change"));
    }
  };

  // Function to set language based on language code
  const setLanguageFromCode = (languageCode) => {
    const matchingLanguage = languages.find(lang => lang.code === languageCode);
    if (matchingLanguage) {
      setCurrentLanguage(matchingLanguage);
      updateGoogleTranslate(languageCode);
    }
  };
  useEffect(() => {
    if (user) {
      const fetchPreferences = async () => {
        try {
          const response = await axios.get('/preferences');
          const data = response.data.preferences;
          if (data && data.language) {
            // Update both the UI and Google Translate
            setLanguageFromCode(data.language);
          }
        } catch (error) {
          console.error('Error fetching user preferences:', error);
        }
      };
      fetchPreferences();
    }
  }, [user]);

  // Update the page's language attribute based on `language` state
  useEffect(() => {
    if (language) {
      document.documentElement.lang = language;
    }
  }, [language]);

  useEffect(() => {
    setTimeout(() => {
      if (user.interface === "partner") {
        document.querySelector(".only").style.display = "none";
      }
    }, 1000);

    const observer = new MutationObserver(() => {
      const selectField = document.querySelector(".goog-te-combo");
      if (selectField) {
        setInitialLanguage();
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
    };
  }, [languages]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleAccountRedirect = () => {
    if (user?.interface) {
      if (user.interface === "admin") {
        navigate("/administrator");
      } else if (user.interface === "partner") {
        navigate("/partner");
      } else if (user.interface === "user") {
        navigate("/user");
      }
    }
  };

  const handleLogout = async () => {
    confirmAlert({
      title: "Confirm to Logout",
      message: "Are you sure you want to logout?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            await axios.post("/logout");
            setUser(null);
            navigate("/");
          },
        },
        {
          label: "No",
          onClick: () => {},
          className: "noButtonStyle",
        },
      ],
    });
  };

 
  const handleLanguageChange = (language) => {
    const matchingLanguage = languages.find((lang) => lang.name === language);
    if (matchingLanguage) {
      setCurrentLanguage(matchingLanguage);
      // Also update Google Translate when language is changed manually
      updateGoogleTranslate(matchingLanguage.code);
    }
  };

  useEffect(() => {
    const leftButton = document.querySelector(".left-button");
    const rightButton = document.querySelector(".right-button");
    const rowMain = document.querySelector(".row_main");
    const menuIcon = document.querySelector(".bx-menu");
    const closeIcon = document.querySelector(".bx-x");
    const smallNav = document.querySelector(".small_nav");
    if (leftButton && rightButton && rowMain) {
      rightButton.addEventListener("click", () => {
        rowMain.scrollBy({ left: 200, behavior: "smooth" });
      });
      leftButton.addEventListener("click", () => {
        rowMain.scrollBy({ left: -200, behavior: "smooth" });
      });
    }

    if (menuIcon && closeIcon && smallNav) {
      menuIcon.addEventListener("click", () => {
        smallNav.classList.add("open");
      });
      closeIcon.addEventListener("click", () => {
        smallNav.classList.remove("open");
      });
    }
    return () => {
      if (smallNav.className.includes("open")) {
        smallNav.classList.remove("open");
      }
      if (menuIcon && closeIcon) {
        menuIcon.removeEventListener("click", () => {});
        closeIcon.removeEventListener("click", () => {});
      }
      if (leftButton && rightButton) {
        leftButton.removeEventListener("click", () => {});
        rightButton.removeEventListener("click", () => {});
      }
    };
  });

  return (
    <nav>
      <Link to="/">
        <div className="gty">
          <img className="logo_main" src="/assets/fin.png" alt="" /> Smash
          <span className="m94">Apartment.com</span>
        </div>
      </Link>
      <div className="nav_flex">
        <div className="b1 bbb bbbb" onClick={toggleModal}>
          {}
          <img className="switch_flag" src={currentLanguage.flag} alt="" />
        </div>
        <Link to="/support" className="b1 bbb hover_data">
          Help center
        </Link>
        {!user ? (
          <>
            <Link className="b1" to="/listproperty">
              <div className="hover_data">List your property</div>
            </Link>
            <Link className="b1" to="/signin">
              <div className="mpp0 hover_data">Sign in</div>
            </Link>
            <Link className="b1" to="/createaccount">
              <div className="button  b2 button_hover">Create account</div>
            </Link>
          </>
        ) : (
          <>
            <div className="b1 bbb hover_text" onClick={handleAccountRedirect}>
              My account
            </div>
            <div className="b1 hover_text" onClick={handleLogout}>
              Logout
            </div>
          </>
        )}
        <div className="menu_hold">
          <i className="bx bx-menu" />
        </div>
      </div>
      <div className="small_nav">
        <div className="menu_hold closer">
          <i className="bx bx-x" />
        </div>
        <h2>Menu</h2>
        <br />
        <br />
        <br />
        <div className="content-cont">
          {!user ? (
            <>
              <Link to="/listproperty">
                <div className="bp">List your property</div>
              </Link>
              <Link to="/createaccount">
                <div className="bp">Create account</div>
              </Link>
              <Link to="/signin">
                <div className="bp">Sign in</div>
              </Link>
            </>
          ) : (
            <>
              <div className="bp" onClick={handleAccountRedirect}>
                My account <i className="bx bx-user"></i>
              </div>
              <div className="bp" onClick={handleLogout}>
                Logout
              </div>
            </>
          )}
          <Link to="/support" className="bp">
            Support <i className="bx bx-support"></i>
          </Link>
          <div className="bp" onClick={toggleModal}>
            Language <i className="bx bx-globe"></i>
          </div>
          <Link to="/stays" className="bp">
            Stays bookings
          </Link>
          <Link to="/rentals" className="bp">
            Car rentals
          </Link>
          <Link to="/pickups" className="bp">
            Airport pickups
          </Link>
          <Link to="/cooffice" className="bp">
            Cooffice spaces
          </Link>
        </div>
      </div>
      <LanguageCurrencyModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        languages={languages}
        onLanguageChange={handleLanguageChange}
      />
    </nav>
  );
}
