const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const PaymentMethod = require("../models/payment_method");
const StayListing = require("../models/stays_listing");
const LikedItem = require("../models/likeditem");
const Service = require("../models/service");
const OfficeSpace = require("../models/cooffice");
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
const Payout = require("../models/payout");
const crypto = require('crypto');
const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

const TOKEN = "6be1e8192e8e628b29b60c5455c955f2";

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

    // Fetch all earnings for the user
    const earnings = await PartnerEarning.find({ userId: userId });

    // Calculate total earnings
    const totalEarnings = earnings.reduce(
      (sum, earning) => sum + earning.amount,
      0
    );

    res.status(200).json({ totalEarnings });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    res.status(500).json({ error: "Failed to fetch earnings" });
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

    const bookings = await CoofficeBooking.find({
      userId,
      status: { $in: ["confirmed", "reserved", "cancelled", "ended"] },
    }).lean();

    if (!bookings.length) {
      return res
        .status(404)
        .json({ error: "No office spaces found for this user" });
    }

    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const officeDetails = await OfficeSpace.findById(
            booking.officeId
          ).lean();

          const mediaTags = await MediaTag.find({
            listing_id: booking.officeId,
          }).lean();

          return {
            ...booking,
            officeDetails,
            mediaTags,
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

    res.status(200).json(bookingsWithDetails);
  } catch (error) {
    console.error("Error fetching user office spaces:", error);
    res.status(500).json({ error: "Failed to fetch user office spaces" });
  }
};

