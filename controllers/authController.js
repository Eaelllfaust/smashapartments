const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const PaymentMethod = require("../models/payment_method");
const StayListing = require("../models/stays_listing");
const LikedItem = require("../models/likeditem");
const Service = require("../models/service");
const OfficeSpace = require("../models/cooffice");
const Receipts = require("../models/receipts");
const VendorPayouts = require("../models/vendorpayouts");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const MediaTag = require("../models/mediatag");
const CarRental = require("../models/rentals");
const Booking = require("../models/booking");
const Rental = require("../models/rentalbookings");
const ServiceBooking = require("../models/servicebooking");
const CoofficeBooking = require("../models/coofficebooking");
const UserPreference = require("../models/userpreference");
const Newsletter = require("../models/newsletter");
const axios = require("axios");
const PartnerEarning = require("../models/partnerearning");
const UserComplaint = require("../models/usercomplaint");
const Adminactions = require("../models/adminactions");
const Payout = require("../models/payout");
const Reviews = require("../models/reviews");
const crypto = require("crypto");
const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

const TOKEN = process.env.TOKEN_NEW;
const transport = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);
const sender = {
  address: "mailtrap@smashapartments.com",
  name: "Smash Apartments",
};

const test = (req, res) => {
  res.json("test is working");
};

const updateStatus = async (req, res) => {
  const { type, id, status } = req.body;

  try {
    let updateResult;

    // Validate the listing type
    if (!["stay", "rental", "office", "service"].includes(type)) {
      return res.status(400).json({ message: "Invalid listing type" });
    }

    // Update the listing status based on the type
    switch (type) {
      case "stay":
        updateResult = await StayListing.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );
        break;
      case "rental":
        updateResult = await CarRental.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );
        break;
      case "office":
        updateResult = await OfficeSpace.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );
        break;
      case "service":
        updateResult = await Service.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );
        break;
      default:
        return res.status(400).json({ message: "Invalid listing type" });
    }

    // If no listing was found to update
    if (!updateResult) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Successfully updated the listing status
    res.json({ message: "Status updated successfully", listing: updateResult });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const payoutDetails = async (req, res) => {
  try {
    const payout = await Payout.findOne({ userId: req.params.userId });
    if (!payout) {
      return res.status(404).json({ message: "Payout details not found" });
    }
    res.json(payout);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching payout details", error: error.message });
  }
};
const updatePayoutSettings = async (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
      if (err) {
        return res.json({ error: "Invalid token" });
      }
      try {
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
          return res.json({ error: "User not found" });
        }

        let payoutSettings = await Payout.findOne({ userId: user._id });

        if (!payoutSettings) {
          payoutSettings = new Payout({
            userId: user._id,
            accountName: req.body.accountName || "",
            accountNumber: req.body.accountNumber || "",
            bankName: req.body.bankName || "",
          });
        } else {
          payoutSettings.accountName =
            req.body.accountName || payoutSettings.accountName;
          payoutSettings.accountNumber =
            req.body.accountNumber || payoutSettings.accountNumber;
          payoutSettings.bankName =
            req.body.bankName || payoutSettings.bankName;
        }

        await payoutSettings.save();

        res.json({
          message: "Payout settings updated successfully",
          payoutSettings,
        });
      } catch (error) {
        console.error("Update payout settings error:", error);
        res
          .status(400)
          .json({ error: error.message || "Internal server error" });
      }
    });
  } else {
    res.status(401).json({ error: "No token provided" });
  }
};

const getPayoutSettings = async (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err);
        return res.status(401).json({ error: "Invalid token" });
      }
      try {
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
          console.error("User not found:", decoded.email);
          return res.status(404).json({ error: "User not found" });
        }

        const payoutSettings = await Payout.findOne({ userId: user._id });
        if (!payoutSettings) {
          console.error("Payout settings not found for user ID:", user._id);
          return res.status(404).json({ error: "Payout settings not found" });
        }

        res.json({ payoutSettings });
      } catch (error) {
        console.error("Error fetching payout settings:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  } else {
    res.status(401).json({ error: "No token provided" });
  }
};

const userComplaint = async (req, res) => {
  try {
    const { userId, complaint } = req.body;

    // If no userId is provided, default to 'general'
    const userComplaint = new UserComplaint({
      userId: userId || "general",
      complaint,
    });

    await userComplaint.save();
    res.status(200).json({ message: "Complaint submitted successfully" });
  } catch (error) {
    console.error("Error submitting complaint:", error);
    res.status(500).json({ error: "Failed to submit complaint" });
  }
};
const getTotalEarnings = async (req, res) => {
  try {
    const { userId } = req.params;

    const vendorPayouts = await VendorPayouts.find({ vendor: userId });

    const totalEarnings = vendorPayouts.reduce(
      (sum, payout) => sum + payout.amount,
      0
    );

    res.status(200).json({
      totalEarnings,
      payoutCount: vendorPayouts.length,
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    res.status(500).json({
      error: "Failed to fetch earnings",
      message: error.message,
    });
  }
};

const cancelOfficeSpace = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updatedBooking = await CoofficeBooking.findByIdAndUpdate(
      bookingId,
      { status: "cancelled" },
      { new: true }
    );
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};

const getCurrentOfficeSpaces = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch office space bookings with certain statuses
    const bookings = await CoofficeBooking.find({
      userId,
      status: { $in: ["confirmed", "reserved", "cancelled", "ended"] },
    }).lean();

    if (!bookings.length) {
      return res
        .status(404)
        .json({ error: "No office spaces found for this user" });
    }

    // Fetch associated office details, media tags, and receipts for each booking
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        try {
          // Fetch office details
          const officeDetails = await OfficeSpace.findById(
            booking.officeId
          ).lean();

          // Fetch media tags
          const mediaTags = await MediaTag.find({
            listing_id: booking.officeId,
          }).lean();

          // Fetch receipts associated with the booking
          const receipts = await Receipts.find({
            booking_id: booking._id,
          }).lean();

          // Return booking with office details, media tags, and receipts
          return {
            ...booking,
            officeDetails,
            mediaTags,
            receipts, // Include receipts in the response
          };
        } catch (err) {
          console.error(
            `Error fetching details for booking ${booking._id}:`,
            err
          );
          return booking; // Return booking without details if there's an error
        }
      })
    );

    // Respond with bookings that include detailed info
    res.status(200).json(bookingsWithDetails);
  } catch (error) {
    console.error("Error fetching user office spaces:", error);
    res.status(500).json({ error: "Failed to fetch user office spaces" });
  }
};

