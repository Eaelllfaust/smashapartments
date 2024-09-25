import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContextProvider } from "../context/userContext";

import "./style.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./Home";
import ListProperty from "./ListProperty";
import CreateAccount from "./CreateAccount";
import Signin from "./Signin";
import PartnerDetails from "./PartnerDetails";
import PartnerPassword from "./PartnerPassword";
import Stays from "./Stays";
import CreatePassword from "./CreatePassword";
import { ToastContainer } from "react-toastify";
import axios from "axios";

import HomeUser from "./user/HomeUser";
import ManageBookings from "./user/ManageBookings";
import ManageDetails from "./user/ManageDetails";
import ManagePayment from "./user/ManagePayment";
import CurrentBookings from "./user/CurrentBookings";
import PastBookings from "./user/PastBookings";
import CarRentals from "./user/CarRentals";
import PastCarRentals from "./user/PastCarRentals";
import AirportPickups from "./user/AirportPickups";
import PastAirportPickups from "./user/PastAirportPickups";
import OfficeSpaces from "./user/OfficeSpaces";
import PastOfficeSpaces from "./user/PastOfficeSpaces";

import HomaPartner from "./partner/HomaPartner";
import ManageBookingsPartner from "./partner/ManageBookings";
import ManageListings from "./partner/ManageListings";
import ManageEarnings from "./partner/ManageEarnings";
import ManageReviews from "./partner/ManageReviews";
import ProfileSettings from "./partner/ProfileSettings";
import PersonalInfo from "./partner/PersonalInfo";
import PayoutSettings from "./partner/PayoutSettings";
import Help from "./partner/Help";
import Support from "./Support";
import AddListing from "./partner/AddListing";
import AllInactiveListings from "./partner/AllInactiveListings";
import AddStays from "./partner/AddStays";
import AddCooffice from "./partner/AddCooffice";
import AddAirportPickup from "./partner/AddAirportPickup";
import AddCarRentals from "./partner/AddCarRentals";
import AllPastBookings from "./partner/AllPastBookings";

import HomeAdmin from "./administrator/HomeAdmin";
import ManageBookingsAdmin from "./administrator/ManageBookings";
import ManageListingsAdmin from "./administrator/ManageListings";
import ManageUsers from "./administrator/ManageUsers";
import Reports from "./administrator/Reports";
import Settings from "./administrator/Settings";
import GeneralSettings from "./administrator/GeneralSettings";
import Email from "./administrator/Email";
import HelpMessages from "./administrator/HelpMessages";
import ManageStaysBookings from "./administrator/ManageStaysBookings";
import DeactivatedStaysBookings from "./administrator/DeactivatedStaysBookings";
import ManageCoofficeBookings from "./administrator/ManageCoofficeBookings";
import DeactivatedCoofficeBookings from "./administrator/DeactivatedCoofficeBookings";
import ManageAirportBookings from "./administrator/ManageAirportBookings";
import DeactivatedPickupBookings from "./administrator/DeactivatedPickupBookings";
import ManageRentalBookings from "./administrator/ManageRentalBookings";
import DeactivatedRentalsBookings from "./administrator/DeactivatedRentalsBookings";
import ManageStaysListings from "./administrator/ManageStaysListings";
import DeactivatedStays from "./administrator/DeactivatedStays";
import ManageCooffice from "./administrator/ManageCooffice";
import DeactivatedCooffice from "./administrator/DeactivatedCooffice";
import ManageAirportPickups from "./administrator/ManageAirportPickups";
import DeactivatedPickups from "./administrator/DeactivatedPickups";
import ManageRentals from "./administrator/ManageRentals";
import DeactivatedRentals from "./administrator/DeactivatedRentals";
import ManageReports from "./administrator/ManageReports";
import StaysDetails from "./StaysDetails";
import ReserveStays from "./ReserveStays";
import Cooffice from "./Cooffice";
import CoofficeDetails from "./CoofficeDetails";
import ReserveCooffice from "./ReserveCooffice";
import Pickups from "./Pickups";
import PickupDetail from "./PickupDetail";
import ReservePickup from "./ReservePickup";
import Rentals from "./Rentals";
import RentalDetails from "./RentalDetails";
import ReserveRental from "./ReserveRental";
import About from "./About";
import Faq from "./Faq";
import Preferences from "./user/Preferences";
import SigninPartner from "./SigninPartner";
import Authme from "./Authme";
import Recovery from "./Recovery";
import SigninAdmin from "./SiginAdmin";

axios.defaults.baseURL = "https://smashapartments.com/";
axios.defaults.withCredentials = true;

