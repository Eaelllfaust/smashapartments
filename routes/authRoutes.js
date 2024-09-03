const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  test,
  registerUser,
  loginUser,
  getFullProfile,
  logoutUser,
  updateUserDetails,
  updatePayment,
  getPaymentMethod,
  createPartner,
  createStayListing,
  upload,
  createOfficeListing,
  createService,
  createRental,
  getListings,
  getListingData,
  likeProperty,
  checkLiked,
  verifyPaymentAndBook,
  getActiveListings,
  getInactiveListings,
  getUserBookings,
  getCurrentBookings,
  getCooffices,
  getCoOfficeData,
  verifyPaymentAndBookCooffice,
  getPickups,
  getPickupData,
  reserveAndBookPickup,
  getRentals,
  getRentalDetails,
  verifyPaymentAndBookRental,
  getNewsletter,
  getUserPreferences,
  updateUserPreferences,
  cancelBooking,
  getCurrentRentals,
  cancelRental,
  getCurrentPickups,
  cancelService,
  getCurrentOfficeSpaces,
  cancelOfficeSpace,
  getallActiveListings,
  getUpcomingBookings,
  getTotalEarnings,
  userComplaint,
  updatePartnerDetails,
  updatePayoutSettings,
  getPayoutSettings,
  getAllInactiveListings,
  getAllListings,
  updateStatus,
  getEndedBookings,
  getAllBookings,
  updatebookingstatus,
} = require("../controllers/authController");

//middleware
router.use(
  cors({
    credentials: true,
    origin: "https://smashapartments.onrender.com",
  })
);

router.get("/", test);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getFullProfile);
router.post("/logout", logoutUser);
router.put("/updateuser", updateUserDetails);
router.put("/updatebookingstatus", updatebookingstatus);
router.put("/updatepayoutsettings", updatePayoutSettings);
router.put("/updatepartnerdetails", updatePartnerDetails);
router.put("/updatepayment", updatePayment);
router.get("/getlistings", getListings);
router.get("/getpickups", getPickups);
router.get("/getallbookings/:userId", getAllBookings);
router.get("/getcooffices", getCooffices);
router.get("/getrentals", getRentals);
router.get("/getpayoutsettings", getPayoutSettings);
router.post("/subscribe", getNewsletter);
router.post("/complaints", userComplaint);
router.get("/preferences", getUserPreferences);
router.post("/updatepreferences", updateUserPreferences);
router.get("/listings/all/:ownerId", getAllListings);
router.get("/listings/inactive/:userId", getAllInactiveListings);
router.post("/likeproperty", likeProperty);
router.post("/updatestatus", updateStatus);
router.post("/cancelbooking/:bookingId", cancelBooking);
router.post("/cancelofficespace/:bookingId", cancelOfficeSpace );
router.post("/cancelrental/:rentalId", cancelRental);
router.post("/cancelairportpickup/:bookingId", cancelService);
router.post("/verify_payment", verifyPaymentAndBook);
router.post("/verify_payment_cooffice", verifyPaymentAndBookCooffice);
router.post("/verify_payment_rental", verifyPaymentAndBookRental);
router.post("/verify_payment_service", reserveAndBookPickup);
router.get("/getlistingdata/:id", getListingData);
router.get("/getrentaldetails/:id", getRentalDetails);
router.get("/getpickupdata/:id", getPickupData);
router.get("/activelistings/:userId", getallActiveListings);
router.get("/allinactivelistings/:userId", getAllInactiveListings);
router.get("/earnings/:userId", getTotalEarnings);
router.get("/upcomingbookings/:userId", getUpcomingBookings);
router.get("/endedbookings/:userId", getEndedBookings);
router.get("/getcoofficedata/:id", getCoOfficeData);
router.get("/userbookings/:userId", getUserBookings);
router.get("/getcurrentpickups/:userId", getCurrentPickups);
router.get("/getcurrentofficespaces/:userId", getCurrentOfficeSpaces);
router.get("/getcurrentbookings/:userId", getCurrentBookings);
router.get("/getcurrentrentals/:userId", getCurrentRentals);
router.get("/checkliked/:id", checkLiked);
router.get("/getpaymentmethod", getPaymentMethod);
router.post("/createpartner", createPartner);
router.post("/stayslisting", upload.array("images", 4), createStayListing);
router.post("/coofficelisting", upload.array("images", 4), createOfficeListing);
router.post("/airportpickuplisting", upload.array("images", 4), createService);
router.post("/carrentalslisting", upload.array("images", 4), createRental);

module.exports = router;
