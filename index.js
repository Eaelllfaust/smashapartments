const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { mongoose } = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const path = require('path');

// CORS configuration
const corsOptions = {
  origin: "https://smashapartments.com", // Replace with your frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
};
app.use(cors(corsOptions));

// Database connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => { console.log("Database connected"); })
  .catch((err) => { console.log("Database not connected", err); });

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('/uploads'));

// Serve static files from the client/dist directory
app.use(express.static(path.join(__dirname, '/client/dist')));

// Routes
app.use("/", require("./routes/authRoutes"));

// Catch-all route to serve index.html for all client-side routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/dist/index.html'));
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