const cancelService = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await ServiceBooking.findByIdAndUpdate(
      bookingId,
      { status: "cancelled" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res
      .status(200)
      .json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const cancelRental = async (req, res) => {
  const { rentalId } = req.params;

  try {
    const rental = await Rental.findByIdAndUpdate(
      rentalId,
      { status: "cancelled" },
      { new: true }
    );

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    res.status(200).json({ message: "Rental cancelled successfully", rental });
  } catch (error) {
    console.error("Error cancelling rental:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const sendRefundPendingEmail = async (email) => {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Refund Appeal Pending Approval</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
    </head>
    <body style="font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <header style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 2px solid #221f60;">
            <h2 style="color: #221f60; font-family: 'Montserrat', Arial, sans-serif; font-weight: 700;">Refund Appeal Pending Approval</h2>
        </header>
        
        <main style="padding: 20px;">
            <p>Hello,</p>
            <p>We have received your refund appeal for your recent booking cancellation. Your request is currently under review and pending approval from our administration team.</p>
            <p>If approved, 50% of the amount you paid will be refunded to you. We appreciate your patience as we complete the review process and aim to resolve this matter promptly.</p>
            <p>Best regards,</p>
            <p>The smashapartments.com Team</p>
        </main>
        
        <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px;">
            <p>This email is from smashapartments.com. If you have questions, please contact us at: <a href="mailto:support@smashapartments.com" style="color: #ff8c00;">support@smashapartments.com</a></p>
            <p>&copy; 2024 smashapartments.com. All rights reserved.</p>
            <p><a href="#" style="color: #ff8c00;">Privacy Policy</a> | <a href="#" style="color: #ff8c00;">Terms of Service</a></p>
        </footer>
    </body>
    </html>
  `;

  const mailOptions = {
    from: sender,
    to: [email],
    subject: "Refund Appeal Pending Approval",
    text: "We have received your refund appeal. Your request is currently pending approval, and if approved, you will receive a 50% refund.",
    html: htmlTemplate,
    category: "Refund Appeal",
    
  };

  try {
    const result = await transport.sendMail(mailOptions);
    console.log("Refund pending email sent successfully:", result);
  } catch (error) {
    console.error("Error sending refund pending email:", error);
    throw error;
  }
};

const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const user = await User.findById(booking.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await sendRefundPendingEmail(user.email);

    await Adminactions.create({
      userId: booking.userId,
      dataId: booking._id,
      message: "A new refund appeal has been made",
      type: "refund_appeal",
      status: "pending",
    });

    res
      .status(200)
      .json({ message: "Booking cancelled and refund pending email sent" });
  } catch (error) {
    console.error("Error in cancelBooking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserPreferences = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email }).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userPreferences = await UserPreference.findOne({
      userId: user._id,
    }).lean();

    if (!userPreferences) {
      return res.status(200).json({ message: "No preferences found" });
    }

    res.status(200).json({ preferences: userPreferences });
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    res.status(500).json({ error: "Failed to fetch user preferences" });
  }
};

// Create or update user preferences
const updateUserPreferences = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { currency, language, notifications } = req.body;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email }).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let userPreferences = await UserPreference.findOne({ userId: user._id });

    if (!userPreferences) {
      // Create new preferences
      userPreferences = new UserPreference({
        userId: user._id,
        currency,
        language,
        notifications: notifications === "yes",
      });
    } else {
      // Update existing preferences
      userPreferences.currency = currency;
      userPreferences.language = language;
      userPreferences.notifications = notifications;
    }

    await userPreferences.save();
    res.status(200).json({ message: "Preferences updated successfully" });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    res.status(500).json({ error: "Failed to update user preferences" });
  }
};
const getNewsletter = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email already exists in the database
    const existingSubscriber = await Newsletter.findOne({ email });

    if (existingSubscriber) {
      return res.status(400).json({ message: "You're already a member" });
    }

    // If the email doesn't exist, add the new subscriber
    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();

    return res.status(200).json({ message: "Welcome to the family" });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred" });
  }
};
const getRentalDetails = async (req, res) => {
  try {
    const { id } = req.params; // Get rental ID from request parameters

    // Fetch rental data by ID
    const rental = await CarRental.findById(id).lean();
    if (!rental) {
      return res.status(404).json({ error: "Car rental listing not found" });
    }

    // Fetch associated images
    const images = await MediaTag.find({ listing_id: id }).lean();

    // Fetch reviews associated with the rental
    const reviewData = await Reviews.aggregate([
      { $match: { listingId: rental._id } },
      {
        $group: {
          _id: "$listingId",
          averageRating: { $avg: { $toDouble: "$rating" } },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const averageRating =
      reviewData.length > 0
        ? Number(reviewData[0].averageRating.toFixed(1))
        : null;
    const reviewCount = reviewData.length > 0 ? reviewData[0].reviewCount : 0;

    // Combine rental data with images and reviews
    const rentalWithDetails = {
      ...rental,
      images: images.map((image) => ({
        ...image,
        url: `${image.media_location}`, // Construct image URL
      })),
      reviewCount,
      averageRating,
    };

    res.status(200).json(rentalWithDetails);
  } catch (error) {
    console.error("Error fetching rental data:", error);
    res.status(500).json({ error: "Failed to fetch rental data" });
  }
};

const getRentals = async (req, res) => {
  try {
    const {
      location,
      carType,
      cancellationPolicy,
      refundPolicy,
      extraDriver,
      minPrice,
      maxPrice,
      availableFrom,
      availableTo,
      ratings,
      limit,
      offset,
    } = req.query;

    const filters = {};

    // Add case-insensitive filter for location
    if (location) {
      filters.$or = [
        { contactName: { $regex: new RegExp(location, "i") } },
        { contactPhone: { $regex: new RegExp(location, "i") } },
        { contactEmail: { $regex: new RegExp(location, "i") } },
      ];
    }

    // Add filter for car type
    if (carType) {
      filters.carType = { $regex: new RegExp(carType, "i") };
    }

    // Add filters for policies
    if (cancellationPolicy)
      filters.cancellationPolicy = {
        $regex: new RegExp(cancellationPolicy, "i"),
      };
    if (refundPolicy)
      filters.refundPolicy = { $regex: new RegExp(refundPolicy, "i") };
    if (extraDriver) filters.extraDriver = extraDriver === "true";

    // Add filters for price
    if (minPrice) filters.rentalPrice = { $gte: Number(minPrice) };
    if (maxPrice) {
      filters.rentalPrice = filters.rentalPrice || {};
      filters.rentalPrice.$lte = Number(maxPrice);
    }

    // Add filters for availability
    if (availableFrom)
      filters.availableFrom = { $lte: new Date(availableFrom) };
    if (availableTo) filters.availableTo = { $gte: new Date(availableTo) };

    // Add filter for ratings
    if (ratings) filters.ratings = { $gte: Number(ratings) };

    let rentals = await CarRental.find(filters)
      .skip(Number(offset) || 0)
      .limit(Number(limit) || 10)
      .lean();

    if (rentals.length === 0) {
      // If no rentals are found, fetch without filters
      rentals = await CarRental.find()
        .skip(Number(offset) || 0)
        .limit(Number(limit) || 10)
        .lean();
    }

    // Aggregate to get the average rating and review count for each rental
    const rentalsWithDetails = await Promise.all(
      rentals.map(async (rental) => {
        const images = await MediaTag.find({ listing_id: rental._id }).lean();

        // Aggregate ratings and review count
        const reviewData = await Reviews.aggregate([
          { $match: { listingId: rental._id } },
          {
            $group: {
              _id: "$listingId",
              averageRating: { $avg: { $toDouble: "$rating" } },
              reviewCount: { $sum: 1 },
            },
          },
        ]);

        const averageRating =
          reviewData.length > 0
            ? Number(reviewData[0].averageRating.toFixed(1))
            : null;
        const reviewCount =
          reviewData.length > 0 ? reviewData[0].reviewCount : 0;

        return {
          ...rental,
          images,
          averageRating,
          reviewCount,
        };
      })
    );

    res.status(200).json(rentalsWithDetails);
  } catch (error) {
    console.error("Error fetching rentals:", error);
    res.status(500).json({ error: "Failed to fetch rentals" });
  }
};

const reserveAndBookPickup = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { reference, serviceId, arrivalDate, arrivalTime, totalPrice } =
      req.body;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify the JWT and get the user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email }).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify the payment with Paystack
    const secretKey = process.env.FLW_SEC;
    const paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    if (
      paystackResponse.data.status !== true ||
      paystackResponse.data.data.status !== "success"
    ) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // Check if the service exists and is available
    const service = await Service.findById(serviceId).lean();
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    const bookingDate = new Date(arrivalDate);
    const availableFrom = new Date(service.availableFrom);
    const availableTo = new Date(service.availableTo);

    if (bookingDate < availableFrom || bookingDate > availableTo) {
      return res
        .status(400)
        .json({ error: "Service is not available on the selected date" });
    }

    // Create new service booking
    const newServiceBooking = new ServiceBooking({
      userId: user._id,
      serviceId,
      arrivalDate,
      arrivalTime,
      totalPrice,
      paymentReference: reference,
      status: "pending",
    });

    await newServiceBooking.save();
    await sendNewBookingEmailPickup(decoded.email, {
      serviceId,
      arrivalDate: arrivalDate,
      arrivalTime: arrivalTime,
      totalAmount: totalPrice,
    });
    await sendNewBookingNotificationToOwnerPickup(serviceId);
    res.status(201).json({
      message:
        "Payment verified and pickup service booking created successfully",
    });
  } catch (error) {
    console.error(
      "Error verifying payment and creating pickup service booking:",
      error
    );
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.status(500).json({
      error: "Failed to verify payment and create pickup service booking",
    });
  }
};

const getPickupData = async (req, res) => {
  try {
    const { id } = req.params; // Get service ID from request parameters

    // Fetch service data by ID
    const service = await Service.findById(id).lean();

    if (!service) {
      return res.status(404).json({ error: "Pickup service not found" });
    }

    // Fetch associated images
    const images = await MediaTag.find({ listing_id: id }).lean();

    // Aggregate to get the average rating and review count for the service
    const reviewData = await Reviews.aggregate([
      { $match: { listingId: service._id } },
      {
        $group: {
          _id: "$listing_id",
          averageRating: { $avg: { $toDouble: "$rating" } },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    // Check if reviewData has values and round the averageRating to 1 decimal place
    const averageRating =
      reviewData.length > 0
        ? Number(reviewData[0].averageRating.toFixed(1))
        : null;
    const reviewCount = reviewData.length > 0 ? reviewData[0].reviewCount : 0;

    // Combine service data with images, rating, and review count
    const serviceWithDetails = {
      ...service,
      images: images.map((image) => ({
        ...image,
        url: `${image.media_location}`, // Construct image URL
      })),
      averageRating,
      reviewCount,
    };

    res.status(200).json(serviceWithDetails);
  } catch (error) {
    console.error("Error fetching pickup service data:", error);
    res.status(500).json({ error: "Failed to fetch pickup service data" });
  }
};

const getPickups = async (req, res) => {
  try {
    const {
      airport,
      carMakeModel,
      extraLuggage,
      waitingTime,
      minPrice,
      maxPrice,
      availableFrom,
      availableTo,
      ratings, // Added for rating filter
      limit,
      offset,
    } = req.query;

    const filters = {};

    // Add case-insensitive filter for airport
    if (airport) {
      filters.$or = [
        { serviceName: { $regex: new RegExp(airport, "i") } },
        { description: { $regex: new RegExp(airport, "i") } },
      ];
    }

    // Add filter for car make and model
    if (carMakeModel) {
      filters.carMakeModel = { $regex: new RegExp(carMakeModel, "i") };
    }

    // Add filters for extra luggage and waiting time
    if (extraLuggage) filters.extraLuggage = extraLuggage === "true";
    if (waitingTime)
      filters.waitingTime = { $regex: new RegExp(waitingTime, "i") };

    // Add filters for price (using pickupPrice)
    if (minPrice) filters.pickupPrice = { $gte: Number(minPrice) };
    if (maxPrice) {
      filters.pickupPrice = filters.pickupPrice || {};
      filters.pickupPrice.$lte = Number(maxPrice);
    }

    // Add filters for availability
    if (availableFrom)
      filters.availableFrom = { $lte: new Date(availableFrom) };
    if (availableTo) filters.availableTo = { $gte: new Date(availableTo) };

    let pickups = await Service.find(filters)
      .skip(Number(offset) || 0)
      .limit(Number(limit) || 10)
      .lean();

    if (pickups.length === 0) {
      pickups = await Service.find()
        .skip(Number(offset) || 0)
        .limit(Number(limit) || 10)
        .lean();
    }

    // Calculate average rating and count of reviews for each pickup and add images
    const pickupsWithDetails = await Promise.all(
      pickups.map(async (pickup) => {
        const images = await MediaTag.find({ listing_id: pickup._id }).lean();

        // Aggregate to get the average rating and review count for the pickup
        const reviewData = await Reviews.aggregate([
          { $match: { listingId: pickup._id } },
          {
            $group: {
              _id: "$listing_id",
              averageRating: { $avg: { $toDouble: "$rating" } },
              reviewCount: { $sum: 1 },
            },
          },
        ]);

        // Check if reviewData has values and round the averageRating to 1 decimal place
        const averageRating =
          reviewData.length > 0
            ? Number(reviewData[0].averageRating.toFixed(1))
            : null;
        const reviewCount =
          reviewData.length > 0 ? reviewData[0].reviewCount : 0;

        return { ...pickup, images, averageRating, reviewCount };
      })
    );

    // Filter pickups to include only those with the specified average rating
    const filteredPickups = pickupsWithDetails.filter(
      (pickup) => !ratings || pickup.averageRating === Number(ratings)
    );

    res.status(200).json(filteredPickups);
  } catch (error) {
    console.error("Error fetching pickups:", error);
    res.status(500).json({ error: "Failed to fetch pickups" });
  }
};

const getCurrentPickups = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch pickups with status 'confirmed', 'reserved', 'cancelled', or 'ended'
    const pickups = await ServiceBooking.find({
      userId,
      status: { $in: ["confirmed", "reserved", "cancelled", "ended"] },
    }).lean();

    if (!pickups.length) {
      return res
        .status(404)
        .json({ error: "No airport pickups found for this user" });
    }

    // Fetch associated service details, media, and receipts for each pickup
    const pickupsWithDetails = await Promise.all(
      pickups.map(async (pickup) => {
        try {
          // Fetch service details
          const serviceDetails = await Service.findById(
            pickup.serviceId
          ).lean();

          // Fetch associated media
          const media = await MediaTag.find({
            listing_id: pickup.serviceId,
          }).lean();

          // Fetch receipts based on pickup's booking ID
          const receipts = await Receipts.find({
            booking_id: pickup._id,
          }).lean();

          // Return pickup with service details, media, and receipts
          return {
            ...pickup,
            serviceDetails,
            media, // Include media in the response
            receipts, // Include receipts in the response
            driverPhoneNumber:
              serviceDetails?.driverPhoneNumber || "Not provided",
            driverEmail: serviceDetails?.driverEmail || "Not provided",
            carMakeModel: serviceDetails?.carMakeModel || "Unknown",
            carColor: serviceDetails?.carColor || "Unknown",
          };
        } catch (err) {
          console.error(
            `Error fetching details for pickup ${pickup._id}:`,
            err
          );
          return pickup; // Return pickup with default values if there's an error
        }
      })
    );

    res.status(200).json(pickupsWithDetails);
  } catch (error) {
    console.error("Error fetching user pickups:", error);
    res.status(500).json({ error: "Failed to fetch user pickups" });
  }
};

const getCoOfficeData = async (req, res) => {
  try {
    const { id } = req.params; // Get cooffice ID from request parameters

    // Fetch cooffice data by ID
    const cooffice = await OfficeSpace.findById(id).lean();
    if (!cooffice) {
      return res.status(404).json({ error: "CoOffice listing not found" });
    }

    // Fetch associated images
    const images = await MediaTag.find({ listing_id: id }).lean();

    // Fetch review data: calculate average rating and review count for the cooffice
    const reviewData = await Reviews.aggregate([
      { $match: { listingId: cooffice._id } }, // Match reviews for the specific cooffice
      {
        $group: {
          _id: "$listing_id",
          averageRating: { $avg: { $toDouble: "$rating" } }, // Calculate average rating
          reviewCount: { $sum: 1 }, // Count the number of reviews
        },
      },
    ]);

    const averageRating =
      reviewData.length > 0
        ? Number(reviewData[0].averageRating.toFixed(1))
        : null;
    const reviewCount = reviewData.length > 0 ? reviewData[0].reviewCount : 0;

    // Combine cooffice data with images, review stats, and construct image URLs
    const coofficeWithDetails = {
      ...cooffice,
      images: images.map((image) => ({
        ...image,
        url: `${image.media_location}`, // Construct image URL
      })),
      averageRating,
      reviewCount,
    };

    res.status(200).json(coofficeWithDetails);
  } catch (error) {
    console.error("Error fetching cooffice data:", error);
    res.status(500).json({ error: "Failed to fetch cooffice data" });
  }
};

const PendingActions = async (req, res) => {
  try {
    const actions = await Adminactions.find({ status: "pending" }).lean();
    res.status(200).json(actions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pending actions" });
  }
};
const UpdateActionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const action = await Adminactions.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!action) return res.status(404).json({ error: "Action not found" });

    res
      .status(200)
      .json({ message: "Action status updated successfully", action });
  } catch (error) {
    res.status(500).json({ error: "Failed to update action status" });
  }
};

const getCurrentRentals = async (req, res) => {
  try {
    const { userId } = req.params;

    const rentals = await Rental.find({
      userId,
      status: { $in: ["confirmed", "reserved", "cancelled", "ended"] },
    }).lean();

    if (!rentals.length) {
      return res.status(404).json({ error: "No rentals found for this user" });
    }

    const rentalsWithDetails = await Promise.all(
      rentals.map(async (rental) => {
        try {
          const carRental = await CarRental.findById(rental.rentalId).lean();

          const media = await MediaTag.find({
            listing_id: rental.rentalId,
          }).lean();

          const receipts = await Receipts.find({
            booking_id: rental._id,
          }).lean();

          return {
            ...rental,
            carRentalDetails: carRental,
            media,
            driverPhoneNumber: carRental?.driverPhoneNumber || "Not provided",
            driverEmail: carRental?.driverEmail || "Not provided",
            carNameModel: carRental?.carNameModel || "Unknown",
            receipts,
          };
        } catch (err) {
          console.error(
            `Error fetching details for rental ${rental._id}:`,
            err
          );
          return rental;
        }
      })
    );

    res.status(200).json(rentalsWithDetails);
  } catch (error) {
    console.error("Error fetching user rentals:", error);
    res.status(500).json({ error: "Failed to fetch user rentals" });
  }
};

const getCurrentBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({
      userId,
      status: {
        $in: ["confirmed", "reserved", "cancelled", "ended", "pending"],
      },
    }).lean();

    if (!bookings.length) {
      return res.status(404).json({ error: "No bookings found for this user" });
    }

    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const media = await MediaTag.find({
            listing_id: booking.listingId,
          }).lean();

          const stayListing = await StayListing.findById(
            booking.listingId
          ).lean();

          const receipts = await Receipts.find({
            booking_id: booking._id,
          }).lean();

          return {
            ...booking,
            media,
            receipts,
            property_name: stayListing?.property_name || "Unknown",
            city: stayListing?.city || "Unknown",
            state_name: stayListing?.state_name || "Unknown",
            contact_phone: stayListing?.contact_phone || "Not provided",
            contact_email: stayListing?.contact_email || "Not provided",
          };
        } catch (err) {
          console.error(
            `Error fetching details for booking ${booking._id}:`,
            err
          );
          return booking;
        }
      })
    );

    res.status(200).json(bookingsWithDetails.reverse()); // Reverse to ascending order
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Failed to fetch user bookings" });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const [
      totalBookingCount,
      totalCoofficeCount,
      totalRentalCount,
      totalServiceCount,
      reservedBookingCount,
      reservedCoofficeCount,
      reservedRentalCount,
      reservedServiceCount,
    ] = await Promise.all([
      Booking.countDocuments({ userId }),
      CoofficeBooking.countDocuments({ userId }),
      Rental.countDocuments({ userId }),
      ServiceBooking.countDocuments({ userId }),
      Booking.countDocuments({ userId, status: "reserved" }),
      CoofficeBooking.countDocuments({ userId, status: "reserved" }),
      Rental.countDocuments({ userId, status: "reserved" }),
      ServiceBooking.countDocuments({ userId, status: "reserved" }),
    ]);

    // Calculate total and reserved bookings by summing the counts
    const totalBookings =
      totalBookingCount +
      totalCoofficeCount +
      totalRentalCount +
      totalServiceCount;
    const reservedBookings =
      reservedBookingCount +
      reservedCoofficeCount +
      reservedRentalCount +
      reservedServiceCount;

    res.status(200).json({ totalBookings, reservedBookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Failed to fetch user bookings" });
  }
};

const getUsers = async (req, res) => {
  try {
    // Find users where account_type is not "admin" and exclude password from the results
    const users = await User.find(
      { account_type: { $ne: "admin" } },
      "-password"
    );
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

async function aggregateRevenueFromSchema(
  schema,
  schemaName,
  dateField = "createdAt",
  priceField = "totalPrice"
) {
  try {
    return await schema.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: `$${dateField}` },
          },
          totalRevenue: { $sum: `$${priceField}` }, // Sum up the revenue using the correct price field
        },
      },
      { $sort: { _id: 1 } },
    ]);
  } catch (error) {
    console.error(`Error aggregating revenue from ${schemaName}:`, error);
    throw error; // Rethrow so we can catch it later
  }
}

const revenue = async (req, res) => {
  try {
    const revenueData = await Promise.all([
      aggregateRevenueFromSchema(
        ServiceBooking,
        "ServiceBooking",
        "createdAt",
        "totalPrice"
      ),
      aggregateRevenueFromSchema(Rental, "Rental", "createdAt", "rentalPrice"),
      aggregateRevenueFromSchema(
        CoofficeBooking,
        "CoofficeBooking",
        "createdAt",
        "totalPrice"
      ),
      aggregateRevenueFromSchema(Booking, "Booking", "createdAt", "totalPrice"), // Use createdAt for bookings
    ]);

    // Combine all the revenue data
    const combinedData = revenueData.flat();

    const dates = combinedData.map((item) => item._id);
    const amounts = combinedData.map((item) => item.totalRevenue);

    res.json({
      dates,
      amounts,
      total: amounts.reduce((acc, curr) => acc + curr, 0),
    });
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res
      .status(500)
      .json({ message: "Error fetching revenue data", error: error.message });
  }
};

async function aggregateStatusFromSchema(schema) {
  return await schema.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
}

const bookingStatus = async (req, res) => {
  try {
    const statusData = await Promise.all([
      aggregateStatusFromSchema(ServiceBooking),
      aggregateStatusFromSchema(Rental),
      aggregateStatusFromSchema(CoofficeBooking),
      aggregateStatusFromSchema(Booking),
    ]);

    // Combine all the status data
    const combinedData = statusData.flat();

    const statuses = ["pending", "confirmed", "reserved", "cancelled", "ended"];
    const counts = statuses.map((status) => {
      const found = combinedData.find((item) => item._id === status);
      return found ? found.count : 0;
    });

    res.json({ counts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching booking status data", error });
  }
};

async function aggregateBookingsFromSchema(schema) {
  return await schema.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }, // Use createdAt
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
}
const bookingsOverTime = async (req, res) => {
  try {
    const bookingsData = await Promise.all([
      aggregateBookingsFromSchema(ServiceBooking),
      aggregateBookingsFromSchema(Rental),
      aggregateBookingsFromSchema(CoofficeBooking),
      aggregateBookingsFromSchema(Booking),
    ]);

    const combinedData = bookingsData.flat();

    const dates = combinedData.map((item) => item._id);
    const counts = combinedData.map((item) => item.count);

    res.json({ dates, counts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching bookings over time data", error });
  }
};

async function aggregateRevenueByListingFromSchema(schema) {
  return await schema.aggregate([
    {
      $match: {
        listingId: { $exists: true, $ne: null }, // Ensure listingId is present
      },
    },
    {
      $group: {
        _id: "$listingId", // Group by listingId
        totalRevenue: { $sum: "$totalPrice" }, // Sum the totalPrice
      },
    },
  ]);
}

const revenueByListing = async (req, res) => {
  try {
    const revenueByListingData = await Promise.all([
      aggregateRevenueByListingFromSchema(ServiceBooking),
      aggregateRevenueByListingFromSchema(Rental),
      aggregateRevenueByListingFromSchema(CoofficeBooking),
      aggregateRevenueByListingFromSchema(Booking),
    ]);

    // Combine all the revenue by listing data
    const combinedData = revenueByListingData.flat();

    // If listingId is an ObjectId, convert it to a string for labels
    const labels = combinedData.map((item) =>
      item._id ? item._id.toString() : "Unknown Listing"
    ); // Fallback for missing listingId
    const revenues = combinedData.map((item) => item.totalRevenue);

    res.json({ labels, revenues });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Error fetching revenue by listing type data", error });
  }
};
const userAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: "active" });
    const inactiveUsers = await User.countDocuments({ status: "inactive" });

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user analytics", error });
  }
};
const bookingData = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const aggregateBookings = async (Model) => {
      return await Model.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);
    };

    const countStatuses = async (Model) => {
      return await Model.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);
    };

    const [staysBookings, coofficeBookings, rentalBookings, serviceBookings] =
      await Promise.all([
        aggregateBookings(Booking),
        aggregateBookings(CoofficeBooking),
        aggregateBookings(Rental),
        aggregateBookings(ServiceBooking),
      ]);

    const [staysStatuses, coofficeStatuses, rentalStatuses, serviceStatuses] =
      await Promise.all([
        countStatuses(Booking),
        countStatuses(CoofficeBooking),
        countStatuses(Rental),
        countStatuses(ServiceBooking),
      ]);

    const monthlyData = Array(12).fill(0);
    [staysBookings, coofficeBookings, rentalBookings, serviceBookings].forEach(
      (bookings) => {
        bookings.forEach((booking) => {
          monthlyData[booking._id - 1] += booking.count;
        });
      }
    );

    const statusCounts = {
      pending: 0,
      confirmed: 0,
      reserved: 0,
      cancelled: 0,
      ended: 0,
    };

    [staysStatuses, coofficeStatuses, rentalStatuses, serviceStatuses].forEach(
      (statuses) => {
        statuses.forEach((status) => {
          if (statusCounts.hasOwnProperty(status._id)) {
            statusCounts[status._id] += status.count;
          }
        });
      }
    );

    res.json({
      months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      counts: monthlyData,
      statusCounts,
    });
  } catch (error) {
    console.error("Error fetching booking data:", error);
    res.status(500).json({ message: "Error fetching booking data" });
  }
};
const usersJoiningOverTime = async (req, res) => {
  try {
    const usersOverTime = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date_joined" },
            month: { $month: "$date_joined" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }, // Sorting by year and month
      },
    ]);

    res.status(200).json(usersOverTime);
  } catch (error) {
    console.error("Error fetching users joining over time:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateUserStatus = async (req, res) => {
  const { userId, status } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User status updated successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user status", error: error.message });
  }
};

const MakePayout = async (req, res) => {
  try {
    const { vendor, booking, listing, amount, date, remark } = req.body;
    const payout = new VendorPayouts({
      vendor,
      booking,
      listing,
      amount,
      date,
      remark,
    });

    // Save the payout record
    const savedPayout = await payout.save();

    try {
      // Send email notification
      await sendPayoutNotificationToVendor(savedPayout._id);

      res.status(201).json({
        message: "Payout added successfully and notification sent",
        payoutId: savedPayout._id,
      });
    } catch (emailError) {
      // If email fails, log the error but don't fail the whole operation
      console.error("Failed to send payout notification:", emailError);
      res.status(201).json({
        message: "Payout added successfully but notification failed",
        payoutId: savedPayout._id,
      });
    }
  } catch (error) {
    console.error("Error in MakePayout:", error);
    res.status(500).json({
      error: "Failed to add payout",
      details: error.message,
    });
  }
};
const sendPayoutNotificationToVendor = async (payoutId) => {
  // Fetch payout with populated booking details
  const payout = await VendorPayouts.findById(payoutId).lean();

  // Fetch vendor details
  const vendor = await User.findById(payout.vendor).lean();
  const vendorEmail = vendor.email;
  const vendorName = vendor.first_name;

  // Format the date nicely
  const formattedDate = new Date(payout.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payout Notification from smashapartments.com</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <header style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 2px solid #221f60;">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100px" height="100px" viewBox="0 0 1000 1000" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd">
            <!-- SVG path data here -->
        </svg>
    </header>
    
    <main style="padding: 20px;">
        <h1 style="color: #221f60; font-family: 'Montserrat', Arial, sans-serif; font-weight: 700;">Payout Notification</h1>
        <p>Hello, ${vendorName}</p>
        <p>We are pleased to inform you that a payout has been processed for your account on smashapartments.com.</p>
        
        <div style="background-color: #f8f8f8; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h2 style="color: #221f60; margin-top: 0;">Payout Details:</h2>
            <p><strong>Amount:</strong> NGN ${payout.amount.toFixed(2)}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Booking Reference:</strong> ${payout.booking}</p>
            <p><strong>Remark:</strong> ${payout.remark}</p>
        </div>

        <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #ff8c00; background-color: #fff4e6;">
            <p style="margin: 0;"><strong>Important:</strong> Please keep your booking reference number <strong>${
              payout.booking
            }</strong> for your records. You may need this for any future correspondence.</p>
        </div>

        <p>The funds have been processed according to your payment preferences. Please allow 2-3 business days for the amount to reflect in your account.</p>
        <p>If you have any questions about this payout, please don't hesitate to contact our support team and reference your booking number.</p>
        
     
        
        <p>Best regards,<br>The smashapartments.com Team</p>
    </main>
    
    <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px;">
        <p>This email is from smashapartments.com regarding your recent payout.</p>
        <p>For support, please contact us at: <a href="mailto:support@smashapartments.com" style="color: #ff8c00;">support@smashapartments.com</a></p>
        <p>&copy; 2024 smashapartments.com. All rights reserved.</p>
        <p><a href="#" style="color: #ff8c00;">Privacy Policy</a> | <a href="#" style="color: #ff8c00;">Terms of Service</a></p>
    </footer>
</body>
</html>
  `;

  const mailOptions = {
    from: sender,
    to: [vendorEmail],
    subject: `Payout Processed - NGN ${payout.amount.toFixed(
      2
    )} - smashapartments.com`,
    text: `A payout of NGN ${payout.amount.toFixed(
      2
    )} has been processed for your account (Booking Reference: ${
      payout.booking
    }). Remark: ${payout.remark}. 
    
Please keep your booking reference number for your records.

Please allow 2-3 business days for the amount to reflect in your account.
`,
    html: htmlTemplate,
    category: "Payout Notification",
    
  };

  try {
    const result = await transport.sendMail(mailOptions);
    console.log("Payout notification email sent successfully:", result);
  } catch (error) {
    console.error("Error sending payout notification email:", error);
    throw error;
  }
};
const getAllListingsGeneral = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const stayListings = await StayListing.find().lean();

    const services = await Service.find().lean();

    const officeSpaces = await OfficeSpace.find().lean();

    const carRentals = await CarRental.find().lean();

    const stayListingsWithImages = await Promise.all(
      stayListings.map(async (listing) => {
        const images = await MediaTag.find({
          listing_id: listing._id,
        }).lean();
        return { ...listing, images, type: "stay" };
      })
    );

    const servicesWithImages = await Promise.all(
      services.map(async (service) => {
        const images = await MediaTag.find({
          listing_id: service._id,
        }).lean();
        return { ...service, images, type: "service" };
      })
    );

    const officeSpacesWithImages = await Promise.all(
      officeSpaces.map(async (office) => {
        const images = await MediaTag.find({
          listing_id: office._id,
        }).lean();
        return { ...office, images, type: "office" };
      })
    );

    const carRentalsWithImages = await Promise.all(
      carRentals.map(async (carRental) => {
        const images = await MediaTag.find({
          listing_id: carRental._id,
        }).lean();
        return { ...carRental, images, type: "rental" };
      })
    );

    // Combine all listings with their respective images and types
    const allListingsWithImagesAndTypes = [
      ...stayListingsWithImages,
      ...servicesWithImages,
      ...officeSpacesWithImages,
      ...carRentalsWithImages,
    ];

    // Respond with all listings and their associated images and types
    res.status(200).json(allListingsWithImagesAndTypes);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};
const getAllListings = async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Fetch all listings for the given owner irrespective of their status
    const stayListings = await StayListing.find({
      owner: ownerId,
    }).lean();

    const services = await Service.find({
      owner: ownerId,
    }).lean();

    const officeSpaces = await OfficeSpace.find({
      owner: ownerId,
    }).lean();

    const carRentals = await CarRental.find({
      owner: ownerId,
    }).lean();

    // Fetch media tags for each type of listing and add the listing type
    const stayListingsWithImages = await Promise.all(
      stayListings.map(async (listing) => {
        const images = await MediaTag.find({
          listing_id: listing._id,
        }).lean();
        return { ...listing, images, type: "stay" };
      })
    );

    const servicesWithImages = await Promise.all(
      services.map(async (service) => {
        const images = await MediaTag.find({
          listing_id: service._id,
        }).lean();
        return { ...service, images, type: "service" };
      })
    );

    const officeSpacesWithImages = await Promise.all(
      officeSpaces.map(async (office) => {
        const images = await MediaTag.find({
          listing_id: office._id,
        }).lean();
        return { ...office, images, type: "office" };
      })
    );

    const carRentalsWithImages = await Promise.all(
      carRentals.map(async (carRental) => {
        const images = await MediaTag.find({
          listing_id: carRental._id,
        }).lean();
        return { ...carRental, images, type: "rental" };
      })
    );

    // Combine all listings with their respective images and types
    const allListingsWithImagesAndTypes = [
      ...stayListingsWithImages,
      ...servicesWithImages,
      ...officeSpacesWithImages,
      ...carRentalsWithImages,
    ];

    // Respond with all listings and their associated images and types
    res.status(200).json(allListingsWithImagesAndTypes);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};

// const updatebookingstatus = async (req, res) => {
//   const { bookingId, status, type } = req.body;

//   try {
//     let booking;

//     switch (type) {
//       case "service":
//         booking = await ServiceBooking.findById(bookingId);
//         break;
//       case "rental":
//         booking = await Rental.findById(bookingId);
//         break;
//       case "cooffice":
//         booking = await CoofficeBooking.findById(bookingId);
//         break;
//       case "stay":
//         booking = await Booking.findById(bookingId);
//         break;
//       default:
//         return res.status(400).json({ error: "Invalid booking type" });
//     }

//     if (!booking) {
//       return res.status(404).json({ error: "Booking not found" });
//     }

//     // Update the status
//     booking.status = status;

//     // Save the updated booking
//     await booking.save();

//     res
//       .status(200)
//       .json({ message: "Booking status updated successfully", booking });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while updating the booking status" });
//   }
// };
const updatebookingstatus = async (req, res) => {
  const { bookingId, status, type } = req.body;

  try {
    let booking;
    let userId;

    switch (type) {
      case "service":
        booking = await ServiceBooking.findById(bookingId);
        userId = booking.userId;
        break;
      case "rental":
        booking = await Rental.findById(bookingId);
        userId = booking.userId;
        break;
      case "office":
        booking = await CoofficeBooking.findById(bookingId);
        userId = booking.userId;
        break;
      case "stay":
        booking = await Booking.findById(bookingId);
        userId = booking.userId;
        break;
      default:
        return res.status(400).json({ error: "Invalid booking type" });
    }

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status = status;

    await booking.save();

    if (status === "checkedin") {
      await sendCheckinNotification(bookingId, type);
    }

    if (status === "confirmed") {
      const user = await User.findById(userId);
      const email = user.email;

      let propertyName;
      let securityLevyData;
      if (type === "stay") {
        const stayListing = await StayListing.findById(
          booking.listingId
        ).lean();
        propertyName = stayListing.property_name;
        securityLevyData = stayListing.security_levy;
      } else if (type === "office") {
        const officeSpace = await OfficeSpace.findById(booking.officeId).lean();
        propertyName = officeSpace.office_space_name;
        securityLevyData = officeSpace.security_levy;
      } else if (type === "rental") {
        const rentalItem = await Rental.findById(booking.rentalId).lean();
        propertyName = "Ride rental";
      } else if (type === "service") {
        const serviceItem = await Service.findById(booking.serviceId).lean();
        propertyName = "Pickup";
      }

      await sendConfirmatoryEmail(
        email,
        booking,
        propertyName,
        securityLevyData,
        type
      );
    }

    res
      .status(200)
      .json({ message: "Booking status updated successfully", booking });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the booking status" });
  }
};

const sendCheckinNotification = async (bookingId, type) => {
  const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Check-in Notification</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #221f60;">New Check-in Alert</h2>
          <p>A customer has checked in for their booking.</p>
          <p><strong>Booking Details:</strong></p>
          <ul>
              <li>Booking ID: ${bookingId}</li>
              <li>Booking Type: ${type}</li>
          </ul>
          <p>Please review the booking details in the admin dashboard.</p>
      </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: sender,
    to: "support@smashapartment.com",
    subject: "New Check-in Alert",
    html: htmlTemplate,
    category: "Check-in Notification",
    
  };

  try {
    const result = await transport.sendMail(mailOptions);
    console.log("Check-in notification sent successfully:", result);
  } catch (error) {
    console.error("Error sending check-in notification:", error);
    throw error;
  }
};

const sendConfirmatoryEmail = async (
  email,
  booking,
  propertyName,
  securityLevyData,
  type
) => {
  let subject, titleText;
  if (type === "rental") {
    subject = "Your new rental has been confirmed";
    titleText = "Your new rental has been confirmed";
  } else if (type === "service") {
    subject = "Your new pickup has been confirmed";
    titleText = "Your new pickup has been confirmed";
  } else {
    subject = "Your smashapartments.com Booking Confirmation";
    titleText = "Your Booking at {propertyName} is Confirmed";
  }

  const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
  </head>
  <body style="font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <header style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 2px solid #221f60;">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100px" height="100px" viewBox="0 0 1000 1000" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd">
              <!-- SVG path data here -->
          </svg>
      </header>
      
      <main style="padding: 20px;">
          <h1 style="color: #221f60; font-family: 'Montserrat', Arial, sans-serif; font-weight: 700;">${titleText.replace(
            "{propertyName}",
            propertyName
          )}</h1>
          <p>Hello,</p>
          <p>We're pleased to inform you that your booking request for ${propertyName} has been confirmed.</p>

          ${
            (type === "stay" || type === "office") &&
            securityLevyData &&
            securityLevyData !== ""
              ? `
          <div style="background-color: #f8f8f8; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h2 style="color: #ff8c00; margin-top: 0;">Security Levy</h2>
              <p>Please note that there is a security levy deposit associated with your booking. The terms and conditions for this deposit are as follows:</p>
              <ul>
                <li>The security levy is a refundable deposit that will be returned to you at the end of your rental period, provided there are no damages or outstanding fees.</li>
                <li>The amount of the security levy is ${securityLevyData}.</li>
                <li>The security levy must be paid prior to the start of your rental period.</li>
                <li>If there are any damages or outstanding fees, the security levy (or a portion of it) will be used to cover these costs.</li>
                <li>The security levy will be refunded to you within 14 days of the end of your rental period, provided there are no issues.</li>
              </ul>
          </div>
          `
              : ""
          }

          <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
          <p>For any complaints, <a href="mailto:complaints@smashapartments.com" style="color: #ff8c00;">complaints@smashapartments.com</a></p>
          <p>The smashapartments.com Team</p>
      </main>
      
      <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px;">
          <p>This email is from smashapartments.com regarding your confirmed booking.</p>
          <p>For support, please contact us at: <a href="mailto:support@smashapartments.com" style="color: #ff8c00;">support@smashapartments.com</a></p>
          <p>&copy; 2024 smashapartments.com. All rights reserved.</p>
          <p><a href="#" style="color: #ff8c00;">Privacy Policy</a> | <a href="#" style="color: #ff8c00;">Terms of Service</a></p>
      </footer>
  </body>
  </html>
  `;

  const mailOptions = {
    from: sender,
    to: [email],
    subject: subject,
    html: htmlTemplate,
    category: "Booking Confirmation",
    
  };

  try {
    const result = await transport.sendMail(mailOptions);
    console.log("Confirmatory email sent successfully:", result);
  } catch (error) {
    console.error("Error sending confirmatory email:", error);
    throw error;
  }
};

const getAllBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all listings owned by the user
    const stayListings = await StayListing.find({ owner: userId }).lean();
    const officeSpaces = await OfficeSpace.find({ owner: userId }).lean();
    const carRentals = await CarRental.find({ owner: userId }).lean();
    const services = await Service.find({ owner: userId }).lean();

    // Create maps of listings by their IDs
    const stayListingMap = stayListings.reduce((acc, listing) => {
      acc[listing._id] = listing;
      return acc;
    }, {});
    const officeSpaceMap = officeSpaces.reduce((acc, listing) => {
      acc[listing._id] = listing;
      return acc;
    }, {});
    const carRentalMap = carRentals.reduce((acc, listing) => {
      acc[listing._id] = listing;
      return acc;
    }, {});
    const serviceMap = services.reduce((acc, listing) => {
      acc[listing._id] = listing;
      return acc;
    }, {});

    // Extract listing IDs for each type
    const stayListingIds = stayListings.map((listing) => listing._id);
    const officeSpaceIds = officeSpaces.map((listing) => listing._id);
    const carRentalIds = carRentals.map((listing) => listing._id);
    const serviceIds = services.map((listing) => listing._id);

    // Fetch bookings associated with these listings
    const stayBookings = await Booking.find({
      listingId: { $in: stayListingIds },
    }).lean();
    const officeBookings = await CoofficeBooking.find({
      officeId: { $in: officeSpaceIds },
    }).lean();
    const rentalBookings = await Rental.find({
      rentalId: { $in: carRentalIds },
    }).lean();
    const serviceBookings = await ServiceBooking.find({
      serviceId: { $in: serviceIds },
    }).lean();

    // Fetch user details for each booking
    const userIds = [
      ...stayBookings.map((booking) => booking.userId),
      ...officeBookings.map((booking) => booking.userId),
      ...rentalBookings.map((booking) => booking.userId),
      ...serviceBookings.map((booking) => booking.userId),
    ];

    // Remove duplicates from userIds array
    const uniqueUserIds = [...new Set(userIds)];

    // Fetch user details
    const users = await User.find({ _id: { $in: uniqueUserIds } }).lean();

    // Create a map of user information by userId
    const userMap = users.reduce((acc, user) => {
      acc[user._id] = user;
      return acc;
    }, {});

    // Combine all bookings into one array with their type, user info, and listing info
    const allBookings = [
      ...stayBookings.map((booking) => ({
        ...booking,
        type: "stay",
        user: userMap[booking.userId],
        listing: stayListingMap[booking.listingId],
      })),
      ...officeBookings.map((booking) => ({
        ...booking,
        type: "office",
        user: userMap[booking.userId],
        listing: officeSpaceMap[booking.officeId],
      })),
      ...rentalBookings.map((booking) => ({
        ...booking,
        type: "rental",
        user: userMap[booking.userId],
        listing: carRentalMap[booking.rentalId],
      })),
      ...serviceBookings.map((booking) => ({
        ...booking,
        type: "service",
        user: userMap[booking.userId],
        listing: serviceMap[booking.serviceId],
      })),
    ];

    // Respond with all bookings, each with detailed listing information
    res.status(200).json(allBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// const getAllBookingsGeneral = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Fetch all listings with their owners
//     const stayListings = await StayListing.find().lean();
//     const officeSpaces = await OfficeSpace.find().lean();
//     const carRentals = await CarRental.find().lean();
//     const services = await Service.find().lean();

//     // Create maps of listings by their IDs
//     const stayListingMap = stayListings.reduce((acc, listing) => {
//       acc[listing._id] = listing;
//       return acc;
//     }, {});
//     const officeSpaceMap = officeSpaces.reduce((acc, listing) => {
//       acc[listing._id] = listing;
//       return acc;
//     }, {});
//     const carRentalMap = carRentals.reduce((acc, listing) => {
//       acc[listing._id] = listing;
//       return acc;
//     }, {});
//     const serviceMap = services.reduce((acc, listing) => {
//       acc[listing._id] = listing;
//       return acc;
//     }, {});

//     // Collect all owner IDs
//     const ownerIds = [
//       ...stayListings.map((listing) => listing.owner),
//       ...officeSpaces.map((listing) => listing.owner),
//       ...carRentals.map((listing) => listing.owner),
//       ...services.map((listing) => listing.owner),
//     ];
//     const uniqueOwnerIds = [...new Set(ownerIds)];

//     // Fetch all bookings
//     const stayBookings = await Booking.find({
//       listingId: { $in: stayListings.map((listing) => listing._id) },
//     }).lean();
//     const officeBookings = await CoofficeBooking.find({
//       officeId: { $in: officeSpaces.map((listing) => listing._id) },
//     }).lean();
//     const rentalBookings = await Rental.find({
//       rentalId: { $in: carRentals.map((listing) => listing._id) },
//     }).lean();
//     const serviceBookings = await ServiceBooking.find({
//       serviceId: { $in: services.map((listing) => listing._id) },
//     }).lean();

//     // Collect all user IDs from bookings
//     const userIds = [
//       ...stayBookings.map((booking) => booking.userId),
//       ...officeBookings.map((booking) => booking.userId),
//       ...rentalBookings.map((booking) => booking.userId),
//       ...serviceBookings.map((booking) => booking.userId),
//     ];
//     const uniqueUserIds = [...new Set(userIds)];

//     // Fetch users and payouts in parallel
//     const [users, ownerPayouts] = await Promise.all([
//       User.find({ _id: { $in: uniqueUserIds } }).lean(),
//       Payout.find({ userId: { $in: uniqueOwnerIds } }).lean(),
//     ]);

//     // Create maps for users and payouts
//     const userMap = users.reduce((acc, user) => {
//       acc[user._id] = user;
//       return acc;
//     }, {});

//     const payoutMap = ownerPayouts.reduce((acc, payout) => {
//       acc[payout.userId] = payout;
//       return acc;
//     }, {});

//     // Combine all bookings with user and owner payout information
//     const allBookings = [
//       ...stayBookings.map((booking) => ({
//         ...booking,
//         type: "stay",
//         user: userMap[booking.userId],
//         listing: stayListingMap[booking.listingId],
//         ownerPayout: payoutMap[stayListingMap[booking.listingId].owner] || null,
//       })),
//       ...officeBookings.map((booking) => ({
//         ...booking,
//         type: "office",
//         user: userMap[booking.userId],
//         listing: officeSpaceMap[booking.officeId],
//         ownerPayout: payoutMap[officeSpaceMap[booking.officeId].owner] || null,
//       })),
//       ...rentalBookings.map((booking) => ({
//         ...booking,
//         type: "rental",
//         user: userMap[booking.userId],
//         listing: carRentalMap[booking.rentalId],
//         ownerPayout: payoutMap[carRentalMap[booking.rentalId].owner] || null,
//       })),
//       ...serviceBookings.map((booking) => ({
//         ...booking,
//         type: "service",
//         user: userMap[booking.userId],
//         listing: serviceMap[booking.serviceId],
//         ownerPayout: payoutMap[serviceMap[booking.serviceId].owner] || null,
//       })),
//     ];

//     res.status(200).json(allBookings);
//   } catch (error) {
//     console.error("Error fetching bookings:", error);
//     res.status(500).json({ error: "Failed to fetch bookings" });
//   }
// };
const getAllBookingsGeneral = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all listings with their owners
    const stayListings = await StayListing.find().lean();
    const officeSpaces = await OfficeSpace.find().lean();
    const carRentals = await CarRental.find().lean();
    const services = await Service.find().lean();

    // Create maps of listings by their IDs
    const stayListingMap = stayListings.reduce((acc, listing) => {
      acc[listing._id] = listing;
      return acc;
    }, {});
    const officeSpaceMap = officeSpaces.reduce((acc, listing) => {
      acc[listing._id] = listing;
      return acc;
    }, {});
    const carRentalMap = carRentals.reduce((acc, listing) => {
      acc[listing._id] = listing;
      return acc;
    }, {});
    const serviceMap = services.reduce((acc, listing) => {
      acc[listing._id] = listing;
      return acc;
    }, {});

    // Collect all owner IDs
    const ownerIds = [
      ...stayListings.map((listing) => listing.owner),
      ...officeSpaces.map((listing) => listing.owner),
      ...carRentals.map((listing) => listing.owner),
      ...services.map((listing) => listing.owner),
    ];
    const uniqueOwnerIds = [...new Set(ownerIds)];

    // Fetch all bookings
    const stayBookings = await Booking.find({
      listingId: { $in: stayListings.map((listing) => listing._id) },
    }).lean();
    const officeBookings = await CoofficeBooking.find({
      officeId: { $in: officeSpaces.map((listing) => listing._id) },
    }).lean();
    const rentalBookings = await Rental.find({
      rentalId: { $in: carRentals.map((listing) => listing._id) },
    }).lean();
    const serviceBookings = await ServiceBooking.find({
      serviceId: { $in: services.map((listing) => listing._id) },
    }).lean();

    // Collect all booking IDs
    const bookingIds = [
      ...stayBookings.map((booking) => booking._id),
      ...officeBookings.map((booking) => booking._id),
      ...rentalBookings.map((booking) => booking._id),
      ...serviceBookings.map((booking) => booking._id),
    ];

    // Collect all user IDs from bookings
    const userIds = [
      ...stayBookings.map((booking) => booking.userId),
      ...officeBookings.map((booking) => booking.userId),
      ...rentalBookings.map((booking) => booking.userId),
      ...serviceBookings.map((booking) => booking.userId),
    ];
    const uniqueUserIds = [...new Set(userIds)];

    // Fetch users, owner payouts, and vendor payouts in parallel
    const [users, ownerPayouts, vendorPayouts] = await Promise.all([
      User.find({ _id: { $in: uniqueUserIds } }).lean(),
      Payout.find({ userId: { $in: uniqueOwnerIds } }).lean(),
      VendorPayouts.find({ booking: { $in: bookingIds } }).lean(),
    ]);
    // Create maps for users, payouts, and vendor payouts
    const userMap = users.reduce((acc, user) => {
      acc[user._id] = user;
      return acc;
    }, {});

    const payoutMap = ownerPayouts.reduce((acc, payout) => {
      acc[payout.userId] = payout;
      return acc;
    }, {});

    // Create map for vendor payouts by booking ID
    const vendorPayoutMap = vendorPayouts.reduce((acc, payout) => {
      acc[payout.booking] = payout;
      return acc;
    }, {});

    // Combine all bookings with user, owner payout, and vendor payout information
    const allBookings = [
      ...stayBookings.map((booking) => ({
        ...booking,
        type: "stay",
        user: userMap[booking.userId],
        listing: stayListingMap[booking.listingId],
        ownerPayout: payoutMap[stayListingMap[booking.listingId].owner] || null,
        vendorPayout: vendorPayoutMap[booking._id] || null, // Added vendor payout
      })),
      ...officeBookings.map((booking) => ({
        ...booking,
        type: "office",
        user: userMap[booking.userId],
        listing: officeSpaceMap[booking.officeId],
        ownerPayout: payoutMap[officeSpaceMap[booking.officeId].owner] || null,
        vendorPayout: vendorPayoutMap[booking._id] || null, // Added vendor payout
      })),
      ...rentalBookings.map((booking) => ({
        ...booking,
        type: "rental",
        user: userMap[booking.userId],
        listing: carRentalMap[booking.rentalId],
        ownerPayout: payoutMap[carRentalMap[booking.rentalId].owner] || null,
        vendorPayout: vendorPayoutMap[booking._id] || null, // Added vendor payout
      })),
      ...serviceBookings.map((booking) => ({
        ...booking,
        type: "service",
        user: userMap[booking.userId],
        listing: serviceMap[booking.serviceId],
        ownerPayout: payoutMap[serviceMap[booking.serviceId].owner] || null,
        vendorPayout: vendorPayoutMap[booking._id] || null, // Added vendor payout
      })),
    ];

    res.status(200).json(allBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};
const getUpcomingBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();

    const [stayListings, rentals, services, coofficeSpaces] = await Promise.all(
      [
        StayListing.find({ owner: userId }).lean(),
        CarRental.find({ owner: userId }).lean(),
        Service.find({ owner: userId }).lean(),
        OfficeSpace.find({ owner: userId }).lean(),
      ]
    );

    const stayListingIds = stayListings.map((listing) => listing._id);
    const rentalIds = rentals.map((rental) => rental._id);
    const serviceIds = services.map((service) => service._id);
    const coofficeSpaceIds = coofficeSpaces.map((space) => space._id);

    const [stayBookings, rentalBookings, serviceBookings, coofficeBookings] =
      await Promise.all([
        Booking.find({
          listingId: { $in: stayListingIds },
          status: "confirmed",
        }).lean(),
        Rental.find({
          rentalId: { $in: rentalIds },
          status: "confirmed",
        }).lean(),
        ServiceBooking.find({
          serviceId: { $in: serviceIds },
          status: "confirmed",
        }).lean(),
        CoofficeBooking.find({
          officeId: { $in: coofficeSpaceIds },
          status: "confirmed",
        }).lean(),
      ]);

    const upcomingBookings = [
      ...stayBookings,
      ...rentalBookings,
      ...serviceBookings,
      ...coofficeBookings,
    ];

    // Respond with the total number of upcoming bookings
    res.status(200).json({ totalUpcomingBookings: upcomingBookings.length });
  } catch (error) {
    console.error("Error fetching upcoming bookings:", error);
    res.status(500).json({ error: "Failed to fetch upcoming bookings" });
  }
};

const activeUsers = async (req, res) => {
  try {
    const activeUsers = await User.countDocuments({
      account_type: { $in: ["user", "partner", "user_partner"] },
      status: "active",
    });

    res.status(200).json({ totalActiveUsers: activeUsers });
  } catch (error) {
    console.error("Error fetching active users:", error);
    res.status(500).json({ error: "Failed to fetch active users" });
  }
};

const allUsers = async (req, res) => {
  try {
    const activeUsers = await User.countDocuments({
      account_type: { $in: ["user", "partner", "user_partner"] },
    });

    res.status(200).json({ totalActiveUsers: activeUsers });
  } catch (error) {
    console.error("Error fetching active users:", error);
    res.status(500).json({ error: "Failed to fetch active users" });
  }
};

const getUpcomingBookingsGeneral = async (req, res) => {
  try {
    const status = "confirmed";
    const today = new Date();

    const [stayListings, rentals, services, coofficeSpaces] = await Promise.all(
      [
        StayListing.find().lean(),
        CarRental.find().lean(),
        Service.find().lean(),
        OfficeSpace.find().lean(),
      ]
    );

    // Extract listing IDs
    const stayListingIds = stayListings.map((listing) => listing._id);
    const rentalIds = rentals.map((rental) => rental._id);
    const serviceIds = services.map((service) => service._id);
    const coofficeSpaceIds = coofficeSpaces.map((space) => space._id);

    // Fetch confirmed bookings from all schemas
    const [stayBookings, rentalBookings, serviceBookings, coofficeBookings] =
      await Promise.all([
        Booking.find({
          listingId: { $in: stayListingIds },
          status: "confirmed",
        }).lean(),
        Rental.find({
          rentalId: { $in: rentalIds },
          status: "confirmed",
        }).lean(),
        ServiceBooking.find({
          serviceId: { $in: serviceIds },
          status: "confirmed",
        }).lean(),
        CoofficeBooking.find({
          officeId: { $in: coofficeSpaceIds },
          status: "confirmed",
        }).lean(),
      ]);

    // Combine all upcoming bookings
    const upcomingBookings = [
      ...stayBookings,
      ...rentalBookings,
      ...serviceBookings,
      ...coofficeBookings,
    ];

    // Respond with the total number of upcoming bookings
    res.status(200).json({ totalUpcomingBookings: upcomingBookings.length });
  } catch (error) {
    console.error("Error fetching upcoming bookings:", error);
    res.status(500).json({ error: "Failed to fetch upcoming bookings" });
  }
};
const getEndedBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all listings owned by the user
    const [stayListings, rentals, services, coofficeSpaces] = await Promise.all(
      [
        StayListing.find({ owner: userId }).lean(),
        CarRental.find({ owner: userId }).lean(),
        Service.find({ owner: userId }).lean(),
        OfficeSpace.find({ owner: userId }).lean(),
      ]
    );

    // Extract listing IDs
    const stayListingIds = stayListings.map((listing) => listing._id);
    const rentalIds = rentals.map((rental) => rental._id);
    const serviceIds = services.map((service) => service._id);
    const coofficeSpaceIds = coofficeSpaces.map((space) => space._id);

    // Fetch bookings with a status of "ended" from all schemas
    const [stayBookings, rentalBookings, serviceBookings, coofficeBookings] =
      await Promise.all([
        Booking.find({
          listingId: { $in: stayListingIds },
          status: "ended",
        }).lean(),
        Rental.find({
          rentalId: { $in: rentalIds },
          status: "ended",
        }).lean(),
        ServiceBooking.find({
          serviceId: { $in: serviceIds },
          status: "ended",
        }).lean(),
        CoofficeBooking.find({
          officeId: { $in: coofficeSpaceIds },
          status: "ended",
        }).lean(),
      ]);

    // Combine all ended bookings
    const endedBookings = [
      ...stayBookings,
      ...rentalBookings,
      ...serviceBookings,
      ...coofficeBookings,
    ];

    // Respond with the total number of ended bookings
    res.status(200).json({ totalEndedBookings: endedBookings.length });
  } catch (error) {
    console.error("Error fetching ended bookings:", error);
    res.status(500).json({ error: "Failed to fetch ended bookings" });
  }
};
const getEndedBookingsGeneral = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all listings owned by the user
    const [stayListings, rentals, services, coofficeSpaces] = await Promise.all(
      [
        StayListing.find().lean(),
        CarRental.find().lean(),
        Service.find().lean(),
        OfficeSpace.find().lean(),
      ]
    );

    // Extract listing IDs
    const stayListingIds = stayListings.map((listing) => listing._id);
    const rentalIds = rentals.map((rental) => rental._id);
    const serviceIds = services.map((service) => service._id);
    const coofficeSpaceIds = coofficeSpaces.map((space) => space._id);

    // Fetch bookings with a status of "ended" from all schemas
    const [stayBookings, rentalBookings, serviceBookings, coofficeBookings] =
      await Promise.all([
        Booking.find({
          listingId: { $in: stayListingIds },
          status: "ended",
        }).lean(),
        Rental.find({
          rentalId: { $in: rentalIds },
          status: "ended",
        }).lean(),
        ServiceBooking.find({
          serviceId: { $in: serviceIds },
          status: "ended",
        }).lean(),
        CoofficeBooking.find({
          officeId: { $in: coofficeSpaceIds },
          status: "ended",
        }).lean(),
      ]);

    // Combine all ended bookings
    const endedBookings = [
      ...stayBookings,
      ...rentalBookings,
      ...serviceBookings,
      ...coofficeBookings,
    ];

    // Respond with the total number of ended bookings
    res.status(200).json({ totalEndedBookings: endedBookings.length });
  } catch (error) {
    console.error("Error fetching ended bookings:", error);
    res.status(500).json({ error: "Failed to fetch ended bookings" });
  }
};

const getAllInactiveListings = async (req, res) => {
  try {
    const userId = req.params.userId; // Get userId from request parameters

    // Fetch all inactive listings owned by the user
    const stayListings = await StayListing.find({
      owner: userId,
      status: "inactive",
    }).lean();
    const services = await Service.find({
      owner: userId,
      status: "inactive",
    }).lean();
    const officeSpaces = await OfficeSpace.find({
      owner: userId,
      status: "inactive",
    }).lean();
    const carRentals = await CarRental.find({
      owner: userId,
      status: "inactive",
    }).lean();

    // Combine all inactive listings
    const inactiveListings = [
      ...stayListings,
      ...services,
      ...officeSpaces,
      ...carRentals,
    ];

    // Respond with the total number of inactive listings
    res.status(200).json({ totalInactiveListings: inactiveListings.length });
  } catch (error) {
    console.error("Error fetching inactive listings:", error);
    res.status(500).json({ error: "Failed to fetch inactive listings" });
  }
};
const getAllInactiveListingsGeneral = async (req, res) => {
  try {
    const stayListings = await StayListing.find({
      status: "inactive",
    }).lean();
    const services = await Service.find({
      status: "inactive",
    }).lean();
    const officeSpaces = await OfficeSpace.find({
      status: "inactive",
    }).lean();
    const carRentals = await CarRental.find({
      status: "inactive",
    }).lean();

    // Combine all inactive listings
    const inactiveListings = [
      ...stayListings,
      ...services,
      ...officeSpaces,
      ...carRentals,
    ];

    // Respond with the total number of inactive listings
    res.status(200).json({ totalInactiveListings: inactiveListings.length });
  } catch (error) {
    console.error("Error fetching inactive listings:", error);
    res.status(500).json({ error: "Failed to fetch inactive listings" });
  }
};

const getallActiveListings = async (req, res) => {
  try {
    const userId = req.params.userId; // Get userId from request parameters

    // Fetch all active listings owned by the user
    const stayListings = await StayListing.find({
      owner: userId,
      status: "active",
    }).lean();
    const services = await Service.find({
      owner: userId,
      status: "active",
    }).lean();
    const officeSpaces = await OfficeSpace.find({
      owner: userId,
      status: "active",
    }).lean();
    const carRentals = await CarRental.find({
      owner: userId,
      status: "active",
    }).lean();

    // Combine all active listings
    const activeListings = [
      ...stayListings,
      ...services,
      ...officeSpaces,
      ...carRentals,
    ];

    // Respond with the total number of active listings
    res.status(200).json({ totalActiveListings: activeListings.length });
  } catch (error) {
    console.error("Error fetching active listings:", error);
    res.status(500).json({ error: "Failed to fetch active listings" });
  }
};
const getallActiveListingsGeneral = async (req, res) => {
  try {
    const stayListings = await StayListing.find({
      status: "active",
    }).lean();
    const services = await Service.find({
      status: "active",
    }).lean();
    const officeSpaces = await OfficeSpace.find({
      status: "active",
    }).lean();
    const carRentals = await CarRental.find({
      status: "active",
    }).lean();

    // Combine all active listings
    const activeListings = [
      ...stayListings,
      ...services,
      ...officeSpaces,
      ...carRentals,
    ];

    // Respond with the total number of active listings
    res.status(200).json({ totalActiveListings: activeListings.length });
  } catch (error) {
    console.error("Error fetching active listings:", error);
    res.status(500).json({ error: "Failed to fetch active listings" });
  }
};

// Fetch inactive listings for a given owner
const getInactiveListings = async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Fetch inactive listings for the given owner
    const inactiveListings = await StayListing.find({
      owner: ownerId,
      status: "inactive",
    }).lean();

    res.status(200).json(inactiveListings);
  } catch (error) {
    console.error("Error fetching inactive listings:", error);
    res.status(500).json({ error: "Failed to fetch inactive listings" });
  }
};
const sendNewBookingEmail = async (email, bookingDetails) => {
  const listing = await StayListing.findById(bookingDetails.listingId).lean();
  const propertyName = listing.property_name;

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your smashapartments.com Booking Confirmation</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <header style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 2px solid #221f60;">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100px" height="100px" viewBox="0 0 1000 1000" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd">
            <!-- SVG path data here -->
        </svg>
    </header>
    
    <main style="padding: 20px;">
        <h1 style="color: #221f60; font-family: 'Montserrat', Arial, sans-serif; font-weight: 700;">New Booking Awaiting Confirmation</h1>
        <p>Hello,</p>
        <p>Thank you for choosing smashapartments.com! Your booking request for <strong>${propertyName}</strong> has been received and is currently awaiting confirmation.</p>
        
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #ff8c00; margin-top: 0;">Booking Details</h2>
            <p><strong>Check-in:</strong> ${bookingDetails.checkIn}</p>
            <p><strong>Check-out:</strong> ${bookingDetails.checkOut}</p>
            <p><strong>Guests:</strong> ${bookingDetails.guests}</p>
            <p><strong>Total Amount:</strong> ${bookingDetails.totalAmount}</p>
        </div>

        <p>What happens next?</p>
        <ul style="padding-left: 20px;">
            <li>The property owner will review your booking request</li>
            <li>You will receive a confirmation email within 24 hours</li>
            <li>No payment will be processed until your booking is confirmed</li>
        </ul>

        <p>If you have any questions about your booking, please don't hesitate to contact us.</p>
        <p>The smashapartments.com Team</p>
    </main>
    
    <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px;">
        <p>This email is from smashapartments.com regarding your recent booking request.</p>
        <p>For support, please contact us at: <a href="mailto:support@smashapartments.com" style="color: #ff8c00;">support@smashapartments.com</a></p>
        <p>&copy; 2024 smashapartments.com. All rights reserved.</p>
        <p><a href="#" style="color: #ff8c00;">Privacy Policy</a> | <a href="#" style="color: #ff8c00;">Terms of Service</a></p>
    </footer>
</body>
</html>
  `;

  const mailOptions = {
    from: sender,
    to: [email],
    subject: "Your smashapartments.com Booking Request",
    text: `Thank you for your booking request at ${propertyName}. Your booking is awaiting confirmation. Check-in: ${bookingDetails.checkIn}, Check-out: ${bookingDetails.checkOut}, Guests: ${bookingDetails.guests}, Total: ${bookingDetails.totalAmount}`,
    html: htmlTemplate,
    category: "Booking Confirmation",
    
  };

  try {
    const result = await transport.sendMail(mailOptions);
    console.log("Booking confirmation email sent successfully:", result);
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    throw error;
  }
};
const sendNewBookingEmailOffice = async (email, bookingDetails) => {
  const listing = await OfficeSpace.findById(bookingDetails.officeId).lean();
  const propertyName = listing.office_space_name;
  const officeType = listing.office_type;

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your smashapartments.com Booking Confirmation</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <header style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 2px solid #221f60;">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100px" height="100px" viewBox="0 0 1000 1000" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd">
            <!-- SVG path data here -->
        </svg>
    </header>
    
    <main style="padding: 20px;">
        <h1 style="color: #221f60; font-family: 'Montserrat', Arial, sans-serif; font-weight: 700;">New Booking Awaiting Confirmation</h1>
        <p>Hello,</p>
        <p>Thank you for choosing smashapartments.com! Your booking request for <strong>${propertyName}</strong> has been received and is currently awaiting confirmation.</p>
        
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #ff8c00; margin-top: 0;">Booking Details</h2>
            <p><strong>Check-in:</strong> ${bookingDetails.checkIn}</p>
            <p><strong>Check-out:</strong> ${bookingDetails.checkOut}</p>
            <p><strong>Office type:</strong> ${officeType}</p>
            <p><strong>Total Amount:</strong> ${bookingDetails.totalAmount}</p>
        </div>

        <p>What happens next?</p>
        <ul style="padding-left: 20px;">
            <li>The property owner will review your booking request</li>
            <li>You will receive a confirmation email within 24 hours</li>
            <li>No payment will be processed until your booking is confirmed</li>
        </ul>

        <p>If you have any questions about your booking, please don't hesitate to contact us.</p>
        <p>The smashapartments.com Team</p>
    </main>
    
    <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px;">
        <p>This email is from smashapartments.com regarding your recent booking request.</p>
        <p>For support, please contact us at: <a href="mailto:support@smashapartments.com" style="color: #ff8c00;">support@smashapartments.com</a></p>
        <p>&copy; 2024 smashapartments.com. All rights reserved.</p>
        <p><a href="#" style="color: #ff8c00;">Privacy Policy</a> | <a href="#" style="color: #ff8c00;">Terms of Service</a></p>
    </footer>
</body>
</html>
  `;

  const mailOptions = {
    from: sender,
    to: [email],
    subject: "Your smashapartments.com Booking Request",
    text: `Thank you for your booking request at ${propertyName}. Your booking is awaiting confirmation. Check-in: ${bookingDetails.checkIn}, Check-out: ${bookingDetails.checkOut}, Guests: ${bookingDetails.guests}, Total: ${bookingDetails.totalAmount}`,
    html: htmlTemplate,
    category: "Booking Confirmation",
    
  };

  try {
    const result = await transport.sendMail(mailOptions);
    console.log("Booking confirmation email sent successfully:", result);
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    throw error;
  }
};
const sendNewBookingEmailPickup = async (email, bookingDetails) => {
  const listing = await Service.findById(bookingDetails.serviceId).lean();
  const propertyName = listing.serviceName;

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your smashapartments.com Booking Confirmation</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <header style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 2px solid #221f60;">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100px" height="100px" viewBox="0 0 1000 1000" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd">
            <!-- SVG path data here -->
        </svg>
    </header>
    
    <main style="padding: 20px;">
        <h1 style="color: #221f60; font-family: 'Montserrat', Arial, sans-serif; font-weight: 700;">New Booking Awaiting Confirmation</h1>
        <p>Hello,</p>
        <p>Thank you for choosing smashapartments.com! Your booking request for <strong>${propertyName}</strong> has been received and is currently awaiting confirmation.</p>
        
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #ff8c00; margin-top: 0;">Booking Details</h2>
            <p><strong>Arrival date:</strong> ${bookingDetails.arrivalDate}</p>
            <p><strong>Arrival time:</strong> ${bookingDetails.arrivalTime}</p>
            <p><strong>Total Amount:</strong> ${bookingDetails.totalAmount}</p>
        </div>

        <p>What happens next?</p>
        <ul style="padding-left: 20px;">
            <li>The property owner will review your booking request</li>
            <li>You will receive a confirmation email within 24 hours</li>
            <li>No payment will be processed until your booking is confirmed</li>
        </ul>

        <p>If you have any questions about your booking, please don't hesitate to contact us.</p>
        <p>The smashapartments.com Team</p>
    </main>
    
    <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px;">
        <p>This email is from smashapartments.com regarding your recent booking request.</p>
        <p>For support, please contact us at: <a href="mailto:support@smashapartments.com" style="color: #ff8c00;">support@smashapartments.com</a></p>
        <p>&copy; 2024 smashapartments.com. All rights reserved.</p>
        <p><a href="#" style="color: #ff8c00;">Privacy Policy</a> | <a href="#" style="color: #ff8c00;">Terms of Service</a></p>
    </footer>
</body>
</html>
  `;

  const mailOptions = {
    from: sender,
    to: [email],
    subject: "Your smashapartments.com Booking Request",
    text: `Thank you for your booking request at ${propertyName}. Your booking is awaiting confirmation. Check-in: ${bookingDetails.checkIn}, Check-out: ${bookingDetails.checkOut}, Guests: ${bookingDetails.guests}, Total: ${bookingDetails.totalAmount}`,
    html: htmlTemplate,
    category: "Booking Confirmation",
    
  };

  try {
    const result = await transport.sendMail(mailOptions);
    console.log("Booking confirmation email sent successfully:", result);
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    throw error;
  }
};
const sendNewBookingEmailRental = async (email, bookingDetails) => {
  const listing = await CarRental.findById(bookingDetails.rentalId).lean();

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your smashapartments.com Booking Confirmation</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <header style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 2px solid #221f60;">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100px" height="100px" viewBox="0 0 1000 1000" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd">
            <!-- SVG path data here -->
        </svg>
    </header>
    
    <main style="padding: 20px;">
        <h1 style="color: #221f60; font-family: 'Montserrat', Arial, sans-serif; font-weight: 700;">New Rental Awaiting Confirmation</h1>
        <p>Hello,</p>
        <p>Thank you for choosing smashapartments.com! Your rental request has been received and is currently awaiting confirmation.</p>
        
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #ff8c00; margin-top: 0;">Booking Details</h2>
            <p><strong>Pickup location:</strong> ${bookingDetails.pickupLocation}</p>
            <p><strong>Pickup date:</strong> ${bookingDetails.pickupDate}</p>
            <p><strong>Pickup time:</strong> ${bookingDetails.pickupTime}</p>
            <p><strong>Drop off location:</strong> ${bookingDetails.dropoffLocation}</p>
            <p><strong>Total Amount:</strong> ${bookingDetails.totalAmount}</p>
        </div>

        <p>What happens next?</p>
        <ul style="padding-left: 20px;">
            <li>The property owner will review your booking request</li>
            <li>You will receive a confirmation email within 24 hours</li>
            <li>No payment will be processed until your booking is confirmed</li>
        </ul>

        <p>If you have any questions about your booking, please don't hesitate to contact us.</p>
        <p>The smashapartments.com Team</p>
    </main>
    
    <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px;">
        <p>This email is from smashapartments.com regarding your recent booking request.</p>
        <p>For support, please contact us at: <a href="mailto:support@smashapartments.com" style="color: #ff8c00;">support@smashapartments.com</a></p>
        <p>&copy; 2024 smashapartments.com. All rights reserved.</p>
        <p><a href="#" style="color: #ff8c00;">Privacy Policy</a> | <a href="#" style="color: #ff8c00;">Terms of Service</a></p>
    </footer>
</body>
</html>
  `;

  const mailOptions = {
    from: sender,
    to: [email],
    subject: "Your smashapartments.com Rental Request",
    text: `Thank you for your rental request. Your booking is awaiting confirmation.`,
    html: htmlTemplate,
    category: "Booking Confirmation",
    
  };

  try {
    const result = await transport.sendMail(mailOptions);
    console.log("Booking confirmation email sent successfully:", result);
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    throw error;
  }
};
const sendNewBookingNotificationToOwner = async (listingId) => {
  // Fetch the stay listing details
  const listing = await StayListing.findById(listingId).lean();
  const propertyName = listing.property_name;

  // Fetch the property owner's email
  const owner = await User.findById(listing.owner).lean();
  const ownerEmail = owner.email;
  const ownerName = owner.first_name;

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking for Your Property on smashapartments.com</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <header style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 2px solid #221f60;">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100px" height="100px" viewBox="0 0 1000 1000" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd">
            <!-- SVG path data here -->
        </svg>
    </header>
    
    <main style="padding: 20px;">
        <h1 style="color: #221f60; font-family: 'Montserrat', Arial, sans-serif; font-weight: 700;">New Booking for Your Property</h1>
        <p>Hello, ${ownerName}</p>
        <p>You have received a new booking request for your property <strong>${propertyName}</strong> on smashapartments.com. Please log in to your account to review and confirm this booking as soon as possible.</p>

        <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
        <p>The smashapartments.com Team</p>
    </main>
    
    <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px;">
        <p>This email is from smashapartments.com regarding a new booking for your property.</p>
        <p>For support, please contact us at: <a href="mailto:support@smashapartments.com" style="color: #ff8c00;">support@smashapartments.com</a></p>
        <p>&copy; 2024 smashapartments.com. All rights reserved.</p>
        <p><a href="#" style="color: #ff8c00;">Privacy Policy</a> | <a href="#" style="color: #ff8c00;">Terms of Service</a></p>
    </footer>
</body>
</html>
  `;

  const mailOptions = {
    from: sender,
    to: [ownerEmail],
    subject: "New Booking for Your Property on smashapartments.com",
    text: `You have received a new booking request for your property "${propertyName}". Please log in to your account to review and confirm this booking.`,
    html: htmlTemplate,
    category: "New Booking Notification",
    
  };

  try {
    const result = await transport.sendMail(mailOptions);
    console.log("New booking notification email sent successfully:", result);
  } catch (error) {
    console.error("Error sending new booking notification email:", error);
    throw error;
  }
};
const sendNewBookingNotificationToOwnerOffice = async (officeId) => {
  // Fetch the stay listing details
  const listing = await OfficeSpace.findById(officeId).lean();
  const propertyName = listing.office_space_name;

  // Fetch the property owner's email
  const owner = await User.findById(listing.owner).lean();
  const ownerEmail = owner.email;
  const ownerName = owner.first_name;

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking for Your Property on smashapartments.com</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <header style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 2px solid #221f60;">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100px" height="100px" viewBox="0 0 1000 1000" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd">
            <!-- SVG path data here -->
        </svg>
    </header>
    
    <main style="padding: 20px;">
        <h1 style="color: #221f60; font-family: 'Montserrat', Arial, sans-serif; font-weight: 700;">New Booking for Your Property</h1>
        <p>Hello, ${ownerName}</p>
        <p>You have received a new booking request for your property <strong>${propertyName}</strong> on smashapartments.com. Please log in to your account to review and confirm this booking as soon as possible.</p>

        <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
        <p>The smashapartments.com Team</p>
    </main>
    
    <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px;">
        <p>This email is from smashapartments.com regarding a new booking for your property.</p>
        <p>For support, please contact us at: <a href="mailto:support@smashapartments.com" style="color: #ff8c00;">support@smashapartments.com</a></p>
        <p>&copy; 2024 smashapartments.com. All rights reserved.</p>
        <p><a href="#" style="color: #ff8c00;">Privacy Policy</a> | <a href="#" style="color: #ff8c00;">Terms of Service</a></p>
    </footer>
</body>
</html>
  `;

  const mailOptions = {
    from: sender,
    to: [ownerEmail],
    subject: "New Booking for Your Property on smashapartments.com",
    text: `You have received a new booking request for your property "${propertyName}". Please log in to your account to review and confirm this booking.`,
    html: htmlTemplate,
    category: "New Booking Notification",
    
  };

  try {
    const result = await transport.sendMail(mailOptions);
    console.log("New booking notification email sent successfully:", result);
  } catch (error) {
    console.error("Error sending new booking notification email:", error);
    throw error;
  }
};
const sendNewBookingNotificationToOwnerPickup = async (serviceId) => {
  // Fetch the stay listing details
  const listing = await Service.findById(serviceId).lean();

  // Fetch the property owner's email
  const owner = await User.findById(listing.owner).lean();
  const ownerEmail = owner.email;
  const ownerName = owner.first_name;

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking for Your Property on smashapartments.com</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <header style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 2px solid #221f60;">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100px" height="100px" viewBox="0 0 1000 1000" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd">
            <!-- SVG path data here -->
        </svg>
    </header>
    
    <main style="padding: 20px;">
        <h1 style="color: #221f60; font-family: 'Montserrat', Arial, sans-serif; font-weight: 700;">New Booking for Your Property</h1>
        <p>Hello, ${ownerName}</p>
        <p>You have received a new booking request for a pickup on smashapartments.com. Please log in to your account to review and confirm this booking as soon as possible.</p>

        <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
        <p>The smashapartments.com Team</p>
    </main>
    
    <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px;">
        <p>This email is from smashapartments.com regarding a new booking for your property.</p>
        <p>For support, please contact us at: <a href="mailto:support@smashapartments.com" style="color: #ff8c00;">support@smashapartments.com</a></p>
        <p>&copy; 2024 smashapartments.com. All rights reserved.</p>
        <p><a href="#" style="color: #ff8c00;">Privacy Policy</a> | <a href="#" style="color: #ff8c00;">Terms of Service</a></p>
    </footer>
</body>
</html>
  `;

  const mailOptions = {
    from: sender,
    to: [ownerEmail],
    subject: "New Booking for Your Service on smashapartments.com",
    text: `You have received a new booking request for your service. Please log in to your account to review and confirm this booking.`,
    html: htmlTemplate,
    category: "New Booking Notification",
    
  };

  try {
    const result = await transport.sendMail(mailOptions);
    console.log("New booking notification email sent successfully:", result);
  } catch (error) {
    console.error("Error sending new booking notification email:", error);
    throw error;
  }
};
const sendNewBookingNotificationToOwnerRental = async (rentalId) => {
  const listing = await CarRental.findById(rentalId).lean();

  const owner = await User.findById(listing.owner).lean();
  const ownerEmail = owner.email;
  const ownerName = owner.first_name;

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking for Your Property on smashapartments.com</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <header style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 2px solid #221f60;">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100px" height="100px" viewBox="0 0 1000 1000" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd">
            <!-- SVG path data here -->
        </svg>
    </header>
    
    <main style="padding: 20px;">
        <h1 style="color: #221f60; font-family: 'Montserrat', Arial, sans-serif; font-weight: 700;">New Booking for Your Rental</h1>
        <p>Hello, ${ownerName}</p>
        <p>You have received a new booking request for a rental on smashapartments.com. Please log in to your account to review and confirm this booking as soon as possible.</p>

        <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
        <p>The smashapartments.com Team</p>
    </main>
    
    <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px;">
        <p>This email is from smashapartments.com regarding a new booking for your property.</p>
        <p>For support, please contact us at: <a href="mailto:support@smashapartments.com" style="color: #ff8c00;">support@smashapartments.com</a></p>
        <p>&copy; 2024 smashapartments.com. All rights reserved.</p>
        <p><a href="#" style="color: #ff8c00;">Privacy Policy</a> | <a href="#" style="color: #ff8c00;">Terms of Service</a></p>
    </footer>
</body>
</html>
  `;

  const mailOptions = {
    from: sender,
    to: [ownerEmail],
    subject: "New Booking for Your Rental on smashapartments.com",
    text: `You have received a new booking request for a rental. Please log in to your account to review and confirm this booking.`,
    html: htmlTemplate,
    category: "New Booking Notification",
    
  };

  try {
    const result = await transport.sendMail(mailOptions);
    console.log("New booking notification email sent successfully:", result);
  } catch (error) {
    console.error("Error sending new booking notification email:", error);
    throw error;
  }
};
const verifyPaymentAndBook = async (req, res) => {
  try {
    const { token } = req.cookies;
    const {
      reference,
      listingId,
      checkInDate,
      checkOutDate,
      numPeople,
      numRooms,
      final,
    } = req.body;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify the JWT and get the user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email }).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify the payment with Paystack
    const secretKey = process.env.FLW_SEC;
    const paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    if (
      paystackResponse.data.status !== true ||
      paystackResponse.data.data.status !== "success"
    ) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // Check if the listing exists
    const listing = await StayListing.findById(listingId).lean();
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Create new booking
    const newBooking = new Booking({
      userId: user._id,
      listingId,
      checkInDate,
      checkOutDate,
      numPeople,
      numRooms,
      totalPrice: final,
      paymentReference: reference,
      status: "pending",
    });

    await newBooking.save();

    await sendNewBookingEmail(decoded.email, {
      listingId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: numPeople,
      totalAmount: final,
    });
    await sendNewBookingNotificationToOwner(listingId);
    res
      .status(201)
      .json({ message: "Payment verified and booking created successfully" });
  } catch (error) {
    console.error("Error verifying payment and creating booking:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    res
      .status(500)
      .json({ error: "Failed to verify payment and create booking" });
  }
};

const verifyPaymentAndBookRental = async (req, res) => {
  try {
    const { token } = req.cookies;
    const {
      reference,
      rentalId,
      withDriver,
      pickupLocation,
      pickupDate,
      pickupTime,
      dropoffLocation,
      totalPrice,
    } = req.body;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify the JWT and get the user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify the payment with Paystack
    const secretKey = process.env.FLW_SEC;
    const paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    if (
      paystackResponse.data.status !== true ||
      paystackResponse.data.data.status !== "success"
    ) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // Check if the rental exists
    const carRental = await CarRental.findById(rentalId);
    if (!carRental) {
      return res.status(404).json({ error: "Car rental not found" });
    }

    // Check availability
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const availableFromDate = new Date(carRental.availableFrom);
    const availableToDate = new Date(carRental.availableTo);

    if (
      pickupDateTime < availableFromDate ||
      pickupDateTime > availableToDate
    ) {
      return res.status(400).json({
        error: "Selected date and time are not within the available range",
      });
    }

    // Create new rental booking
    const newRentalBooking = new Rental({
      userId: user._id,
      rentalId: carRental._id,
      withDriver,
      pickupLocation,
      pickupDate: pickupDateTime,
      pickupTime,
      dropoffLocation,
      totalPrice,
      paymentReference: reference,
      status: "pending",
    });

    await newRentalBooking.save();

    await sendNewBookingEmailRental(decoded.email, {
      rentalId: carRental._id,
      withDriver,
      pickupLocation,
      pickupDate: pickupDateTime,
      pickupTime,
      dropoffLocation,
      totalAmount: totalPrice,
    });
    await sendNewBookingNotificationToOwnerRental(rentalId);
    res.status(201).json({
      message: "Payment verified and rental booking created successfully",
    });
  } catch (error) {
    console.error(
      "Error verifying payment and creating rental booking:",
      error
    );
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    res
      .status(500)
      .json({ error: "Failed to verify payment and create rental booking" });
  }
};
const verifyPaymentAndBookCooffice = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { reference, officeId, checkInDate, checkOutDate, final } = req.body;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify the JWT and get the user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email }).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify the payment with Paystack
    const secretKey = process.env.FLW_SEC;

    const paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    if (
      paystackResponse.data.status !== true ||
      paystackResponse.data.data.status !== "success"
    ) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // Check if the office space exists
    const officeSpace = await OfficeSpace.findById(officeId).lean();
    if (!officeSpace) {
      return res.status(404).json({ error: "Office space not found" });
    }

    // Create new cooffice booking
    const newCoofficeBooking = new CoofficeBooking({
      userId: user._id,
      officeId,
      checkInDate,
      checkOutDate,
      totalPrice: final,
      paymentReference: reference,
      status: "pending",
    });

    await newCoofficeBooking.save();
    await sendNewBookingEmailOffice(decoded.email, {
      officeId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalAmount: final,
    });
    await sendNewBookingNotificationToOwnerOffice(officeId);
    res.status(201).json({
      message: "Payment verified and cooffice booking created successfully",
    });
  } catch (error) {
    console.error(
      "Error verifying payment and creating cooffice booking:",
      error
    );
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    res
      .status(500)
      .json({ error: "Failed to verify payment and create cooffice booking" });
  }
};

const getBookings = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify the JWT and get the user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email }).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch bookings for the user
    const bookings = await Booking.find({ userId: user._id })
      .populate("listingId", "property_name images")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

const checkLiked = async (req, res) => {
  try {
    const { id } = req.params; // Get listing ID from request parameters
    const { token } = req.cookies; // Get token from cookies

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify the JWT and get the user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email }).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the listing is liked by the user
    const likedItem = await LikedItem.findOne({
      user: user._id,
      listing_id: id,
    }).lean();

    res.status(200).json({ liked: !!likedItem });
  } catch (error) {
    console.error("Error checking liked status:", error);
    res.status(500).json({ error: "Failed to check liked status" });
  }
};

const likeProperty = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { listingId } = req.body;
    const existingLike = await LikedItem.findOne({
      user: user._id,
      listing_id: listingId,
    });

    if (existingLike) {
      // Unlike the property
      await LikedItem.deleteOne({ user: user._id, listing_id: listingId });
      return res.status(200).json({ message: "Property unliked" });
    } else {
      // Like the property
      const newLike = new LikedItem({ user: user._id, listing_id: listingId });
      await newLike.save();
      return res.status(200).json({ message: "Property liked" });
    }
  } catch (error) {
    console.error("Error liking/unliking property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// authcontroller.js

const getListingData = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await StayListing.findById(id).lean();
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const images = await MediaTag.find({ listing_id: id }).lean();
    const reviewData = await Reviews.aggregate([
      { $match: { listingId: listing._id } },
      {
        $group: {
          _id: "$listingId",
          averageRating: { $avg: { $toDouble: "$rating" } },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const averageRating =
      reviewData.length > 0
        ? Number(reviewData[0].averageRating.toFixed(1))
        : null;
    const reviewCount = reviewData.length > 0 ? reviewData[0].reviewCount : 0;

    const listingWithImages = {
      ...listing,
      images: images.map((image) => ({
        ...image,
        url: `${image.media_location}`,
      })),
      reviewCount,
      averageRating,
    };

    res.status(200).json(listingWithImages);
  } catch (error) {
    console.error("Error fetching listing data:", error);
    res.status(500).json({ error: "Failed to fetch listing data" });
  }
};
const approveListing = async (req, res) => {
  const { listingId, type } = req.body;

  try {
    let listing;

    switch (type) {
      case "stay":
        listing = await StayListing.findById(listingId);
        break;
      case "rental":
        listing = await CarRental.findById(listingId);
        break;
      case "office":
        listing = await OfficeSpace.findById(listingId);
        break;
      case "service":
        listing = await Service.findById(listingId);
        break;
      default:
        return res.status(400).json({ error: "Invalid listing type" });
    }

    if (!listing) return res.status(404).json({ error: "Listing not found" });

    listing.approved = true;
    await listing.save();

    // Get the owner's email
    const owner = await User.findById(listing.owner);
    const ownerEmail = owner.email;

    // Send the approved email to the owner
    await sendApprovedEmail(ownerEmail, listing, type);

    res.status(200).json({ message: "Listing approved successfully", listing });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while approving the listing" });
  }
};

const sendApprovedEmail = async (email, listing, type) => {
  let propertyName;
  switch (type) {
    case "stay":
      propertyName = listing.property_name;
      break;
    case "rental":
      propertyName = listing.carNameModel;
      break;
    case "office":
      propertyName = listing.office_space_name;
      break;
    case "service":
      propertyName = listing.serviceName;
      break;
  }

  const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Listing on smashapartments.com has been Approved</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
  </head>
  <body style="font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <header style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 2px solid #221f60;">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100px" height="100px" viewBox="0 0 1000 1000" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd">
              <!-- SVG path data here -->
          </svg>
      </header>
      
      <main style="padding: 20px;">
          <h1 style="color: #221f60; font-family: 'Montserrat', Arial, sans-serif; font-weight: 700;">Your Listing on smashapartments.com has been Approved</h1>
          <p>Hello,</p>
          <p>We're pleased to inform you that your listing for "${propertyName}" has been approved by the smashapartments.com team.</p>
          
          <p>Your listing is now live and available for customers to book. If you have any questions or need further assistance, please don't hesitate to contact us.</p>
          <p>The smashapartments.com Team</p>
      </main>
      
      <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px;">
          <p>This email is from smashapartments.com regarding the approval of your listing.</p>
          <p>For support, please contact us at: <a href="mailto:support@smashapartments.com" style="color: #ff8c00;">support@smashapartments.com</a></p>
          <p>&copy; 2024 smashapartments.com. All rights reserved.</p>
          <p><a href="#" style="color: #ff8c00;">Privacy Policy</a> | <a href="#" style="color: #ff8c00;">Terms of Service</a></p>
      </footer>
  </body>
  </html>
  `;

  const mailOptions = {
    from: sender,
    to: [email],
    subject: "Your Listing on smashapartments.com has been Approved",
    html: htmlTemplate,
    category: "Listing Approval",
    
  };

  try {
    const result = await transport.sendMail(mailOptions);
    console.log("Approved email sent successfully:", result);
  } catch (error) {
    console.error("Error sending approved email:", error);
    throw error;
  }
};

const getCooffices = async (req, res) => {
  try {
    const {
      location,
      officeType,
      conferenceRoom,
      wifi,
      parking,
      printers,
      pets,
      smoking,
      noLoudNoises,
      catering,
      administrativeSupport,
      minPrice,
      maxPrice,
      availableFrom,
      availableTo,
      minDesks,
      minSize,
      limit,
      offset,
      minRating, // New query parameter for filtering by minimum rating
    } = req.query;

    const filters = {};

    // Add filters for location, office type, amenities, rules, etc.
    if (location) {
      filters.$or = [
        { city: { $regex: new RegExp(location, "i") } },
        { state_name: { $regex: new RegExp(location, "i") } },
      ];
    }
    if (officeType) {
      filters.office_type = { $regex: new RegExp(officeType, "i") };
    }
    if (wifi) filters.wifi = wifi === "true";
    if (conferenceRoom) filters.conference_room = conferenceRoom === "true";
    if (parking) filters.parking = parking === "true";
    if (printers) filters.printers = printers === "true";
    if (pets) filters.pets = pets === "true";
    if (smoking) filters.smoking = smoking === "true";
    if (noLoudNoises) filters.no_loud_noises = noLoudNoises === "true";
    if (catering) filters.catering = catering === "true";
    if (administrativeSupport)
      filters.administrative_support = administrativeSupport === "true";

    // Price filters
    if (minPrice) filters.price_per_day = { $gte: Number(minPrice) };
    if (maxPrice) {
      filters.price_per_day = filters.price_per_day || {};
      filters.price_per_day.$lte = Number(maxPrice);
    }

    // Availability, desks, and size filters
    if (availableFrom)
      filters.available_from = { $lte: new Date(availableFrom) };
    if (availableTo) filters.available_to = { $gte: new Date(availableTo) };
    if (minDesks) filters.number_of_desks = { $gte: Number(minDesks) };
    if (minSize) filters.size_of_office = { $gte: Number(minSize) };

    // Initial fetch of cooffice listings based on filters
    let cooffices = await OfficeSpace.find(filters)
      .skip(Number(offset) || 0)
      .limit(Number(limit) || 10)
      .lean();

    if (cooffices.length === 0) {
      cooffices = await OfficeSpace.find()
        .skip(Number(offset) || 0)
        .limit(Number(limit) || 10)
        .lean();
    }

    // Process each cooffice to add images and rating details
    const coofficesWithDetails = await Promise.all(
      cooffices.map(async (cooffice) => {
        const images = await MediaTag.find({ listing_id: cooffice._id }).lean();

        // Aggregate review data for each cooffice
        const reviewData = await Reviews.aggregate([
          { $match: { listingId: cooffice._id } },
          {
            $group: {
              _id: "$listing_id",
              averageRating: { $avg: { $toDouble: "$rating" } },
              reviewCount: { $sum: 1 },
            },
          },
        ]);

        const averageRating =
          reviewData.length > 0
            ? Number(reviewData[0].averageRating.toFixed(1))
            : null;
        const reviewCount =
          reviewData.length > 0 ? reviewData[0].reviewCount : 0;

        return {
          ...cooffice,
          images: images.map((image) => ({
            ...image,
            url: `${image.media_location}`,
          })),
          averageRating,
          reviewCount,
        };
      })
    );

    // Filter listings to only include those with the exact rating specified by the user
    const filteredCooffices = coofficesWithDetails.filter(
      (cooffice) => !minRating || cooffice.averageRating === Number(minRating)
    );

    res.status(200).json(filteredCooffices);
  } catch (error) {
    console.error("Error fetching cooffices:", error);
    res.status(500).json({ error: "Failed to fetch cooffices" });
  }
};

const getListings = async (req, res) => {
  try {
    const {
      location,
      date,
      people,
      rooms,
      pool,
      wifi,
      parking,
      gym,
      minPrice,
      maxPrice,
      ratings,
      limit,
      offset,
      propertyType,
    } = req.query;

    const filters = {};

    // Add case-insensitive filter for location
    if (propertyType) {
      filters.property_type = propertyType;
    }

    if (location) {
      filters.city = { $regex: new RegExp(location, "i") };
    }

    // Date filter
    if (date) {
      filters.available_from = { $lte: new Date(date) };
    }

    // People, rooms, and amenities filters
    if (people) {
      filters.maximum_occupancy = { $gte: Number(people) };
    }

    if (rooms) {
      filters.number_of_rooms = { $gte: Number(rooms) };
    }

    if (pool) filters.pool = pool === "true";
    if (wifi) filters.wifi = wifi === "true";
    if (parking) filters.parking = parking === "true";
    if (gym) filters.gym = gym === "true";

    // Price filters
    if (minPrice) filters.price_per_night = { $gte: Number(minPrice) };
    if (maxPrice) {
      filters.price_per_night = filters.price_per_night || {};
      filters.price_per_night.$lte = Number(maxPrice);
    }

    filters.status = "active";

    // Find listings based on filters
    let listings = await StayListing.find(filters)
      .skip(offset)
      .limit(limit)
      .lean();

    // If no listings are found, fetch without filters
    if (listings.length === 0) {
      listings = await StayListing.find({ status: "active" })
        .skip(offset)
        .limit(limit)
        .lean();
    }

    // Calculate average rating and count of reviews for each listing, then add images
    const listingsWithDetails = await Promise.all(
      listings.map(async (listing) => {
        const images = await MediaTag.find({ listing_id: listing._id }).lean();

        // Aggregate to get the average rating and review count for the listing
        const reviewData = await Reviews.aggregate([
          { $match: { listingId: listing._id } },
          {
            $group: {
              _id: "$listingId",
              averageRating: { $avg: { $toDouble: "$rating" } },
              reviewCount: { $sum: 1 },
            },
          },
        ]);

        const averageRating =
          reviewData.length > 0
            ? Number(reviewData[0].averageRating.toFixed(1))
            : null;
        const reviewCount =
          reviewData.length > 0 ? reviewData[0].reviewCount : 0;

        return { ...listing, images, averageRating, reviewCount };
      })
    );

    // Filter listings to only include those with the exact rating specified by the user
    const filteredListings = listingsWithDetails.filter(
      (listing) => !ratings || listing.averageRating === Number(ratings)
    );

    res.status(200).json(filteredListings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];
    if (!allowedTypes.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: "Invalid file type. Only images and PDFs are allowed.",
      });
    }

    const bookingId = req.params.bookingId;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Booking not found" });
    }

    const receipt = new Receipts({
      booking_id: bookingId,
      media_name: req.file.filename,
      media_location: req.file.path,
    });

    await receipt.save();

    res.status(200).json({
      message: "Receipt uploaded successfully",
      receipt: {
        id: receipt._id,
        filename: receipt.media_name,
      },
    });
  } catch (error) {
    // Clean up uploaded file if there's an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error uploading receipt:", error);
    res.status(500).json({ error: "Failed to upload receipt" });
  }
};
const uploadReceiptPickup = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];
    if (!allowedTypes.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: "Invalid file type. Only images and PDFs are allowed.",
      });
    }

    const bookingId = req.params.bookingId;

    const booking = await ServiceBooking.findById(bookingId);
    if (!booking) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Booking not found" });
    }

    const receipt = new Receipts({
      booking_id: bookingId,
      media_name: req.file.filename,
      media_location: req.file.path,
    });

    await receipt.save();

    res.status(200).json({
      message: "Receipt uploaded successfully",
      receipt: {
        id: receipt._id,
        filename: receipt.media_name,
      },
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error uploading receipt:", error);
    res.status(500).json({ error: "Failed to upload receipt" });
  }
};
const uploadReceiptOffice = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];
    if (!allowedTypes.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: "Invalid file type. Only images and PDFs are allowed.",
      });
    }

    const bookingId = req.params.bookingId;

    const booking = await CoofficeBooking.findById(bookingId);
    if (!booking) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Booking not found" });
    }

    const receipt = new Receipts({
      booking_id: bookingId,
      media_name: req.file.filename,
      media_location: req.file.path,
    });

    await receipt.save();

    res.status(200).json({
      message: "Receipt uploaded successfully",
      receipt: {
        id: receipt._id,
        filename: receipt.media_name,
      },
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error uploading receipt:", error);
    res.status(500).json({ error: "Failed to upload receipt" });
  }
};

