const mongoose = require('mongoose');

const { admindataSchema } = require('../schema/admindataSchema');
const { interestSchema } = require('../schema/interestSchema');

const { userSchema } = require('../schema/userSchema');
const { proposalSchema } = require('../schema/proposalSchema');
const proposals = mongoose.model("proposal", proposalSchema); 
const adminData = mongoose.model('admindata', admindataSchema);
const interest = mongoose.model('interest', interestSchema);
const userData = mongoose.model('user', userSchema);

const axios = require('axios');

const API_KEY = 'd404d3926266b3d041a4414d17d13b08fff852a4';
var ZIP_CODE = '94301';
const STATE_CODE = '06';

// API URLs
const urlDemographics = `https://api.census.gov/data/2019/acs/acs5?get=NAME,B01001_001E,B01001_002E,B01001_026E,B03002_003E,B03002_004E,B03002_005E,B03002_006E,B03002_007E,B03002_008E,B03002_009E,B03002_012E,B16010_001E,B15003_001E,B15003_002E,B15003_003E,B15003_004E,B15003_005E&for=zip%20code%20tabulation%20area:${ZIP_CODE}&in=state:${STATE_CODE}&key=${API_KEY}`;
const urlIncome = `https://api.census.gov/data/2019/acs/acs5?get=NAME,B19001_001E,B19001_002E,B19001_003E,B19001_004E,B19001_005E&for=zip%20code%20tabulation%20area:${ZIP_CODE}&in=state:${STATE_CODE}&key=${API_KEY}`;
const urlEducation = `https://api.census.gov/data/2019/acs/acs5?get=NAME,B15003_001E,B15003_002E,B15003_003E,B15003_004E,B15003_005E&for=zip%20code%20tabulation%20area:${ZIP_CODE}&in=state:${STATE_CODE}&key=${API_KEY}`;


const fetchData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`API request failed: ${error.message}`);
  }
};

const processData = (data) => {
  const [header, ...values] = data;
  return values.map(row => {
    return row.reduce((acc, value, idx) => {
      acc[header[idx]] = value;
      return acc;
    }, {});
  });
};


// Extract relevant statistics
const extractStatistics = (demographics) => {
  if (!demographics || demographics.length === 0) throw new Error("No demographics data found");

  const demo = demographics[0]; // Assume first entry for this example

  return {
    errors: [],
    demographics: {
      region_population: parseFloat(demo.B01001_001E || 0),
      female_population: parseFloat(demo.B01001_026E || 0) / parseFloat(demo.B01001_001E || 1),
      male_population: parseFloat(demo.B01001_002E || 0) / parseFloat(demo.B01001_001E || 1),
      white_population: parseFloat(demo.B03002_003E || 0) / parseFloat(demo.B01001_001E || 1),
      black_population: parseFloat(demo.B03002_004E || 0) / parseFloat(demo.B01001_001E || 1),
      asian_population: parseFloat(demo.B03002_005E || 0) / parseFloat(demo.B01001_001E || 1),
      hispanic_population: parseFloat(demo.B03002_006E || 0) / parseFloat(demo.B01001_001E || 1),
      // Additional fields as needed
    },
    target_population: demo.B01001_001E || 'N/A',
    target_region: demo.NAME || 'N/A',
  };
};


