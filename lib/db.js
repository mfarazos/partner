const url = require("url");
const mongoose = require("mongoose");
const path = require("path");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://waliiqbal2020:QwXfF6vnGHPDih1W@cluster0.gqktgu9.mongodb.net/partnerDashboard?retryWrites=true&w=majority", {
    
    });
    console.log("Database connected...");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  connectDB,
};