const uploadReceiptRental = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];
    if (!allowedTypes.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: "Invalid file type. Only images and PDFs are allowed.",
      });
    }

    const bookingId = req.params.bookingId;

    const booking = await Rental.findById(bookingId);
    if (!booking) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Booking not found" });
    }

    const receipt = new Receipts({
      booking_id: bookingId,
      media_name: req.file.filename,
      media_location: req.file.path,
    });

    await receipt.save();

    res.status(200).json({
      message: "Receipt uploaded successfully",
      receipt: {
        id: receipt._id,
        media_name: receipt.media_name,
        media_location: receipt.media_location, // Return the path to the uploaded file
      },
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error uploading receipt:", error);
    res.status(500).json({ error: "Failed to upload receipt" });
  }
};

const createRental = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const parsedBody = {
      carNameModel: req.body.carNameModel,
      carType: req.body.carType,
      description: req.body.description,
      carMakeModel: req.body.carMakeModel,
      carColor: req.body.carColor,
      plateNumber: req.body.plateNumber,
      mileage: req.body.mileage,
      driverName: req.body.driverName,
      driverLicenseNumber: req.body.driverLicenseNumber,
      driverPhoneNumber: req.body.driverPhoneNumber,
      driverEmail: req.body.driverEmail,
      rentalPrice: req.body.rentalPrice,
      insurance: req.body.insurance,
      fuel: req.body.fuel,
      extraDriver: req.body.extraDriver === "true",
      availableFrom: new Date(req.body.availableFrom),
      availableTo: new Date(req.body.availableTo),
      cancellationPolicy: req.body.cancellationPolicy,
      refundPolicy: req.body.refundPolicy,
      contactName: req.body.contactName,
      contactPhone: req.body.contactPhone,
      contactEmail: req.body.contactEmail,
      owner: user._id,
    };

    const validationErrors = [];
    if (!parsedBody.carNameModel)
      validationErrors.push("Car name and model is required");
    if (!parsedBody.carType) validationErrors.push("Car type is required");
    if (!parsedBody.description)
      validationErrors.push("Description is required");
    if (!parsedBody.carMakeModel)
      validationErrors.push("Car make and model is required");
    if (!parsedBody.carColor) validationErrors.push("Car color is required");
    if (!parsedBody.plateNumber)
      validationErrors.push("Plate number is required");
    if (!parsedBody.mileage) validationErrors.push("Mileage is required");
    if (!parsedBody.driverName)
      validationErrors.push("Driver name is required");
    if (!parsedBody.driverLicenseNumber)
      validationErrors.push("Driver license number is required");
    if (!parsedBody.driverPhoneNumber)
      validationErrors.push("Driver phone number is required");
    if (!parsedBody.driverEmail)
      validationErrors.push("Driver email is required");
    if (!parsedBody.rentalPrice)
      validationErrors.push("Rental price is required");
    if (!parsedBody.insurance) validationErrors.push("Insurance is required");
    if (!parsedBody.fuel) validationErrors.push("Fuel is required");

    if (!req.files || req.files.length < 4 || req.files.length > 15) {
      validationErrors.push(
        `Please upload between 4 and 15 images. You uploaded ${
          req.files ? req.files.length : 0
        }.`
      );
    }

    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json({ error: "Check your inputs", details: validationErrors });
    }

    const newRental = new CarRental(parsedBody);
    await newRental.save();

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const mediaTag = new MediaTag({
          listing_id: newRental._id,
          media_name: file.filename,
          media_location: file.path,
          size: file.size,
        });
        await mediaTag.save();
      }
    }

    res
      .status(201)
      .json({ message: "Rental created successfully", rental: newRental });
  } catch (error) {
    console.error("Error creating rental:", error);
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res
        .status(400)
        .json({ error: "Validation failed", details: validationErrors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateRental = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { id } = req.params;
    const existingRental = await CarRental.findById(id);
    if (!existingRental) {
      return res.status(404).json({ error: "Rental not found" });
    }

    const parsedBody = {
      carNameModel: req.body.carNameModel,
      carType: req.body.carType,
      description: req.body.description,
      carMakeModel: req.body.carMakeModel,
      carColor: req.body.carColor,
      plateNumber: req.body.plateNumber,
      mileage: req.body.mileage,
      driverName: req.body.driverName,
      driverLicenseNumber: req.body.driverLicenseNumber,
      driverPhoneNumber: req.body.driverPhoneNumber,
      driverEmail: req.body.driverEmail,
      rentalPrice: req.body.rentalPrice,
      insurance: req.body.insurance,
      fuel: req.body.fuel,
      extraDriver: req.body.extraDriver === "true",
      availableFrom: new Date(req.body.availableFrom),
      availableTo: new Date(req.body.availableTo),
      cancellationPolicy: req.body.cancellationPolicy,
      refundPolicy: req.body.refundPolicy,
      contactName: req.body.contactName,
      contactPhone: req.body.contactPhone,
      contactEmail: req.body.contactEmail,
    };

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      Object.assign(existingRental, parsedBody);
      await existingRental.save({ session });

      // Handle existing images
      const existingImages = req.body.existingImages;
      const existingImageUrls = Array.isArray(existingImages)
        ? existingImages
        : existingImages
        ? [existingImages]
        : [];

      const currentMediaTags = await MediaTag.find({ listing_id: id });

      // Find media tags to delete (those not in existingImageUrls)
      const toDelete = currentMediaTags.filter(
        (tag) => !existingImageUrls.includes(tag.media_location)
      );

      if (toDelete.length > 0) {
        await MediaTag.deleteMany(
          {
            listing_id: id,
            media_location: { $in: toDelete.map((tag) => tag.media_location) },
          },
          { session }
        );
      }

      // Handle new images - Keep existing images and add new ones if provided
      if (req.files && req.files.length > 0) {
        const newMediaTags = req.files.map((file) => ({
          listing_id: existingRental._id,
          media_name: file.filename,
          media_location: file.path,
          size: file.size,
        }));

        await MediaTag.insertMany(newMediaTags, { session });
      }

      // Commit the transaction
      await session.commitTransaction();

      // Get updated rental with all images
      const updatedMediaTags = await MediaTag.find({ listing_id: id });

      res.status(200).json({
        message: "Rental updated successfully",
        rental: {
          ...existingRental.toObject(),
          images: updatedMediaTags.map((tag) => ({
            location: tag.media_location,
            name: tag.media_name,
          })),
        },
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error updating rental:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateListing = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { id } = req.params;
    const existingListing = await StayListing.findById(id);
    if (!existingListing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Parse form data for updating fields
    const parsedBody = {
      property_name: req.body.propertyName,
      city: req.body.city,
      state_name: req.body.state_name,
      property_type: req.body.propertyType,
      description: req.body.propertyDescription,
      number_of_rooms: parseInt(req.body.numRooms),
      number_of_bathrooms: parseInt(req.body.numBathrooms),
      maximum_occupancy: parseInt(req.body.maxOccupancy),
      price_per_night: parseFloat(req.body.pricePerNight),
      available_from: new Date(req.body.availableFrom),
      available_to: new Date(req.body.availableTo),
      contact_name: req.body.contactName,
      contact_phone: req.body.contactPhone,
      contact_email: req.body.contactEmail,
      security_levy: req.body.securityDeposit,
      cancellation_policy: req.body.cancellationPolicy,
      refund_policy: req.body.refundPolicy,
      wifi: req.body.wifi === "true",
      pool: req.body.pool === "true",
      parking: req.body.parking === "true",
      gym: req.body.gym === "true",
      pets: req.body.pets === "true",
      smoking: req.body.smoking === "true",
      meals: req.body.meals === "true",
      cleaning: req.body.cleaning === "true",
      weekly_discount: parseFloat(req.body.weeklyDiscount),
      monthly_discount: parseFloat(req.body.monthlyDiscount),
    };

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update the listing
      Object.assign(existingListing, parsedBody);
      await existingListing.save({ session });

      // Handle existing images
      const existingImages = req.body.existingImages;
      // Ensure we always have an array, even with a single image
      const existingImageUrls = Array.isArray(existingImages)
        ? existingImages
        : existingImages
        ? [existingImages]
        : [];

      // Get current media tags
      const currentMediaTags = await MediaTag.find({ listing_id: id });

      // Find media tags to delete (those not in existingImageUrls)
      const toDelete = currentMediaTags.filter(
        (tag) => !existingImageUrls.includes(tag.media_location)
      );

      // Delete only the removed media tags
      if (toDelete.length > 0) {
        await MediaTag.deleteMany(
          {
            listing_id: id,
            media_location: { $in: toDelete.map((tag) => tag.media_location) },
          },
          { session }
        );
      }

      // Handle new images - Keep existing images and add new ones
      if (req.files && req.files.length > 0) {
        const newMediaTags = req.files.map((file) => ({
          listing_id: existingListing._id,
          media_name: file.filename,
          media_location: file.path,
          size: file.size,
        }));

        await MediaTag.insertMany(newMediaTags, { session });
      }

      // Commit the transaction
      await session.commitTransaction();

      // Get updated listing with all images
      const updatedMediaTags = await MediaTag.find({ listing_id: id });

      res.status(200).json({
        message: "Stay listing updated successfully",
        stay_listing: {
          ...existingListing.toObject(),
          images: updatedMediaTags.map((tag) => ({
            location: tag.media_location,
            name: tag.media_name,
          })),
        },
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error updating stay listing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateService = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { id } = req.params;
    const existingService = await Service.findById(id);
    if (!existingService) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Parse form data for updating fields
    const parsedBody = {
      serviceName: req.body.serviceName,
      description: req.body.description,
      carMakeModel: req.body.carMakeModel,
      carColor: req.body.carColor,
      plateNumber: req.body.plateNumber,
      driverName: req.body.driverName,
      driverLicenseNumber: req.body.driverLicenseNumber,
      driverPhoneNumber: req.body.driverPhoneNumber,
      driverEmail: req.body.driverEmail,
      pickupPrice: parseFloat(req.body.pickupPrice),
      extraLuggage: parseInt(req.body.extraLuggage),
      waitingTime: parseInt(req.body.waitingTime),
      availableFrom: new Date(req.body.availableFrom),
      availableTo: new Date(req.body.availableTo),
      cancellationPolicy: req.body.cancellationPolicy,
      refundPolicy: req.body.refundPolicy,
      contactName: req.body.contactName,
      contactPhone: req.body.contactPhone,
      contactEmail: req.body.contactEmail,
    };

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update the service
      Object.assign(existingService, parsedBody);
      await existingService.save({ session });

      // Handle existing images
      const existingImages = req.body.existingImages;
      const existingImageUrls = Array.isArray(existingImages)
        ? existingImages
        : existingImages
        ? [existingImages]
        : [];

      const currentMediaTags = await MediaTag.find({ listing_id: id });

      // Find media tags to delete (those not in existingImageUrls)
      const toDelete = currentMediaTags.filter(
        (tag) => !existingImageUrls.includes(tag.media_location)
      );

      // Delete only the removed media tags
      if (toDelete.length > 0) {
        await MediaTag.deleteMany(
          {
            listing_id: id,
            media_location: { $in: toDelete.map((tag) => tag.media_location) },
          },
          { session }
        );
      }

      // Handle new images - Keep existing images and add new ones
      if (req.files && req.files.length > 0) {
        const newMediaTags = req.files.map((file) => ({
          listing_id: existingService._id,
          media_name: file.filename,
          media_location: file.path,
          size: file.size,
        }));

        await MediaTag.insertMany(newMediaTags, { session });
      }

      // Commit the transaction
      await session.commitTransaction();

      // Get updated service with all images
      const updatedMediaTags = await MediaTag.find({ listing_id: id });

      res.status(200).json({
        message: "Service updated successfully",
        service: {
          ...existingService.toObject(),
          images: updatedMediaTags.map((tag) => ({
            location: tag.media_location,
            name: tag.media_name,
          })),
        },
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getStayListing = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const listingId = req.params.id;
    const stayListing = await StayListing.findById(listingId).lean();
    if (!stayListing) {
      return res.status(404).json({ error: "Stay listing not found" });
    }

    const mediaTags = await MediaTag.find({ listing_id: listingId });
    const images = mediaTags.map((media) => ({
      name: media.media_name,
      location: media.media_location,
      size: media.size,
    }));

    res.status(200).json({
      message: "Stay listing fetched successfully",
      stayListing: {
        ...stayListing,
        images,
      },
    });
  } catch (error) {
    console.error("Error fetching stay listing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getServiceListing = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const listingId = req.params.id;
    const stayListing = await Service.findById(listingId).lean();
    if (!stayListing) {
      return res.status(404).json({ error: "Stay listing not found" });
    }

    const mediaTags = await MediaTag.find({ listing_id: listingId });
    const images = mediaTags.map((media) => ({
      name: media.media_name,
      location: media.media_location,
      size: media.size,
    }));

    res.status(200).json({
      message: "Stay listing fetched successfully",
      serviceListing: {
        ...stayListing,
        images,
      },
    });
  } catch (error) {
    console.error("Error fetching stay listing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getOfficeListing = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const listingId = req.params.id;
    const stayListing = await OfficeSpace.findById(listingId).lean();
    if (!stayListing) {
      return res.status(404).json({ error: "Stay listing not found" });
    }

    const mediaTags = await MediaTag.find({ listing_id: listingId });
    const images = mediaTags.map((media) => ({
      name: media.media_name,
      location: media.media_location,
      size: media.size,
    }));

    res.status(200).json({
      message: "Stay listing fetched successfully",
      officeListing: {
        ...stayListing,
        images,
      },
    });
  } catch (error) {
    console.error("Error fetching stay listing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRentalListing = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const listingId = req.params.id;
    const stayListing = await CarRental.findById(listingId).lean();
    if (!stayListing) {
      return res.status(404).json({ error: "Stay listing not found" });
    }

    const mediaTags = await MediaTag.find({ listing_id: listingId });
    const images = mediaTags.map((media) => ({
      name: media.media_name,
      location: media.media_location,
      size: media.size,
    }));

    res.status(200).json({
      message: "Stay listing fetched successfully",
      rentalListing: {
        ...stayListing,
        images,
      },
    });
  } catch (error) {
    console.error("Error fetching stay listing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createStayListing = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const parsedBody = {
      property_name: req.body.propertyName,
      city: req.body.city,
      state_name: req.body.state_name,
      property_type: req.body.propertyType,
      description: req.body.propertyDescription,
      number_of_rooms: parseInt(req.body.numRooms),
      number_of_bathrooms: parseInt(req.body.numBathrooms),
      maximum_occupancy: parseInt(req.body.maxOccupancy),
      price_per_night: parseFloat(req.body.pricePerNight),
      available_from: new Date(req.body.availableFrom),
      available_to: new Date(req.body.availableTo),
      contact_name: req.body.contactName,
      contact_phone: req.body.contactPhone,
      contact_email: req.body.contactEmail,
      security_levy: req.body.securityDeposit,
      cancellation_policy: req.body.cancellationPolicy,
      refund_policy: req.body.refundPolicy,
      wifi: req.body.wifi === "true",
      pool: req.body.pool === "true",
      parking: req.body.parking === "true",
      gym: req.body.gym === "true",
      pets: req.body.pets === "true",
      smoking: req.body.smoking === "true",
      meals: req.body.meals === "true",
      cleaning: req.body.cleaning === "true",
      weekly_discount: parseFloat(req.body.weeklyDiscount),
      monthly_discount: parseFloat(req.body.monthlyDiscount),
      owner: user._id,
    };

    const validationErrors = [];
    if (isNaN(parsedBody.number_of_rooms))
      validationErrors.push("Invalid number of rooms");
    if (isNaN(parsedBody.number_of_bathrooms))
      validationErrors.push("Invalid number of bathrooms");
    if (isNaN(parsedBody.maximum_occupancy))
      validationErrors.push("Invalid maximum occupancy");
    if (isNaN(parsedBody.price_per_night))
      validationErrors.push("Invalid price per night");
    if (isNaN(parsedBody.available_from.getTime()))
      validationErrors.push("Invalid available from date");
    if (isNaN(parsedBody.available_to.getTime()))
      validationErrors.push("Invalid available to date");
    if (isNaN(parsedBody.weekly_discount))
      validationErrors.push("Invalid weekly discount");
    if (isNaN(parsedBody.monthly_discount))
      validationErrors.push("Invalid monthly discount");

    if (!req.files || req.files.length < 4 || req.files.length > 15) {
      validationErrors.push(
        `Please upload between 4 and 15 images. You uploaded ${
          req.files ? req.files.length : 0
        }.`
      );
    }

    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: validationErrors });
    }

    const newStayListing = new StayListing(parsedBody);

    await newStayListing.save();

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const mediaTag = new MediaTag({
          listing_id: newStayListing._id,
          media_name: file.filename,
          media_location: file.path,
          size: file.size,
        });
        await mediaTag.save();
      }
    }

    res.status(201).json({
      message: "Stay listing created successfully",
      stay_listing: newStayListing,
    });
  } catch (error) {
    console.error("Error creating stay listing:", error);
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res
        .status(400)
        .json({ error: "Validation failed", details: validationErrors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateOffice = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { id } = req.params;
    const existingOffice = await OfficeSpace.findById(id);
    if (!existingOffice) {
      return res.status(404).json({ error: "Office listing not found" });
    }

    const parsedBody = {
      office_space_name: req.body.officeSpaceName,
      city: req.body.city,
      state_name: req.body.state_name,
      office_type: req.body.officeType,
      description: req.body.description,
      size_of_office: parseInt(req.body.size),
      number_of_desks: parseInt(req.body.numDesks),
      wifi: req.body.wifi === "true",
      conference_room: req.body.conferenceRooms === "true",
      parking: req.body.parking === "true",
      printers: req.body.printers === "true",
      pets: req.body.pets === "true",
      smoking: req.body.smoking === "true",
      no_loud_noises: req.body.noises === "true",
      catering: req.body.catering === "true",
      administrative_support: req.body.support === "true",
      price_per_day: parseFloat(req.body.pricePerDay),
      price_weekly: parseFloat(req.body.pricePerWeek),
      price_monthly: parseFloat(req.body.pricePerMonth),
      available_from: new Date(req.body.availableFrom),
      available_to: new Date(req.body.availableTo),
      cancellation_policy: req.body.cancellationPolicy,
      refund_policy: req.body.refundPolicy,
      contact_name: req.body.contactName,
      contact_phone: req.body.contactPhone,
      contact_email: req.body.contactEmail,
      security_levy: req.body.securityDeposit,
    };

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update the office listing fields
      Object.assign(existingOffice, parsedBody);
      await existingOffice.save({ session });

      // Handle existing images
      const existingImages = req.body.existingImages;
      const existingImageUrls = Array.isArray(existingImages)
        ? existingImages
        : existingImages
        ? [existingImages]
        : [];

      // Get current media tags
      const currentMediaTags = await MediaTag.find({ listing_id: id });

      // Identify media tags to delete (those not in existingImageUrls)
      const toDelete = currentMediaTags.filter(
        (tag) => !existingImageUrls.includes(tag.media_location)
      );

      // Delete only the removed media tags
      if (toDelete.length > 0) {
        await MediaTag.deleteMany(
          {
            listing_id: id,
            media_location: { $in: toDelete.map((tag) => tag.media_location) },
          },
          { session }
        );
      }

      // Handle new images - Keep existing images and add new ones
      if (req.files && req.files.length > 0) {
        const newMediaTags = req.files.map((file) => ({
          listing_id: existingOffice._id,
          media_name: file.filename,
          media_location: file.path,
          size: file.size,
        }));

        await MediaTag.insertMany(newMediaTags, { session });
      }

      // Commit the transaction
      await session.commitTransaction();

      // Retrieve updated media tags for response
      const updatedMediaTags = await MediaTag.find({ listing_id: id });

      res.status(200).json({
        message: "Office listing updated successfully",
        office_listing: {
          ...existingOffice.toObject(),
          images: updatedMediaTags.map((tag) => ({
            location: tag.media_location,
            name: tag.media_name,
          })),
        },
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error updating office listing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const Review = async (req, res) => {
  const { userId, bookingId, listingId, rating, review } = req.body;

  try {
    // Check if a review for the user and booking already exists
    const existingReview = await Reviews.findOne({ userId, bookingId });

    if (existingReview) {
      // Update the existing review
      existingReview.rating = rating;
      existingReview.review = review;
      await existingReview.save();
      res.status(200).json({ message: "Review updated successfully" });
    } else {
      // Create a new review
      const newReview = new Reviews({
        userId,
        bookingId,
        listingId,
        rating,
        review,
      });
      await newReview.save();
      res.status(200).json({ message: "Review submitted successfully" });
    }
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ message: "Failed to submit review" });
  }
};

const getReview = async (req, res) => {
  const { userId, bookingId } = req.params;

  try {
    const review = await Reviews.findOne({ userId, bookingId });

    if (review) {
      res.status(200).json(review);
    } else {
      res.status(404).json({ message: "No review found" });
    }
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Failed to fetch review" });
  }
};

const createOfficeListing = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const parsedBody = {
      office_space_name: req.body.officeSpaceName, // Aligned with frontend state
      city: req.body.city,
      state_name: req.body.state_name, // Aligned with frontend state
      office_type: req.body.officeType,
      description: req.body.description,
      size_of_office: parseInt(req.body.size),
      number_of_desks: parseInt(req.body.numDesks),
      wifi: req.body.wifi === "true",
      conference_room: req.body.conferenceRooms === "true", // Aligned with frontend state
      parking: req.body.parking === "true",
      printers: req.body.printers === "true",
      pets: req.body.pets === "true",
      smoking: req.body.smoking === "true",
      no_loud_noises: req.body.noLoudNoises === "true", // Aligned with frontend state
      catering: req.body.catering === "true",
      administrative_support: req.body.support === "true", // Aligned with frontend state
      price_per_day: parseFloat(req.body.pricePerDay),
      price_weekly: parseFloat(req.body.pricePerWeek),
      price_monthly: parseFloat(req.body.pricePerMonth),
      available_from: new Date(req.body.availableFrom),
      available_to: new Date(req.body.availableTo),
      cancellation_policy: req.body.cancellationPolicy,
      refund_policy: req.body.refundPolicy,
      contact_name: req.body.contactName,
      contact_phone: req.body.contactPhone,
      contact_email: req.body.contactEmail,
      security_levy: req.body.securityDeposit,
      owner: user._id,
    };

    const validationErrors = [];
    if (isNaN(parsedBody.size_of_office))
      validationErrors.push("Invalid size of office");
    if (isNaN(parsedBody.number_of_desks))
      validationErrors.push("Invalid number of desks");
    if (isNaN(parsedBody.price_per_day))
      validationErrors.push("Invalid price per day");
    if (isNaN(parsedBody.price_weekly))
      validationErrors.push("Invalid price weekly");
    if (isNaN(parsedBody.price_monthly))
      validationErrors.push("Invalid price monthly");
    if (isNaN(parsedBody.available_from.getTime()))
      validationErrors.push("Invalid available from date");
    if (isNaN(parsedBody.available_to.getTime()))
      validationErrors.push("Invalid available to date");

    if (!req.files || req.files.length < 4 || req.files.length > 15) {
      validationErrors.push(
        `Please upload between 4 and 15 images. You uploaded ${
          req.files ? req.files.length : 0
        }.`
      );
    }

    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: validationErrors });
    }

    const newOfficeListing = new OfficeSpace(parsedBody);
    await newOfficeListing.save();

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const mediaTag = new MediaTag({
          listing_id: newOfficeListing._id,
          media_name: file.filename,
          media_location: file.path,
          size: file.size,
        });
        await mediaTag.save();
      }
    }

    res.status(201).json({
      message: "Office listing created successfully",
      office_listing: newOfficeListing,
    });
  } catch (error) {
    console.error("Error creating office listing:", error);
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res
        .status(400)
        .json({ error: "Validation failed", details: validationErrors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const verifyAccount = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is already verified
    if (user.is_verified) {
      return res.status(400).json({ error: "User is already verified" });
    }

    // Check if the provided code matches the stored code
    if (user.code !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // Update user as verified and clear the verification code
    user.is_verified = true;
    user.code = null;
    await user.save();

    // Sign the JWT token and add 'interface': 'user' to the payload
    jwt.sign(
      {
        email: user.email,
        id: user._id,
        first_name: user.first_name,
        interface: "user", // Add 'interface': 'user' to the JWT payload
      },
      process.env.JWT_SECRET,
      {},
      async (err, token) => {
        if (err) throw err;

        // Send login notification email
        const loginTime = new Date().toLocaleString();
        await sendLoginEmail(user.email, loginTime);

        return res
          .status(200)
          .json({ message: "Account verified successfully", token });
      }
    );
  } catch (error) {
    console.error("Error during account verification:", error);
    return res
      .status(500)
      .json({ error: "Server error, please try again later" });
  }
};
const verifyAccountPartner = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is already verified
    if (user.is_verified) {
      return res.status(400).json({ error: "User is already verified" });
    }

    // Check if the provided code matches the stored code
    if (user.code !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // Update user as verified and clear the verification code
    user.is_verified = true;
    user.code = null;
    await user.save();

    // Sign the JWT token and add 'interface': 'user' to the payload
    jwt.sign(
      {
        email: user.email,
        id: user._id,
        first_name: user.first_name,
        interface: "partner", // Add 'interface': 'user' to the JWT payload
      },
      process.env.JWT_SECRET,
      {},
      async (err, token) => {
        if (err) throw err;

        // Send login notification email
        const loginTime = new Date().toLocaleString();
        await sendLoginEmail(user.email, loginTime);

        return res
          .status(200)
          .json({ message: "Account verified successfully", token });
      }
    );
  } catch (error) {
    console.error("Error during account verification:", error);
    return res
      .status(500)
      .json({ error: "Server error, please try again later" });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.json({
        error: "Email is required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No account found with this email",
      });
    }

    // Generate new random password (12 characters)
    const newPassword = crypto.randomBytes(6).toString("hex");

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    // Send recovery email
    await sendRecoveryEmail(email, newPassword);

    // Return success message
    return res.json({
      message: "Password reset. Check your email for the new password",
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    return res.json({
      error: "Server error, please try again later",
    });
  }
};

const sendRecoveryEmail = async (email, newPassword) => {
  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your smashapartments.com Password Reset</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <header style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 2px solid #221f60;">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100px" height="100px" viewBox="0 0 1000 1000" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd">
            <!-- SVG path data here -->
        </svg>
    </header>
    
    <main style="padding: 20px;">
        <h1 style="color: #221f60; font-family: 'Montserrat', Arial, sans-serif; font-weight: 700;">Password Reset</h1>
        <p>Hello,</p>
        <p>Your password for smashapartments.com has been reset. Your new password is:</p>
        <p style="font-size: 24px; font-weight: 700; color: #ff8c00; text-align: center;">${newPassword}</p>
        <p>Please log in with this password and change it immediately for security reasons.</p>
        <p>If you didn't request this password reset, please contact our support team immediately.</p>
        <p>The smashapartments.com Team</p>
    </main>
    
    <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px;">
        <p>This email is from smashapartments.com. If you are receiving this email, it means that a password reset was requested for your account.</p>
        <p>For support, please contact us at: <a href="mailto:support@smashapartments.com" style="color: #ff8c00;">support@smashapartments.com</a></p>
        <p>&copy; 2024 smashapartments.com. All rights reserved.</p>
        <p><a href="#" style="color: #ff8c00;">Privacy Policy</a> | <a href="#" style="color: #ff8c00;">Terms of Service</a></p>
    </footer>
</body>
</html>
  `;

  const mailOptions = {
    from: sender,
    to: [email],
    subject: "Your smashapartments.com Password Has Been Reset",
    text: `Your new password is: ${newPassword}`,
    html: htmlTemplate,
    category: "Password Reset",
  };

  try {
    const result = await transport.sendMail(mailOptions);
    console.log("Password reset email sent successfully:", result);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

const registerUser = async (req, res) => {
  try {
    const { email, firstName, lastName, phoneNumber, DOB, password, gId } =
      req.body;

    // Data validation checks
    if (
      !email ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !DOB ||
      !password
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // Password complexity checks
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({
        error: "Account exists. Sign in as a partner or customer",
      });
    }

    const hashedPassword = await hashPassword(password);
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    const user = await User.create({
      email,
      password: hashedPassword,
      account_type: "user",
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      dob: DOB,
      is_verified: false,
      code: verificationCode,
    });

    // Save the uploaded document to the MediaTag schema
    if (req.file) {
      const mediaTag = new MediaTag({
        listing_id: user._id,
        media_name: req.file.filename,
        media_location: req.file.path,
        size: req.file.size,
      });
      await mediaTag.save();
    }

    // Call the external function to send the verification code
    await sendVerificationEmail(email, verificationCode);

    return res.status(201).json({
      message: "Check your email for verification code",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        DOB: user.dob,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      error: "Server error, please try again later",
    });
  }
};
const sendVerificationEmail = async (email, code) => {
  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your smashapartments.com Account Creation Code</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <header style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 2px solid #221f60;">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100px" height="100px" viewBox="0 0 1000 1000" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd">
            <g>
                <path style="opacity:0.988" fill="#221f60" d="M 452.5,184.5 C 486.74,184.171 520.906,184.504 555,185.5C 588.705,260.408 622.538,335.241 656.5,410C 622.833,410.667 589.167,410.667 555.5,410C 538.004,369.517 520.504,329.017 503,288.5C 490.962,317.406 478.796,346.239 466.5,375C 508.129,466.425 549.629,557.925 591,649.5C 592.15,651.754 592.484,654.087 592,656.5C 581.443,682.615 570.609,708.615 559.5,734.5C 498.837,735.5 438.17,735.833 377.5,735.5C 377.5,710.5 377.5,685.5 377.5,660.5C 413.3,659.483 448.967,657.983 484.5,656C 444.833,563 405.167,470 365.5,377C 394.915,313.005 423.915,248.838 452.5,184.5 Z"/>
            </g>
            <g>
                <path style="opacity:0.984" fill="#221f60" d="M 327.5,463.5 C 345.423,501.21 362.423,539.543 378.5,578.5C 356.574,630.851 334.241,683.017 311.5,735C 276.162,735.833 240.829,735.667 205.5,734.5C 245.907,644.022 286.573,553.689 327.5,463.5 Z"/>
            </g>
            <g>
                <path style="opacity:0.987" fill="#221f60" d="M 546.5,465.5 C 591.739,465.17 636.905,465.503 682,466.5C 722.733,555.963 762.9,645.629 802.5,735.5C 766.5,735.5 730.5,735.5 694.5,735.5C 665.968,667.747 637.135,600.08 608,532.5C 587.576,531.507 567.076,531.173 546.5,531.5C 546.5,509.5 546.5,487.5 546.5,465.5 Z"/>
            </g>
        </svg>
    </header>
    
    <main style="padding: 20px;">
        <h1 style="color: #221f60; font-family: 'Montserrat', Arial, sans-serif; font-weight: 700;">Verification OTP</h1>
        <p>Hello,</p>
        <p>Thank you for creating an account with smashapartments.com. To complete your registration, please use the following code:</p>
        <p style="font-size: 24px; font-weight: 700; color: #ff8c00; text-align: center;">${code}</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <p>Happy booking!</p>
        <p>The smashapartments.com Team</p>
    </main>
    
    <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px;">
        <p>This email is from smashapartments.com. If you are receiving this email, it means that you or someone else used this email address to create an account with us.</p>
        <p>For support, please contact us at: <a href="mailto:support@smashapartments.com" style="color: #ff8c00;">support@smashapartments.com</a></p>
        <p>&copy; 2024 smashapartments.com. All rights reserved.</p>
        <p><a href="#" style="color: #ff8c00;">Privacy Policy</a> | <a href="#" style="color: #ff8c00;">Terms of Service</a></p>
    </footer>
</body>
</html>
  `;

  const mailOptions = {
    from: sender,
    to: [email],
    subject: "Verify Your smashapartments.com Account",
    text: `Your verification code is: ${code}`,
    html: htmlTemplate,
    category: "Verification",
    
  };

  try {
    const result = await transport.sendMail(mailOptions);
    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
// Login endpoint
const sendLoginEmail = async (email, loginTime) => {
  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Notification - smashapartments.com</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <header style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 2px solid #221f60;">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100px" height="100px" viewBox="0 0 1000 1000" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd">
            <!-- SVG content here (same as in the verification email) -->
        </svg>
    </header>
    
    <main style="padding: 20px;">
        <h1 style="color: #221f60; font-family: 'Montserrat', Arial, sans-serif; font-weight: 700;">Login Notification</h1>
        <p>Hello,</p>
        <p>We detected a new sign-in to your smashapartments.com account.</p>
        <p>Time of login: <strong>${loginTime}</strong></p>
        <p>If this was you, no further action is needed. If you didn't sign in to your account at this time, please contact our support team immediately.</p>
        <p>Thank you for using smashapartments.com!</p>
        <p>Best regards,</p>
        <p>The smashapartments.com Team</p>
    </main>
    
    <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px;">
        <p>This is an automated message from smashapartments.com. Please do not reply to this email.</p>
        <p>For support, please contact us at: <a href="mailto:support@smashapartments.com" style="color: #ff8c00;">support@smashapartments.com</a></p>
        <p>&copy; 2024 smashapartments.com. All rights reserved.</p>
        <p><a href="#" style="color: #ff8c00;">Privacy Policy</a> | <a href="#" style="color: #ff8c00;">Terms of Service</a></p>
    </footer>
</body>
</html>
  `;

  const mailOptions = {
    from: sender,
    to: [email],
    subject: "New Login to Your smashapartments.com Account",
    text: `A new login to your account was detected at ${loginTime}. If this wasn't you, please contact support.`,
    html: htmlTemplate,
    category: "Login Notification",
    
  };

  try {
    const result = await transport.sendMail(mailOptions);
    console.log("Login notification email sent successfully:", result);
  } catch (error) {
    console.error("Error sending login notification email:", error);
    throw error;
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "User not found",
      });
    }

    // Check if the user is verified
    if (!user.is_verified) {
      return res.json({
        error:
          "Please verify your email. Check your inbox for the verification code.",
      });
    }

    // Compare the password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.json({
        error: "Invalid credentials",
      });
    }

    // Update account_type if it is 'partner'
    if (user.account_type === "partner") {
      user.account_type = "user_partner";
      await user.save(); // Save the updated account_type
    }

    // Sign the JWT token and add 'interface': 'user' to the payload
    jwt.sign(
      {
        email: user.email,
        id: user._id,
        first_name: user.first_name,
        interface: "user", // Add 'interface': 'user' to the JWT payload
      },
      process.env.JWT_SECRET,

      {},
      async (err, token) => {
        if (err) throw err;

        // Send login notification email
        const loginTime = new Date().toLocaleString();
        await sendLoginEmail(user.email, loginTime);

        res.cookie("token", token).json(user);
      }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return res.json({
      error: "Server error, please try again later",
    });
  }
};

const loginPartner = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "User not found",
      });
    }

    // Check if the user is verified
    if (!user.is_verified) {
      return res.json({
        error:
          "Please verify your email. Check your inbox for the verification code.",
      });
    }

    // Compare the password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.json({
        error: "Invalid credentials",
      });
    }

    // Update account_type if necessary
    if (user.account_type === "user") {
      user.account_type = "user_partner";
      await user.save(); // Save the updated account_type to the database
    }

    // Sign the JWT token and add 'interface': 'partner' to the payload
    jwt.sign(
      {
        email: user.email,
        id: user._id,
        first_name: user.first_name,
        interface: "partner", // Add 'interface': 'partner' to the JWT payload
      },
      process.env.JWT_SECRET,
      {},
      async (err, token) => {
        if (err) throw err;

        // Send login notification email
        const loginTime = new Date().toLocaleString();
        try {
          await sendLoginEmail(user.email, loginTime);
        } catch (emailError) {
          console.error("Error sending login notification email:", emailError);
        }

        res.cookie("token", token).json(user);
      }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return res.json({
      error: "Server error, please try again later",
    });
  }
};
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "User not found",
      });
    }

    // Check if the user is verified
    if (!user.is_verified) {
      return res.json({
        error:
          "Please verify your email. Check your inbox for the verification code.",
      });
    }

    // Compare the password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.json({
        error: "Invalid credentials",
      });
    }

    // Update account_type if necessary
    if (user.account_type === "user") {
      user.account_type = "user_partner";
      await user.save(); // Save the updated account_type to the database
    }

    // Sign the JWT token and add 'interface': 'partner' to the payload
    jwt.sign(
      {
        email: user.email,
        id: user._id,
        first_name: user.first_name,
        interface: "admin", // Add 'interface': 'partner' to the JWT payload
      },
      process.env.JWT_SECRET,
      {},
      async (err, token) => {
        if (err) throw err;

        const loginTime = new Date().toLocaleString();
        try {
          await sendLoginEmail(user.email, loginTime);
        } catch (emailError) {
          console.error("Error sending login notification email:", emailError);
        }

        res.cookie("token", token).json(user);
      }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return res.json({
      error: "Server error, please try again later",
    });
  }
};
const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.sendStatus(200);
};