const getCensusData = async (req, res) => {
  try {
    if(req.body.ZIP_CODE){
      ZIP_CODE = req.body.ZIP_CODE;
    }
    else{
      return res.status(500).json({ message: "Server error", error: "zip code must be important" });
    }
    
    const dataDemographics = await fetchData(urlDemographics);
    const dataIncome = await fetchData(urlIncome);
    const dataEducation = await fetchData(urlEducation);

    const demographicsData = processData(dataDemographics);
    const incomeData = processData(dataIncome);
    const educationData = processData(dataEducation);

    const formattedData = extractStatistics(demographicsData);

    const latAndLong = [{"place_id":352957420,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright","lat":"40.71879614666666","lon":"-74.00694265396825","class":"place","type":"postcode","place_rank":21,"importance":0.12000999999999995,"addresstype":"postcode","name":"10005","display_name":"10005, Manhattan, New York County, New York, United States","boundingbox":["40.6687961","40.7687961","-74.0569427","-73.9569427"]}] 
   //await axios.get(`https://nominatim.openstreetmap.org/search?format=json&postalcode=${ZIP_CODE}&country=United%20States`);
    res.status(200).json({
      demographics: formattedData,
      income: incomeData,
      education: educationData,
      latLong: latAndLong
    });
  } catch (error) {
    console.error("Error fetching census data:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const fetchGoogleCompanies = async (req, res) => {
  try {
    const { company }  = req.query;


    // Build the request URL
    const urlCityData = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${company}&region=us&key=AIzaSyBBYmw05S6MQ5tjNNJ5ht8jQKZUUDJrjU0`;

    let arr = [];
    // Fetch data from the external API
    const response = await axios.get(urlCityData);
    const cityData = response.data;
    
    if(cityData.results.length > 0){
        cityData.results?.map((elem) => {
        arr.push({"address": elem.formatted_address, "name": elem.name });
    });    
    }
    

    // Process and return the data as needed
    res.status(200).json({ success: true, data: arr });
  } catch (error) {
    console.error("Error fetching city data:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getplaces = async (req, res) => {
  try {
    const {  }  = req.body.zips;


    // Build the request URL
    const urlCityData = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${company}&region=us&key=AIzaSyBBYmw05S6MQ5tjNNJ5ht8jQKZUUDJrjU0`;

    let arr = [];
    // Fetch data from the external API
    const response = await axios.get(urlCityData);
    const cityData = response.data;
    
    if(cityData.results.length > 0){
        cityData.results?.map((elem) => {
        arr.push({"address": elem.formatted_address, "name": elem.name });
    });    
    }
    

    // Process and return the data as needed
    res.status(200).json({ success: true, data: arr });
  } catch (error) {
    console.error("Error fetching city data:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



const createUser = async (req, res) => {
  console.log(req.body);
  try {
    // Get user data from request body
    const { username, email, password, userRole } = req.body;

    // Check if email already exists
    const existingUser = await userData.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create a new user
    const newUser = new  userData({
      username,
      email,
      password, // Save the password as plain text (not recommended for production)
      userRole
    });

    // Save the user to the database
    await newUser.save();

    // Send a success response
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.log(error);
    // Handle any errors
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists with the provided email
    const user = await userData.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Compare the passwords
    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // If login is successful, send success message with user data
    res.status(200).json({ success: true, message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error logging in' });
  }
};

const getinterestdata = async (req, res) => {
 try {
    const searchTerm = req.query.search;

    if (!searchTerm) {
      const result = await interest.find();
      return res.json(result);
    }

    // MongoDB aggregation pipeline
    const pipeline = [
      // Unwind the subcategories
      { $unwind: "$subcategories" },
      // Unwind the options array within subcategories
      { $unwind: "$subcategories.options" }
    ];

    // Check if a search term was provided
    if (searchTerm) {
      pipeline.push(
        // Match documents based on the search term
        {
          $match: {
            $or: [
              { category: { $regex: searchTerm, $options: "i" } }, // Search in category
              { "subcategories.subcategory": { $regex: searchTerm, $options: "i" } }, // Search in subcategory
              { "subcategories.options": { $regex: searchTerm, $options: "i" } } // Search in options
            ]
          }
        }
      );
    }

    // Group the subcategories back by category and subcategory, and collect options into an array
    pipeline.push(
      {
        $group: {
          _id: { _id: "$_id", category: "$category", subcategory: "$subcategories.subcategory" }, // Group by _id, category, and subcategory
          options: { $addToSet: "$subcategories.options" } // Collect options into an array
        }
      },
      {
        $group: {
          _id: { _id: "$_id._id", category: "$_id.category" }, // Group again by _id and category
          subcategories: {
            $push: {
              subcategory: "$_id.subcategory",
              options: "$options"
            }
          }
        }
      },
      {
        $project: {
          _id: "$_id._id",
          category: "$_id.category",
          subcategories: 1
        }
      }
    );

    const result = await interest.aggregate(pipeline).exec(); // Execute the aggregation pipeline

    if (!result.length) {
      return res.status(404).send("No matching results found.");
    }

    res.json(result); // Send back the search results
  } catch (err) {
    console.error("Error in search API:", err);
    res.status(500).send("Server error.");
  }
};

const getdata = async (req, res) => {
  try {
    const searchTerm = req.query.search;

    if (!searchTerm) {
      const result = await adminData.find();
      return res.json(result);
    }

    // MongoDB aggregation pipeline
    const pipeline = [
      // Unwind the subcategories
      { $unwind: "$subcategories" },
      // Unwind the options array within subcategories
      { $unwind: "$subcategories.options" }
    ];

    // Check if a search term was provided
    if (searchTerm) {
      pipeline.push(
        // Match documents based on the search term
        {
          $match: {
            $or: [
              { category: { $regex: searchTerm, $options: "i" } }, // Search in category
              { "subcategories.subcategory": { $regex: searchTerm, $options: "i" } }, // Search in subcategory
              { "subcategories.options": { $regex: searchTerm, $options: "i" } } // Search in options
            ]
          }
        }
      );
    }

    // Group the subcategories back by category and subcategory, and collect options into an array
    pipeline.push(
      {
        $group: {
          _id: { _id: "$_id", category: "$category", subcategory: "$subcategories.subcategory" }, // Group by _id, category, and subcategory
          options: { $addToSet: "$subcategories.options" } // Collect options into an array
        }
      },
      {
        $group: {
          _id: { _id: "$_id._id", category: "$_id.category" }, // Group again by _id and category
          subcategories: {
            $push: {
              subcategory: "$_id.subcategory",
              options: "$options"
            }
          }
        }
      },
      {
        $project: {
          _id: "$_id._id",
          category: "$_id.category",
          subcategories: 1
        }
      }
    );

    const result = await adminData.aggregate(pipeline).exec(); // Execute the aggregation pipeline

    if (!result.length) {
      return res.status(404).send("No matching results found.");
    }

    res.json(result); // Send back the search results
  } catch (err) {
    console.error("Error in search API:", err);
    res.status(500).send("Server error.");
  }
};


const Createproposal = async (req, res) => {
  try {
    const { proposalName, userId, proposalData } = req.body;

    // Validate the input (Ensure all required fields are present)
    if (!proposalName || !userId || !proposalData) {
      return res.status(400).json({ error: 'proposalName, userId, and proposalData are required' });
    }

    // Create a new Proposal object based on the data received
    const newProposal = new proposals({
      proposalName,
      userId,
      proposalData
    });

    // Save the proposal in the database
    await newProposal.save();

    // Respond with success message
    res.status(201).json({ message: 'Proposal created successfully', proposal: newProposal });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error creating proposal' });
  }
};

const getProposal = async (req, res) => {
  try {
      // Extract query parameters with default values
      const { proposalName, limit = 10, page = 1 } = req.query;

      // Parse and validate limit and page values
      const parsedLimit = parseInt(limit, 10);
      const parsedPage = parseInt(page, 10);

      if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedPage < 1) {
          return res.status(400).json({ success: false, error: 'Invalid limit or page value' });
      }

      // Build query based on proposalName (if provided)
      let query = {};
      if (proposalName) {
          query.proposalName = { $regex: proposalName, $options: 'i' }; // Case-insensitive search for proposal name
      }

      // Calculate pagination offset
      const skip = (parsedPage - 1) * parsedLimit;

      // Fetch proposals using aggregation pipeline
      let proposal = await proposals.aggregate([
          { $match: query }, // Match documents based on the query
          { 
              $project: {
                  proposalNameLower: { $toLower: "$proposalName" }, // Case-insensitive sorting
                  proposalName: 1,
                  createdDate: 1,
                  proposalData: 1,
                  isDeleted: 1,
                  userId: 1
              }
          },
          { $sort: { proposalNameLower: 1 } }, // Sort proposals alphabetically (case-insensitive)
          { $skip: skip }, // Skip documents for pagination
          { $limit: parsedLimit } // Limit number of results per page
      ]);

      // Count total proposals matching the query for pagination
      const totalProposals = await proposals.countDocuments(query);

      // Return response with proposals, pagination info, and success message
      return res.json({
          success: true,
          data: proposal,
          total: totalProposals,
          pages: Math.ceil(totalProposals / parsedLimit), // Calculate total pages
          currentPage: parsedPage // Return the current page number
      });
  } catch (error) {
      console.error(error); // Log the error for debugging purposes
      return res.status(500).json({ success: false, error: 'Error retrieving proposals' });
  }
};



module.exports = { createUser,loginUser,Createproposal, getProposal, getdata, getinterestdata, getCensusData, fetchGoogleCompanies  };