function App() {
  return (
   <UserContextProvider>
    <div  id="google_translate_element"></div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listproperty" element={<ListProperty />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/authme" element={<Authme />} />
        <Route path="/signin/recovery" element={<Recovery />} />
        <Route path="/signinpartner/recovery" element={<Recovery />} />
        <Route path="/signinpartner" element={< SigninPartner/>} />
        <Route path="/signinadmin" element={< SigninAdmin/>} />
        <Route path="/partnerdetails" element={<PartnerDetails />} />
        <Route path="/partnerpassword" element={<PartnerPassword />} />
        <Route path="/stays" element={<Stays />} />
        <Route path="/aboutus" element={<About />} />
        <Route path="/faqs" element={<Faq />} />
        <Route path="/support" element={<Support />} />
        <Route path="/cooffice" element={<Cooffice />} />
        <Route path="/pickups" element={<Pickups />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/rentals/rentaldetails" element={<RentalDetails />} />
        <Route path="/stays/staysdetails" element={<StaysDetails />} />
        <Route path="/pickups/pickupdetails" element={<PickupDetail />} />
        <Route path="/cooffice/coofficedetails" element={<CoofficeDetails />} />
        <Route path="/cooffice/reservecooffice" element={<ReserveCooffice />} />
        <Route path="/pickups/reservepickup" element={<ReservePickup />} />
        <Route path="/stays/reservestays" element={<ReserveStays />} />
        <Route path="/rentals/reserverental" element={<ReserveRental />} />
        <Route path="/createpassword" element={<CreatePassword />} />
        
        {/* User Routes */}
        <Route path="/user/" element={<HomeUser />} />
        <Route path="/user/managebookings" element={<ManageBookings />} />
        <Route path="/user/managedetails" element={<ManageDetails />} />
        <Route path="/user/preferences" element={<Preferences />} />
        <Route path="/user/managepayment" element={<ManagePayment />} />
        <Route path="/user/managebookings/currentbookings" element={<CurrentBookings />} />
        <Route path="/user/managebookings/pastcarrentals" element={<PastCarRentals />} />
        <Route path="/user/managebookings/carrentals" element={<CarRentals />} />
        <Route path="/user/managebookings/airportpickups" element={<AirportPickups />} />
        <Route path="/user/managebookings/pastairportpickups" element={<PastAirportPickups />} />
        <Route path="/user/managebookings/officespaces" element={<OfficeSpaces />} />
        <Route path="/user/managebookings/pastofficespaces" element={<PastOfficeSpaces />} />
        <Route path="/user/managebookings/pastbookings" element={<PastBookings />} />
        
        {/* Partner Routes */}
        <Route path="/partner/" element={<HomaPartner />} />
        <Route path="/partner/managelistings" element={<ManageListings />} />
        <Route path="/partner/managebookings" element={<ManageBookingsPartner />} />
        <Route path="/partner/managebookings/allpastbookings" element={<AllPastBookings />} />
        <Route path="/partner/manageearnings" element={<ManageEarnings />} />
        <Route path="/partner/managereviews" element={<ManageReviews />} />
        <Route path="/partner/profilesettings" element={<ProfileSettings />} />
        <Route path="/partner/help" element={<Help />} />
        <Route path="/partner/managelistings/addlisting" element={<AddListing />} />
        <Route path="/partner/managelistings/addlisting/addstays" element={<AddStays />} />
        <Route path="/partner/managelistings/addlisting/addcooffice" element={<AddCooffice />} />
        <Route path="/partner/managelistings/addlisting/addcarrentals" element={<AddCarRentals />} />
        <Route path="/partner/managelistings/addlisting/addairportpickup" element={<AddAirportPickup />} />
        <Route path="/partner/managelistings/allinactivelistings" element={<AllInactiveListings />} />
        <Route path="/partner/profilesettings/payoutsettings" element={<PayoutSettings />} />
        <Route path="/partner/profilesettings/personalinfo" element={<PersonalInfo />} />
        
        {/* Administrator Routes */}
        <Route path="/administrator/" element={<HomeAdmin />} />
        <Route path="/administrator/managebookings" element={<ManageBookingsAdmin />} />
        <Route path="/administrator/managelistings" element={<ManageListingsAdmin />} />
        <Route path="/administrator/manageusers" element={<ManageUsers />} />
        <Route path="/administrator/reports" element={<Reports />} />
        <Route path="/administrator/settings" element={<Settings />} />
        <Route path="/administrator/settings/generalsettings" element={<GeneralSettings />} />
        <Route path="/administrator/settings/email" element={<Email />} />
        <Route path="/administrator/settings/HelpMessages" element={<HelpMessages />} />
        <Route path="/administrator/managebookings/managestaysbookings" element={<ManageStaysBookings/>} />
        <Route path="/administrator/managebookings/managecoofficebookings" element={<ManageCoofficeBookings/>} />
        <Route path="/administrator/managebookings/manageairportbookings" element={<ManageAirportBookings/>} />
        <Route path="/administrator/managebookings/managerentalbookings" element={<ManageRentalBookings/>} />
        <Route path="/administrator/managebookings/deactivatedstaysbookings" element={<DeactivatedStaysBookings/>} />
        <Route path="/administrator/managebookings/deactivatedpickupbookings" element={<DeactivatedPickupBookings/>} />
        <Route path="/administrator/managebookings/deactivatedcoofficebookings" element={<DeactivatedCoofficeBookings/>} />
        <Route path="/administrator/managebookings/deactivatedrentalbookings" element={<DeactivatedRentalsBookings/>} />
        <Route path="/administrator/managelistings/managestayslistings" element={<ManageStaysListings/>} />
        <Route path="/administrator/managelistings/managecooffices" element={<ManageCooffice/>} />
        <Route path="/administrator/managelistings/manageairportpickups" element={<ManageAirportPickups/>} />
        <Route path="/administrator/managelistings/managerentals" element={<ManageRentals/>} />
        <Route path="/administrator/managelistings/deactivatedstays" element={<DeactivatedStays/>} />
        <Route path="/administrator/managelistings/deactivatedpickups" element={<DeactivatedPickups/>} />
        <Route path="/administrator/managelistings/deactivatedcooffice" element={<DeactivatedCooffice/>} />
        <Route path="/administrator/managelistings/deactivatedrentals" element={<DeactivatedRentals/>} />
        <Route path="/administrator/reports/managereports" element={<ManageReports/>} />

      </Routes>
      <ToastContainer position="bottom-right" />
      <Footer />

    </UserContextProvider>
  );
}

export default App;