const createService = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const parsedBody = {
      serviceName: req.body.serviceName,
      description: req.body.description,
      carMakeModel: req.body.carMakeModel,
      carColor: req.body.carColor,
      plateNumber: req.body.plateNumber,
      driverName: req.body.driverName,
      driverLicenseNumber: req.body.driverLicenseNumber,
      driverPhoneNumber: req.body.driverPhoneNumber,
      driverEmail: req.body.driverEmail,
      pickupPrice: parseFloat(req.body.pickupPrice),
      extraLuggage: parseInt(req.body.extraLuggage),
      waitingTime: parseInt(req.body.waitingTime),
      availableFrom: new Date(req.body.availableFrom),
      availableTo: new Date(req.body.availableTo),
      cancellationPolicy: req.body.cancellationPolicy,
      refundPolicy: req.body.refundPolicy,
      contactName: req.body.contactName,
      contactPhone: req.body.contactPhone,
      contactEmail: req.body.contactEmail,
      owner: user._id,
    };

    const validationErrors = [];
    if (isNaN(parsedBody.pickupPrice))
      validationErrors.push("Invalid pickup price");
    if (isNaN(parsedBody.extraLuggage))
      validationErrors.push("Invalid extra luggage");
    if (isNaN(parsedBody.waitingTime))
      validationErrors.push("Invalid waiting time");
    if (isNaN(parsedBody.availableFrom.getTime()))
      validationErrors.push("Invalid available from date");
    if (isNaN(parsedBody.availableTo.getTime()))
      validationErrors.push("Invalid available to date");

    if (!req.files || req.files.length < 4 || req.files.length > 15) {
      validationErrors.push(
        `Please upload between 4 and 15 images. You uploaded ${
          req.files ? req.files.length : 0
        }.`
      );
    }

    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: validationErrors });
    }

    const newService = new Service(parsedBody);
    await newService.save();

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const mediaTag = new MediaTag({
          listing_id: newService._id,
          media_name: file.filename,
          media_location: file.path,
          size: file.size,
        });
        await mediaTag.save();
      }
    }
    res
      .status(201)
      .json({ message: "Service created successfully", service: newService });
  } catch (error) {
    console.error("Error creating service:", error);
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res
        .status(400)
        .json({ error: "Validation failed", details: validationErrors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFullProfile = async (req, res) => {
  const { token } = req.cookies; // Make sure token is set in cookies

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    try {
      const user = await User.findOne({ email: decoded.email });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userProfile = {
        _id: user._id,
        email: user.email,
        account_type: user.account_type,
        first_name: user.first_name,
        last_name: user.last_name,
        address: user.address,
        contact_email: user.contact_email,
        phone_number: user.phone_number,
        date_joined: user.date_joined,
        dob: user.dob,
        status: user.status,
        role: user.role,
        interface: decoded.interface,
      };

      res.json(userProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
};
const updatePartnerDetails = async (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
      if (err) {
        return res.json({ error: "Invalid token" });
      }
      try {
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
          return res.json({ error: "Partner not found" });
        }

        // Update partner details
        const {
          first_name,
          last_name,
          phone_number,
          contact_email,
          dob,
          address,
        } = req.body;
        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.phone_number = phone_number || user.phone_number;
        user.contact_email = contact_email || user.contact_email;
        user.dob = dob || user.dob;
        user.address = address || user.address;

        await user.save();

        res.json({
          email: user.email,
          account_type: user.account_type,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          contact_email: user.contact_email,
          dob: user.dob,
          address: user.address,
          interface: "partner",
        });
      } catch (error) {
        res.json({ error: "Internal server error" });
      }
    });
  } else {
    res.json({ error: "No token provided" });
  }
};

const updateUserDetails = async (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
      if (err) {
        return res.json({ error: "Invalid token" });
      }
      try {
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
          return res.json({ error: "User not found" });
        }

        // Update user details
        const { first_name, last_name, phone_number, dob } = req.body;
        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.phone_number = phone_number || user.phone_number;
        user.dob = dob || user.dob;

        await user.save();

        res.json({
          email: user.email,
          account_type: user.account_type,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          dob: user.dob,
          interface: "user",
        });
      } catch (error) {
        res.json({ error: "Internal server error" });
      }
    });
  } else {
    res.json({ error: "No token provided" });
  }
};