const cancelService = async (req, res) => {
  const { bookingId } = req.params; // Extract bookingId from the request parameters

  try {
    // Find the booking by ID and update its status to 'cancelled'
    const booking = await ServiceBooking.findByIdAndUpdate(
      bookingId,
      { status: "cancelled" },
      { new: true }
    );

    // If booking not found, return a 404 response
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Return a 200 response with the updated booking
    res
      .status(200)
      .json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    // Log any error and return a 500 response
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const cancelRental = async (req, res) => {
  const { rentalId } = req.params;

  try {
    // Find the rental by ID and update its status to 'cancelled'
    const rental = await Rental.findByIdAndUpdate(
      rentalId,
      { status: "cancelled" },
      { new: true }
    );

    // If rental not found, return a 404 response
    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    // Return a 200 response with the updated rental
    res.status(200).json({ message: "Rental cancelled successfully", rental });
  } catch (error) {
    // Log any error and return a 500 response
    console.error("Error cancelling rental:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findByIdAndUpdate(
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

    // Combine rental data with images and construct image URLs
    const rentalWithImages = {
      ...rental,
      images: images.map((image) => ({
        ...image,
        url: `${image.media_location}`, // Construct image URL
      })),
    };

    res.status(200).json(rentalWithImages);
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

    // Fetch images for each rental
    const rentalsWithImages = await Promise.all(
      rentals.map(async (rental) => {
        const images = await MediaTag.find({ listing_id: rental._id }).lean();
        return {
          ...rental,
          images,
          ratings: Math.random() * 5, // Random rating between 0 and 5
          reviews: Math.floor(Math.random() * 500), // Random number of reviews
        };
      })
    );

    res.status(200).json(rentalsWithImages);
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
      status: "confirmed",
    });

    await newServiceBooking.save();

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

    // Combine service data with images and construct image URLs
    const serviceWithImages = {
      ...service,
      images: images.map((image) => ({
        ...image,
        url: `${image.media_location}`, // Construct image URL
      })),
    };

    res.status(200).json(serviceWithImages);
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
      // If no pickups are found, fetch without filters
      pickups = await Service.find()
        .skip(Number(offset) || 0)
        .limit(Number(limit) || 10)
        .lean();
    }

    const pickupsWithImages = await Promise.all(
      pickups.map(async (pickup) => {
        const images = await MediaTag.find({ listing_id: pickup._id }).lean();
        return { ...pickup, images };
      })
    );

    res.status(200).json(pickupsWithImages);
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
    // Fetch associated service details and media for each pickup
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
          // Return pickup with service details and media
          return {
            ...pickup,
            serviceDetails,
            media, // Include media in the response
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

    // Combine cooffice data with images and construct image URLs
    const coofficeWithImages = {
      ...cooffice,
      images: images.map((image) => ({
        ...image,
        url: `${image.media_location}`, // Construct image URL
      })),
    };

    res.status(200).json(coofficeWithImages);
  } catch (error) {
    console.error("Error fetching cooffice data:", error);
    res.status(500).json({ error: "Failed to fetch cooffice data" });
  }
};

const getCurrentRentals = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch rentals with status 'confirmed' or 'reserved'
    const rentals = await Rental.find({
      userId,
      status: { $in: ["confirmed", "reserved", "cancelled", "ended"] },
    }).lean();

    if (!rentals.length) {
      return res.status(404).json({ error: "No rentals found for this user" });
    }

    // Fetch associated car rental details and media for each rental
    const rentalsWithDetails = await Promise.all(
      rentals.map(async (rental) => {
        try {
          // Fetch car rental details
          const carRental = await CarRental.findById(rental.rentalId).lean();

          // Fetch associated media
          const media = await MediaTag.find({
            listing_id: rental.rentalId,
          }).lean();

          // Return rental with car rental details and media
          return {
            ...rental,
            carRentalDetails: carRental,
            media,
            driverPhoneNumber: carRental?.driverPhoneNumber || "Not provided",
            driverEmail: carRental?.driverEmail || "Not provided",
            carNameModel: carRental?.carNameModel || "Unknown",
          };
        } catch (err) {
          console.error(
            `Error fetching details for rental ${rental._id}:`,
            err
          );
          return rental; // Return rental with default values if there's an error
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

    // Fetch bookings with status 'confirmed' or 'reserved'
    const bookings = await Booking.find({
      userId,
      status: { $in: ["confirmed", "reserved", "cancelled", "ended"] },
    }).lean();

    if (!bookings.length) {
      return res.status(404).json({ error: "No bookings found for this user" });
    }

    // Fetch associated media and stay listing details for each booking
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        try {
          // Fetch associated media
          const media = await MediaTag.find({
            listing_id: booking.listingId,
          }).lean();

          // Fetch stay listing details
          const stayListing = await StayListing.findById(
            booking.listingId
          ).lean();

          return {
            ...booking,
            media,
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
          return booking; // Return booking with default values if there's an error
        }
      })
    );

    res.status(200).json(bookingsWithDetails);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Failed to fetch user bookings" });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch total bookings and reserved bookings from all schemas
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
const updatebookingstatus = async (req, res) => {
  const { bookingId, status, type } = req.body;

  try {
    let booking;

    switch (type) {
      case "service":
        booking = await ServiceBooking.findById(bookingId);
        break;
      case "rental":
        booking = await Rental.findById(bookingId);
        break;
      case "cooffice":
        booking = await CoofficeBooking.findById(bookingId);
        break;
      case "stay":
        booking = await Booking.findById(bookingId);
        break;
      default:
        return res.status(400).json({ error: "Invalid booking type" });
    }

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update the status
    booking.status = status;

    // Save the updated booking
    await booking.save();

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

const getAllBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all listings owned by the user
    const stayListings = await StayListing.find({ owner: userId })
      .select("_id")
      .lean();
    const officeSpaces = await OfficeSpace.find({ owner: userId })
      .select("_id")
      .lean();
    const carRentals = await CarRental.find({ owner: userId })
      .select("_id")
      .lean();
    const services = await Service.find({ owner: userId }).select("_id").lean();

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

    // Combine all bookings into one array with their type and user info
    const allBookings = [
      ...stayBookings.map((booking) => ({
        ...booking,
        type: "stay",
        user: userMap[booking.userId],
      })),
      ...officeBookings.map((booking) => ({
        ...booking,
        type: "office",
        user: userMap[booking.userId],
      })),
      ...rentalBookings.map((booking) => ({
        ...booking,
        type: "rental",
        user: userMap[booking.userId],
      })),
      ...serviceBookings.map((booking) => ({
        ...booking,
        type: "service",
        user: userMap[booking.userId],
      })),
    ];

    // Respond with all bookings
    res.status(200).json(allBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

module.exports = getAllBookings;

const getUpcomingBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();

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
      totalPrice,
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
      totalPrice,
      paymentReference: reference,
      status: "confirmed",
    });

    await newBooking.save();

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
      status: "confirmed",
    });

    await newRentalBooking.save();

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
    const { reference, officeId, checkInDate, checkOutDate, totalPrice } =
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
      totalPrice,
      paymentReference: reference,
      status: "confirmed",
    });

    await newCoofficeBooking.save();

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
    const { id } = req.params; // Get listing ID from request parameters

    // Fetch listing data by ID
    const listing = await StayListing.findById(id).lean();

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Fetch associated images
    const images = await MediaTag.find({ listing_id: id }).lean();

    // Combine listing data with images and construct image URLs
    const listingWithImages = {
      ...listing,
      images: images.map((image) => ({
        ...image,
        url: `${image.media_location}`, // Construct image URL
      })),
    };

    res.status(200).json(listingWithImages);
  } catch (error) {
    console.error("Error fetching listing data:", error);
    res.status(500).json({ error: "Failed to fetch listing data" });
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
    } = req.query;

    const filters = {};

    // Add case-insensitive filter for location (city or state)
    if (location) {
      filters.$or = [
        { city: { $regex: new RegExp(location, "i") } },
        { state_name: { $regex: new RegExp(location, "i") } },
      ];
    }

    // Add filter for office type
    if (officeType) {
      filters.office_type = { $regex: new RegExp(officeType, "i") };
    }

    // Add filters for amenities and rules
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

    // Add filters for price (using price_per_day)
    if (minPrice) filters.price_per_day = { $gte: Number(minPrice) };
    if (maxPrice) {
      filters.price_per_day = filters.price_per_day || {};
      filters.price_per_day.$lte = Number(maxPrice);
    }

    // Add filters for availability
    if (availableFrom)
      filters.available_from = { $lte: new Date(availableFrom) };
    if (availableTo) filters.available_to = { $gte: new Date(availableTo) };

    // Add filter for minimum number of desks
    if (minDesks) filters.number_of_desks = { $gte: Number(minDesks) };

    // Add filter for minimum office size
    if (minSize) filters.size_of_office = { $gte: Number(minSize) };

    let cooffices = await OfficeSpace.find(filters)
      .skip(Number(offset) || 0)
      .limit(Number(limit) || 10)
      .lean();

    if (cooffices.length === 0) {
      // If no cooffices are found, fetch without filters
      cooffices = await OfficeSpace.find()
        .skip(Number(offset) || 0)
        .limit(Number(limit) || 10)
        .lean();
    }

    const coofficesWithImages = await Promise.all(
      cooffices.map(async (cooffice) => {
        const images = await MediaTag.find({
          office_space_id: cooffice._id,
        }).lean();
        return { ...cooffice, images };
      })
    );

    res.status(200).json(coofficesWithImages);
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
      filters.city = { $regex: new RegExp(location, "i") }; // Case-insensitive search for location
    }

    // Add filter for date
    if (date) {
      filters.available_from = { $lte: new Date(date) }; // Ensure the stay is available before or on the selected date
    }

    // Add filter for people (maximum occupancy)
    if (people) {
      filters.maximum_occupancy = { $gte: Number(people) }; // Ensure the stay can accommodate the specified number of people
    }

    // Add filter for rooms
    if (rooms) {
      filters.number_of_rooms = { $gte: Number(rooms) }; // Ensure the stay has at least the specified number of rooms
    }

    // Add additional filters for amenities
    if (pool) filters.pool = pool === "true";
    if (wifi) filters.wifi = wifi === "true";
    if (parking) filters.parking = parking === "true";
    if (gym) filters.gym = gym === "true";

    // Add filters for price
    if (minPrice) filters.price_per_night = { $gte: Number(minPrice) };
    if (maxPrice) {
      filters.price_per_night = filters.price_per_night || {};
      filters.price_per_night.$lte = Number(maxPrice);
    }

    // Add filter for ratings
    if (ratings) filters.ratings = Number(ratings);

    let listings = await StayListing.find(filters)
      .skip(offset) // Skip the first 'offset' listings
      .limit(limit) // Limit the number of listings to 'limit'
      .lean();

    if (listings.length === 0) {
      // If no listings are found, fetch without filters
      listings = await StayListing.find().skip(offset).limit(limit).lean();
    }

    const listingsWithImages = await Promise.all(
      listings.map(async (listing) => {
        const images = await MediaTag.find({ listing_id: listing._id }).lean();
        return { ...listing, images };
      })
    );

    res.status(200).json(listingsWithImages);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

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

    // Parse and validate fields
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

    // Validate parsed data
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

    return res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    console.error("Error during account verification:", error);
    return res.status(500).json({ error: "Server error, please try again later" });
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
    const newPassword = crypto.randomBytes(6).toString('hex');

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
    <title>Your SmashApartment.com Password Reset</title>
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
        <p>Your password for SmashApartment.com has been reset. Your new password is:</p>
        <p style="font-size: 24px; font-weight: 700; color: #ff8c00; text-align: center;">${newPassword}</p>
        <p>Please log in with this password and change it immediately for security reasons.</p>
        <p>If you didn't request this password reset, please contact our support team immediately.</p>
        <p>The SmashApartment.com Team</p>
    </main>
    
    <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px;">
        <p>This email is from SmashApartment.com. If you are receiving this email, it means that a password reset was requested for your account.</p>
        <p>For support, please contact us at: <a href="mailto:support@smashapartment.com" style="color: #ff8c00;">support@smashapartment.com</a></p>
        <p>&copy; 2024 SmashApartment.com. All rights reserved.</p>
        <p><a href="#" style="color: #ff8c00;">Privacy Policy</a> | <a href="#" style="color: #ff8c00;">Terms of Service</a></p>
    </footer>
