import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import LanguageCurrencyModal from "./LanguageCurrencyModal";
import { UserContext } from "../../context/userContext"; // Adjust the path as necessary
import { confirmAlert } from 'react-confirm-alert'; // Import the library
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import the CSS

export default function Navbar() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { user, setUser } = useContext(UserContext); // Get the user and setUser function from context
  const navigate = useNavigate();
  const location = useLocation();

  const languages = [
    { name: "English", flag: "/assets/us-flag.gif", currency: "" },
    { name: "Spanish", flag: "/assets/sp-flag.gif", currency: "" },
    { name: "French", flag: "/assets/fr-flag.gif", currency: "" },
    { name: "German", flag: "/assets/gm-flag.gif", currency: "" },
    { name: "Yoruba", flag: "/assets/ni-flag.gif", currency: "" }, // Yoruba for NGN
    { name: "Hausa", flag: "/assets/ni-flag.gif", currency: "" }, // Hausa for NGN
  ];

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Redirect user based on account type
  const handleAccountRedirect = () => {
    if (user?.account_type) {
      if (user.account_type === "administrator") {
        navigate("/administrator");
      } else if (user.account_type === "partner") {
        navigate("/partner");
      } else if (user.account_type === "user") {
        navigate("/user");
      }
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    confirmAlert({
      title: 'Confirm to Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            await axios.post("/logout"); 
            setUser(null); 
            navigate("/"); 
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
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
          apartments
        </div>
      </Link>
      <div className="nav_flex">
        <Link to="/support" className="b1 bbb">
          Support <i class="bx bx-support"></i>
        </Link>
        <div className="b1 bbb" onClick={toggleModal}>
          Language <i className='bx bx-globe'></i>
        </div>
        {!user ? ( // Only show if user is not signed in
          <>
            <Link className="b1" to="/listproperty">
              <div className="button">List your property</div>
            </Link>
            <Link className="b1" to="/createaccount">
              <div className="button b2">Create account</div>
            </Link>
            <Link className="b1" to="/signin">
              <div>Sign in</div>
            </Link>
          </>
        ) : (
          <>
            <div className="b1 bbb" onClick={handleAccountRedirect}>
              My account <i className='bx bx-user'></i>
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
                My account  <i className='bx bx-user'></i>
              </div>
              <div className="bp" onClick={handleLogout}>
                Logout
              </div>
            </>
          )}
          <Link to="/support" className="bp">
            Support <i class="bx bx-support"></i>
          </Link>
          <div className="bp" onClick={toggleModal}>
            Language <i className='bx bx-globe'></i>
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
      />
    </nav>
  );
}