const updatePayment = async (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
      if (err) {
        return res.json({ error: "Invalid token" });
      }
      try {
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
          return res.json({ error: "User not found" });
        }

        let paymentMethod = await PaymentMethod.findOne({ user: user._id });

        if (!paymentMethod) {
          paymentMethod = new PaymentMethod({
            user: user._id,
            name_on_card: req.body.name_on_card || "",
            card_number: req.body.card_number || "",
            card_exp_month: req.body.card_exp_month || "",
            card_exp_year: req.body.card_exp_year || "",
            cvv: req.body.cvv || "",
          });
        } else {
          paymentMethod.name_on_card =
            req.body.name_on_card || paymentMethod.name_on_card;
          paymentMethod.card_number =
            req.body.card_number || paymentMethod.card_number;
          paymentMethod.card_exp_month =
            req.body.card_exp_month || paymentMethod.card_exp_month;
          paymentMethod.card_exp_year =
            req.body.card_exp_year || paymentMethod.card_exp_year;
          paymentMethod.cvv = req.body.cvv || paymentMethod.cvv;
        }

        await paymentMethod.save();

        res.json({
          message: "Payment method updated successfully",
          payment_method: paymentMethod,
        });
      } catch (error) {
        console.error("Update payment error:", error);
        res
          .status(400)
          .json({ error: error.message || "Internal server error" });
      }
    });
  } else {
    res.status(401).json({ error: "No token provided" });
  }
};