</body>
</html>
  `;

  const mailOptions = {
    from: sender,
    to: [email],
    subject: "Your SmashApartment.com Password Has Been Reset",
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

// Register endpoint
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email
    if (!email) {
      return res.json({
        error: "Email is required",
      });
    }

    // Validate password
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 characters",
      });
    }

    // Check if email already exists
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Account exists. Sign in as a partner or customer",
      });
    }

    // Generate 6-digit verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // Hash the password using the helper function
    const hashedPassword = await hashPassword(password);

    // Create the user with hashed password and verification code
    const user = await User.create({
      email,
      password: hashedPassword,
      is_verified: false,
      code: verificationCode,
    });

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    // Return the created user (without password)
    return res.json({
      message: "Check your email for verification code",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.json({
      error: "Server error, please try again later",
    });
  }
};

// Function to send verification email using Mailtrap
const sendVerificationEmail = async (email, code) => {
  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your SmashApartment.com Account Creation Code</title>
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
        <p>Thank you for creating an account with SmashApartment.com. To complete your registration, please use the following code:</p>
        <p style="font-size: 24px; font-weight: 700; color: #ff8c00; text-align: center;">${code}</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <p>Happy booking!</p>
        <p>The SmashApartment.com Team</p>
    </main>
    
    <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px;">
        <p>This email is from SmashApartment.com. If you are receiving this email, it means that you or someone else used this email address to create an account with us.</p>
        <p>For support, please contact us at: <a href="mailto:support@smashapartment.com" style="color: #ff8c00;">support@smashapartment.com</a></p>
        <p>&copy; 2024 SmashApartment.com. All rights reserved.</p>
        <p><a href="#" style="color: #ff8c00;">Privacy Policy</a> | <a href="#" style="color: #ff8c00;">Terms of Service</a></p>
    </footer>
</body>
</html>
  `;

  const mailOptions = {
    from: sender,
    to: [email],
    subject: "Verify Your SmashApartment.com Account",
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
    <title>Login Notification - SmashApartment.com</title>
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
        <p>We detected a new sign-in to your SmashApartment.com account.</p>
        <p>Time of login: <strong>${loginTime}</strong></p>
        <p>If this was you, no further action is needed. If you didn't sign in to your account at this time, please contact our support team immediately.</p>
        <p>Thank you for using SmashApartment.com!</p>
        <p>Best regards,</p>
        <p>The SmashApartment.com Team</p>
    </main>
    
    <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px;">
        <p>This is an automated message from SmashApartment.com. Please do not reply to this email.</p>
        <p>For support, please contact us at: <a href="mailto:support@smashapartment.com" style="color: #ff8c00;">support@smashapartment.com</a></p>
        <p>&copy; 2024 SmashApartment.com. All rights reserved.</p>
        <p><a href="#" style="color: #ff8c00;">Privacy Policy</a> | <a href="#" style="color: #ff8c00;">Terms of Service</a></p>
    </footer>
</body>
</html>
  `;

  const mailOptions = {
    from: sender,
    to: [email],
    subject: "New Login to Your SmashApartment.com Account",
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
        error: "Please verify your email. Check your inbox for the verification code.",
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
    if (user.account_type === 'partner') {
      user.account_type = 'user_partner';
      await user.save(); // Save the updated account_type
    }

    // Sign the JWT token and add 'interface': 'user' to the payload
    jwt.sign(
      { 
        email: user.email, 
        id: user._id, 
        first_name: user.first_name,
        interface: 'user'  // Add 'interface': 'user' to the JWT payload
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
        error: "Please verify your email. Check your inbox for the verification code.",
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
    if (user.account_type === 'user') {
      user.account_type = 'user_partner';
      await user.save(); // Save the updated account_type to the database
    }

    // Sign the JWT token and add 'interface': 'partner' to the payload
    jwt.sign(
      { 
        email: user.email, 
        id: user._id, 
        first_name: user.first_name,
        interface: 'partner'  // Add 'interface': 'partner' to the JWT payload
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
          // Continue with login process even if email fails
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
        contact_email: user.contact_email,
        phone_number: user.phone_number,
        date_joined: user.date_joined,
        status: user.status,
        role: user.role,
        interface: decoded.interface
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
        const { first_name, last_name, phone_number, contact_email, address } =
          req.body;
        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.phone_number = phone_number || user.phone_number;
        user.contact_email = contact_email || user.contact_email;
        user.address = address || user.address;

        await user.save();

        // Return updated user profile
        res.json({
          email: user.email,
          account_type: user.account_type,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          contact_email: user.contact_email,
          address: user.address,
          interface: 'partner'
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
        const { first_name, last_name, phone_number } = req.body;
        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.phone_number = phone_number || user.phone_number;

        await user.save();

        // Return updated user profile
        res.json({
          email: user.email,
          account_type: user.account_type,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          interface: 'user'
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
  const { token } = req.cookies; // Assuming the token is stored in cookies

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
      if (err) {
        return res.json({ error: "Invalid token" });
      }
      try {
        // Find the user using the decoded email
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
          return res.json({ error: "User not found" });
        }

        // Find the payment method associated with the user
        let paymentMethod = await PaymentMethod.findOne({ user: user._id });

        if (!paymentMethod) {
          // Create a new payment method if it does not exist
          paymentMethod = new PaymentMethod({
            user: user._id,
            name_on_card: req.body.name_on_card || "",
            card_number: req.body.card_number || "",
            card_exp_month: req.body.card_exp_month || "",
            card_exp_year: req.body.card_exp_year || "",
            cvv: req.body.cvv || "",
          });
        } else {
          // Update payment method if it exists
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

        // Return updated payment method
        res.json({
          message: "Payment method updated successfully",
          payment_method: paymentMethod,
        });
      } catch (error) {
        // Send detailed error message from MongoDB
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
        // Find user
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

 const createPartner = async (req, res) => {
  try {
    // Extract user details from request body
    const { email, firstName, lastName, phoneNumber, password } = req.body;

    // Check if all required fields are provided
    if (!email || !firstName || !lastName || !phoneNumber || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Generate 6-digit verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // Hash the password before saving
    const hashedPassword = await hashPassword(password);

    // Create a new user with the provided details
    const newUser = new User({
      email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      password: hashedPassword,
      account_type: "partner",
      role: "partner",
      is_verified: false,
      code: verificationCode,
    });

    // Save the new user to the database
    await newUser.save();

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    // Respond with success message
    res.status(201).json({ message: "Check your email for verification code" });
  } catch (error) {
    console.error("Error creating partner account:", error);
    res.status(500).json({ error: "Internal server error" });
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
  upload,
};
