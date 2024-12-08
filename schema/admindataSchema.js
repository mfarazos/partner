const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const admindataSchema = new mongoose.Schema({
  
  companyName: {
    type: String,
    required: true,
    maxlength: 100,
    unique: true
}, 
email: {
  type: String,
  
},

  createdDate: {
    type: Date,
    default: Date.now,
  },
  website: {
    type: String,
    maxlength: 100,
  },
  title: {
    type: String,
    maxlength: 50
  },
  businessName: {
    type: String,
    maxlength: 100
  },
  contact: {
    type: String,
    maxlength: 50
  },
  phone: {
    type: String,
  },
  city: {
    type: String,
    maxlength: 50
  },
  stateFormation: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  entityType: {
    type: String,
    maxlength: 50
  },
  accountExecutive: {
    type: String,
    maxlength: 50
  },
  accountManager: {
    type: String,
    maxlength: 50
  },
  customerNumber: {
    type: String,
    maxlength: 50
  }

  
});

module.exports = { admindataSchema };
const createUser = async (req, res) => {
  try {
    const { username, email, password, userRole } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new user object
    const newUser = new User({
      username,
      email,
      password, // Store the password as plain text
      userRole
    });

    // Save the user in the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
};