const getPaymentMethod = async (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err);
        return res.status(401).json({ error: "Invalid token" });
      }
      try {
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
          console.error("User not found:", decoded.email);
          return res.status(404).json({ error: "User not found" });
        }

        // Find payment method using the 'user' field
        const paymentMethod = await PaymentMethod.findOne({ user: user._id });
        if (!paymentMethod) {
          console.error("Payment method not found for user ID:", user._id);
          return res.status(404).json({ error: "Payment method not found" });
        }

        // Return payment method details
        res.json({
          payment_method: {
            name_on_card: paymentMethod.name_on_card,
            card_number: paymentMethod.card_number,
            card_exp_month: paymentMethod.card_exp_month,
            card_exp_year: paymentMethod.card_exp_year,
            cvv: paymentMethod.cvv,
          },
        });
      } catch (error) {
        console.error("Error fetching payment method:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  } else {
    res.status(401).json({ error: "No token provided" });
  }
};

// const createPartner = async (req, res) => {
//   try {
//     // Extract user details from request body
//     const { email, firstName, lastName, phoneNumber, password } = req.body;

//     // Check if all required fields are provided
//     if (!email || !firstName || !lastName || !phoneNumber || !password) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     // Generate 6-digit verification code
//     const verificationCode = crypto.randomInt(100000, 999999).toString();

