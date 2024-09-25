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

  // State for the current language and flag
  const [currentLanguage, setCurrentLanguage] = useState({
    name: "English",
    flag: "/assets/uk-flag.gif",
  });

  const languages = [
    { name: "English", flag: "/assets/uk-flag.gif", currency: "" },
    { name: "Spanish", flag: "/assets/sp-flag.gif", currency: "" },
    { name: "French", flag: "/assets/fr-flag.gif", currency: "" },
    { name: "German", flag: "/assets/gm-flag.gif", currency: "" },
    { name: "Yoruba", flag: "/assets/ni-flag.gif", currency: "" },
    { name: "Hausa", flag: "/assets/ni-flag.gif", currency: "" },
  ];

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  // Function to set the initial language from the Google Translate dropdown
  const setInitialLanguage = () => {
    const selectField = document.querySelector(".goog-te-combo");
    if (selectField) {
      const selectedLang = selectField.value.toLowerCase();

      // Find a matching language based on the Google Translate value
      const matchingLanguage = languages.find((lang) =>
        lang.name.toLowerCase().includes(selectedLang)
      );

      if (matchingLanguage) {
        setCurrentLanguage(matchingLanguage);
      }
    }
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const selectField = document.querySelector(".goog-te-combo");
      if (selectField) {
        setInitialLanguage(); // Set the initial language when dropdown is available
        observer.disconnect(); // Stop observing once the dropdown is found
      }
    });

    // Start observing the document body for changes (subtree includes all child elements)
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, [languages]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Redirect user based on account type
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

  // Handle user logout
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
        },
      ],
    });
  };

  // Callback to handle when a new language is selected from the modal
  const handleLanguageChange = (language) => {
    const matchingLanguage = languages.find((lang) => lang.name === language);
    if (matchingLanguage) {
      setCurrentLanguage(matchingLanguage); // Update the flag and language
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
          {/* Display the current flag */}
          <img className="switch_flag" src={currentLanguage.flag} alt="" />
        </div>
        <Link to="/support" className="b1 bbb">
          Help center
        </Link>

        {!user ? (
          <>
            <Link className="b1" to="/listproperty">
              <div className="">List your property</div>
            </Link>
            <Link className="b1" to="/signin">
              <div className="mpp0">Sign in</div>
            </Link>
            <Link className="b1" to="/createaccount">
              <div className="button  b2">Create account</div>
            </Link>
          </>
        ) : (
          <>
            <div className="b1 bbb" onClick={handleAccountRedirect}>
              My account
            </div>
            <div className="b1" onClick={handleLogout}>
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
        onLanguageChange={handleLanguageChange} // Pass the callback to modal
      />
    </nav>
  );
}