//     // Hash the password before saving
//     const hashedPassword = await hashPassword(password);

//     // Create a new user with the provided details
//     const newUser = new User({
//       email,
//       first_name: firstName,
//       last_name: lastName,
//       phone_number: phoneNumber,
//       password: hashedPassword,
//       account_type: "partner",
//       role: "partner",
//       is_verified: false,
//       code: verificationCode,
//     });

//     // Save the new user to the database
//     await newUser.save();

//     // Send verification email
//     await sendVerificationEmail(email, verificationCode);

//     // Respond with success message
//     res.status(201).json({ message: "Check your email for verification code" });
//   } catch (error) {
//     console.error("Error creating partner account:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const createPartner = async (req, res) => {
  try {
    const { email, firstName, lastName, phoneNumber, DOB, password, address } =
      req.body;

    // Data validation checks
    if (
      !email ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !DOB ||
      !password
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // Password complexity checks
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({
        error: "Account exists. Sign in as a partner or customer",
      });
    }

    const hashedPassword = await hashPassword(password);
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    const user = await User.create({
      email,
      password: hashedPassword,
      account_type: "partner",
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      dob: DOB,
      address: address,
      role: "partner",
      is_verified: false,
      code: verificationCode,
    });

    // Save the uploaded document to the MediaTag schema
    if (req.file) {
      const mediaTag = new MediaTag({
        listing_id: user._id,
        media_name: req.file.filename,
        media_location: req.file.path,
        size: req.file.size,
      });
      await mediaTag.save();
    }

    await sendVerificationEmail(email, verificationCode);

    return res.status(201).json({
      message: "Check your email for verification code",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        DOB: user.dob,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      error: "Server error, please try again later",
    });
  }
};
module.exports = {
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
  createOfficeListing,
  createService,
  createRental,
  getListings,
  getListingData,
  likeProperty,
  checkLiked,
  verifyPaymentAndBook,
  verifyPaymentAndBookCooffice,
  getBookings,
  getAllListings,
  getInactiveListings,
  getUserBookings,
  getCurrentBookings,
  getCooffices,
  getCoOfficeData,
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
  updateStatus,
  getEndedBookings,
  getAllBookings,
  updatebookingstatus,
  loginPartner,
  verifyAccount,
  resetPassword,
  loginAdmin,
  getUpcomingBookingsGeneral,
  activeUsers,
  getallActiveListingsGeneral,
  getAllInactiveListingsGeneral,
  getAllListingsGeneral,
  getEndedBookingsGeneral,
  getAllBookingsGeneral,
  allUsers,
  getUsers,
  updateUserStatus,
  revenue,
  bookingStatus,
  bookingsOverTime,
  revenueByListing,
  userAnalytics,
  usersJoiningOverTime,
  bookingData,
  payoutDetails,
  upload,
  uploadReceipt,
  uploadReceiptPickup,
  uploadReceiptRental,
  uploadReceiptOffice,
  getStayListing,
  getServiceListing,
  getRentalListing,
  getOfficeListing,
  updateListing,
  updateRental,
  updateOffice,
  updateService,
  approveListing,
  verifyAccountPartner,
  getReview,
  MakePayout,
  UpdateActionStatus,
  PendingActions,
  Review,
};
