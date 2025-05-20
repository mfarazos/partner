const mongoose = require('mongoose');

const { admindataSchema } = require('../schema/admindataSchema');
const { interestSchema } = require('../schema/interestSchema');

const { testSchema } = require('../schema/testSchema');

const { userSchema } = require('../schema/userSchema');
const { proposalSchema } = require('../schema/proposalSchema');
const proposals = mongoose.model("proposal", proposalSchema); 
const adminData = mongoose.model('admindata', admindataSchema);
const interest = mongoose.model('interest', interestSchema);
const userData = mongoose.model('user', userSchema);

const testData = mongoose.model('test', testSchema);


const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const axios = require('axios');

const API_KEY = 'd404d3926266b3d041a4414d17d13b08fff852a4';
var ZIP_CODE = '94301';
const STATE_CODE = '06';

// API URLs
const urlDemographics = `https://api.census.gov/data/2019/acs/acs5?get=NAME,B01001_001E,B01001_002E,B01001_026E,B03002_003E,B03002_004E,B03002_005E,B03002_006E,B03002_007E,B03002_008E,B03002_009E,B03002_012E,B16010_001E,B15003_001E,B15003_002E,B15003_003E,B15003_004E,B15003_005E&for=zip%20code%20tabulation%20area:${ZIP_CODE}&in=state:${STATE_CODE}&key=${API_KEY}`;
const urlIncome = `https://api.census.gov/data/2019/acs/acs5?get=NAME,B19001_001E,B19001_002E,B19001_003E,B19001_004E,B19001_005E&for=zip%20code%20tabulation%20area:${ZIP_CODE}&in=state:${STATE_CODE}&key=${API_KEY}`;
const urlEducation = `https://api.census.gov/data/2019/acs/acs5?get=NAME,B15003_001E,B15003_002E,B15003_003E,B15003_004E,B15003_005E&for=zip%20code%20tabulation%20area:${ZIP_CODE}&in=state:${STATE_CODE}&key=${API_KEY}`;

const states = [
  { fipsCode: "01", stuspsCode: "AL", stateName: "Alabama" },
  { fipsCode: "02", stuspsCode: "AK", stateName: "Alaska" },
  { fipsCode: "04", stuspsCode: "AZ", stateName: "Arizona" },
  { fipsCode: "05", stuspsCode: "AR", stateName: "Arkansas" },
  { fipsCode: "06", stuspsCode: "CA", stateName: "California" },
  { fipsCode: "08", stuspsCode: "CO", stateName: "Colorado" },
  { fipsCode: "09", stuspsCode: "CT", stateName: "Connecticut" },
  { fipsCode: "10", stuspsCode: "DE", stateName: "Delaware" },
  { fipsCode: "11", stuspsCode: "DC", stateName: "District of Columbia" },
  { fipsCode: "12", stuspsCode: "FL", stateName: "Florida" },
  { fipsCode: "13", stuspsCode: "GA", stateName: "Georgia" },
  { fipsCode: "15", stuspsCode: "HI", stateName: "Hawaii" },
  { fipsCode: "16", stuspsCode: "ID", stateName: "Idaho" },
  { fipsCode: "17", stuspsCode: "IL", stateName: "Illinois" },
  { fipsCode: "18", stuspsCode: "IN", stateName: "Indiana" },
  { fipsCode: "19", stuspsCode: "IA", stateName: "Iowa" },
  { fipsCode: "20", stuspsCode: "KS", stateName: "Kansas" },
  { fipsCode: "21", stuspsCode: "KY", stateName: "Kentucky" },
  { fipsCode: "22", stuspsCode: "LA", stateName: "Louisiana" },
  { fipsCode: "23", stuspsCode: "ME", stateName: "Maine" },
  { fipsCode: "24", stuspsCode: "MD", stateName: "Maryland" },
  { fipsCode: "25", stuspsCode: "MA", stateName: "Massachusetts" },
  { fipsCode: "26", stuspsCode: "MI", stateName: "Michigan" },
  { fipsCode: "27", stuspsCode: "MN", stateName: "Minnesota" },
  { fipsCode: "28", stuspsCode: "MS", stateName: "Mississippi" },
  { fipsCode: "29", stuspsCode: "MO", stateName: "Missouri" },
  { fipsCode: "30", stuspsCode: "MT", stateName: "Montana" },
  { fipsCode: "31", stuspsCode: "NE", stateName: "Nebraska" },
  { fipsCode: "32", stuspsCode: "NV", stateName: "Nevada" },
  { fipsCode: "33", stuspsCode: "NH", stateName: "New Hampshire" },
  { fipsCode: "34", stuspsCode: "NJ", stateName: "New Jersey" },
  { fipsCode: "35", stuspsCode: "NM", stateName: "New Mexico" },
  { fipsCode: "36", stuspsCode: "NY", stateName: "New York" },
  { fipsCode: "37", stuspsCode: "NC", stateName: "North Carolina" },
  { fipsCode: "38", stuspsCode: "ND", stateName: "North Dakota" },
  { fipsCode: "39", stuspsCode: "OH", stateName: "Ohio" },
  { fipsCode: "40", stuspsCode: "OK", stateName: "Oklahoma" },
  { fipsCode: "41", stuspsCode: "OR", stateName: "Oregon" },
  { fipsCode: "42", stuspsCode: "PA", stateName: "Pennsylvania" },
  { fipsCode: "44", stuspsCode: "RI", stateName: "Rhode Island" },
  { fipsCode: "45", stuspsCode: "SC", stateName: "South Carolina" },
  { fipsCode: "46", stuspsCode: "SD", stateName: "South Dakota" },
  { fipsCode: "47", stuspsCode: "TN", stateName: "Tennessee" },
  { fipsCode: "48", stuspsCode: "TX", stateName: "Texas" },
  { fipsCode: "49", stuspsCode: "UT", stateName: "Utah" },
  { fipsCode: "50", stuspsCode: "VT", stateName: "Vermont" },
  { fipsCode: "51", stuspsCode: "VA", stateName: "Virginia" },
  { fipsCode: "53", stuspsCode: "WA", stateName: "Washington" },
  { fipsCode: "54", stuspsCode: "WV", stateName: "West Virginia" },
  { fipsCode: "55", stuspsCode: "WI", stateName: "Wisconsin" },
  { fipsCode: "56", stuspsCode: "WY", stateName: "Wyoming" },
];

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

// const fetchYelpBusiness = async (req, res) => {
//   try {
//     const { company } = req.query;
//     const categories = [
//       "arts",
//       "crafts",
//       "hobby_supply",
//       "auto_parts",
//       "accessory",
//       "supplies",
//       "after_market",
//       "auto_used_car_dealers",
//       "auto_dealer_group_domestic",
//       "apartment_home_rentals",
//       "appliances",
//       "auto_dealer_group_import_foreign",
//       "banking_financial_services_web_bank",
//       "banking_financial_services_web_financial_services",
//       "beauty_barber_shops_salons_beauty_salon",
//       "accounting_taxes_accounting",
//       "agricultural_supplies",
//       "agriculture_farming",
//       "employment_services",
//       "entertainment_movies_theater_rental_movie_rental",
//       "entertainment_movies_theater_rental_movie_theater",
//       "entertainment_recreation",
//       "entertainment_special_event_concerts",
//       "fitness_health_clubs_gym",
//       "fitness_health_clubs_yoga_studio",
//       "food_dining_restaurant_fast_food",
//       "food_dining_restaurant_fine_dining",
//       "food_dining_restaurant_cafe",
//       "home_improvement_repairs_plumbing",
//       "home_improvement_repairs_electrical",
//       "home_improvement_repairs_carpentry",
//       "legal_services_attorneys",
//       "medical_services_hospital",
//       "medical_services_clinic",
//       "medical_services_dental",
//       "retail_clothing_apparel_men",
//       "retail_clothing_apparel_women",
//       "retail_clothing_apparel_kids",
//       "retail_electronics_appliances",
//       "travel_accommodation_hotels",
//       "travel_accommodation_resorts",
//       "travel_transportation_airlines",
//       "travel_transportation_taxis",
//       "education_schools_primary",
//       "education_schools_secondary",
//       "education_colleges_universities"
//     ];
    

//     if (!company) {
//       return res.status(400).json({ error: 'Company name is required as a query parameter.' });
//     }

    
//     const urlCityData = `https://api.yelp.com/v3/businesses/search?location=USA&term=${company}&categories=arts,crafts,hobby_supply,auto_parts,accessory,supplies,after_market,auto_used_car_dealers,auto_dealer_group_domestic,apartment_home_rentals,appliances,auto_dealer_group_import_foreign,banking_financial_services_web_bank,banking_financial_services_web_financial_services,beauty_barber_shops_salons_beauty_salon,accounting_taxes_accounting,agricultural_supplies,agriculture_farming,employment_services,entertainment_movies_theater_rental_movie_rental,entertainment_movies_theater_rental_movie_theater,entertainment_recreation,entertainment_special_event_concerts,fitness_health_clubs_gym,fitness_health_clubs_yoga_studio,food_dining_restaurant_fast_food,food_dining_restaurant_fine_dining,food_dining_restaurant_cafe,home_improvement_repairs_plumbing,home_improvement_repairs_electrical,home_improvement_repairs_carpentry,legal_services_attorneys,medical_services_hospital,medical_services_clinic,medical_services_dental,retail_clothing_apparel_men,retail_clothing_apparel_women,retail_clothing_apparel_kids,retail_electronics_appliances,travel_accommodation_hotels,travel_accommodation_resorts,travel_transportation_airlines,travel_transportation_taxis,education_schools_primary,education_schools_secondary,education_colleges_universities&limit=10`;
    
//     const headers = {
//       Authorization: 'Bearer fWXmcneS2v2a6eDl3IJoLTdrBYj7gu-vNeg3nU4KYRhsSEuFGjTBWsYyEYJDsKuYg7A9Ucfpg-rVkfnjSJipeu5-15aiqA5Rkik09rJZj98h6GwkjJtad2iQBbc8Z3Yx'
//     };

//     const response = await fetch(urlCityData, { headers });

//     // Log response type to check what's returned
//     console.log('Response Type:', response.headers.get('Content-Type'));

//     // Agar response JSON format mein ho, toh use karo
//     const textResponse = await response.text(); // Parse as text first

//     try {
//       const data = JSON.parse(textResponse); // Try to parse as JSON
//       if (!data.businesses || data.businesses.length === 0) {
//         return res.status(404).json({ error: 'No businesses found for the given query.' });
//       }

//       const businessNames = data.businesses.map((business) => ({
//         name: business.name,
//         coordinates: business.coordinates,
//         advertisementIndustry: business?.categories[0]?.title,
//       }));
      

//       res.status(200).json({
//         success: true,
//         businessNames,
//         total: businessNames.length,
//       });
//     } catch (parseError) {
//       console.error('Error parsing JSON:', parseError);
//       res.status(500).json({ error: 'Failed to parse response from Yelp API.' });
//     }
//   } catch (error) {
//     console.error('Error fetching businesses:', error);
//     res.status(500).json({ error: 'Failed to fetch businesses from Yelp API.' });
//   }
// };
const fetchYelpBusiness = async (req, res) => {
  try {
    const { company } = req.query;
    const categories = [
      "arts", "crafts", "hobby_supply", "auto_parts", "accessory", "supplies", 
      "after_market", "auto_used_car_dealers", "auto_dealer_group_domestic", 
      "apartment_home_rentals", "appliances", "auto_dealer_group_import_foreign", 
      "banking_financial_services_web_bank", "banking_financial_services_web_financial_services", 
      "beauty_barber_shops_salons_beauty_salon", "accounting_taxes_accounting", 
      "agricultural_supplies", "agriculture_farming", "employment_services", 
      "entertainment_movies_theater_rental_movie_rental", "entertainment_movies_theater_rental_movie_theater", 
      "entertainment_recreation", "entertainment_special_event_concerts", 
      "fitness_health_clubs_gym", "fitness_health_clubs_yoga_studio", 
      "food_dining_restaurant_fast_food", "food_dining_restaurant_fine_dining", 
      "food_dining_restaurant_cafe", "home_improvement_repairs_plumbing", 
      "home_improvement_repairs_electrical", "home_improvement_repairs_carpentry", 
      "legal_services_attorneys", "medical_services_hospital", "medical_services_clinic", 
      "medical_services_dental", "retail_clothing_apparel_men", "retail_clothing_apparel_women", 
      "retail_clothing_apparel_kids", "retail_electronics_appliances", 
      "travel_accommodation_hotels", "travel_accommodation_resorts", 
      "travel_transportation_airlines", "travel_transportation_taxis", 
      "education_schools_primary", "education_schools_secondary", 
      "education_colleges_universities"
    ];

    if (!company) {
      return res.status(400).json({ error: 'Company name is required as a query parameter.' });
    }

    const urlCityData = `https://api.yelp.com/v3/businesses/search?location=USA&term=${company}&categories=arts,crafts,hobby_supply,auto_parts,accessory,supplies,after_market,auto_used_car_dealers,auto_dealer_group_domestic,apartment_home_rentals,appliances,auto_dealer_group_import_foreign,banking_financial_services_web_bank,banking_financial_services_web_financial_services,beauty_barber_shops_salons_beauty_salon,accounting_taxes_accounting,agricultural_supplies,agriculture_farming,employment_services,entertainment_movies_theater_rental_movie_rental,entertainment_movies_theater_rental_movie_theater,entertainment_recreation,entertainment_special_event_concerts,fitness_health_clubs_gym,fitness_health_clubs_yoga_studio,food_dining_restaurant_fast_food,food_dining_restaurant_fine_dining,food_dining_restaurant_cafe,home_improvement_repairs_plumbing,home_improvement_repairs_electrical,home_improvement_repairs_carpentry,legal_services_attorneys,medical_services_hospital,medical_services_clinic,medical_services_dental,retail_clothing_apparel_men,retail_clothing_apparel_women,retail_clothing_apparel_kids,retail_electronics_appliances,travel_accommodation_hotels,travel_accommodation_resorts,travel_transportation_airlines,travel_transportation_taxis,education_schools_primary,education_schools_secondary,education_colleges_universities&limit=10`;
    
    const headers = {
            Authorization: 'Bearer fWXmcneS2v2a6eDl3IJoLTdrBYj7gu-vNeg3nU4KYRhsSEuFGjTBWsYyEYJDsKuYg7A9Ucfpg-rVkfnjSJipeu5-15aiqA5Rkik09rJZj98h6GwkjJtad2iQBbc8Z3Yx'
       };

    const response = await fetch(urlCityData, { headers });

    const textResponse = await response.text();
    console.log("Yelp API Response:", textResponse);
    try {
      const data = JSON.parse(textResponse);
      if (!data.businesses || data.businesses.length === 0) {
        return res.status(404).json({ error: 'No businesses found for the given query.' });
      }

      const businessNames = data.businesses.map((business) => {
        // Find any category in `business.categories` that matches the `categories` array
        const matchedCategory = business.categories.find((cat) =>
          categories.includes(cat.alias) || categories.includes(cat.title.toLowerCase().replace(/\s/g, "_"))
        );

        return {
          name: business.name,
          coordinates: business.coordinates,
          advertisementIndustry: matchedCategory ? matchedCategory.title : business.categories[0].title, // Use the matched category
        };
      });

      res.status(200).json({
        success: true,
        businessNames,
        total: businessNames.length,
      });
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ error: 'Failed to parse response from Yelp API.' });
    }
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ error: 'Failed to fetch businesses from Yelp API.' });
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
    

    
    res.status(200).json({ success: true, data: arr });
  } catch (error) {
    console.error("Error fetching city data:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getcity = async (req, res) => {
  try {
    const { cityname, page = 1, limit = 10 } = req.query;

    if (!cityname) {
      return res.status(400).json({ error: "cityname is required" });
    }

    const offset = (page - 1) * limit;

    // Construct API URL dynamically
    const apiUrl = `https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/georef-united-states-of-america-zc-point@public/records?where=usps_city like '%${cityname}%'&group_by=usps_city&limit=${limit}&offset=${offset}`;

    
    const response = await axios.get(apiUrl);

 
    res.status(200).json(response.data);

  } catch (error) {
    console.error("API Call Error: ", error.message);
    res.status(500).json({ error: "API call failed" });
  }
};

const getcitydetail = async (req, res) => {
  try {
      const { cities, page = 1, limit = 10 } = req.query;

      if (!cities) {
          return res.status(400).json({ error: "Cities parameter is required" });
      }
  
      const stateMap = Object.fromEntries(states.map(state => [state.stuspsCode, state.fipsCode]));

     
      const apiUrl = `https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/georef-united-states-of-america-zc-point@public/records?where=usps_city IN (${cities})&limit=${limit}&offset=${(page-1) * limit}`;

      const response = await axios.get(apiUrl);
      const data = response.data;


      const filteredData = data.results.map(record => ({
          zip_code: record.zip_code,
          usps_city: record.usps_city,
          population: record.population,
          geo_point_2d: record.geo_point_2d,
          fipsCode: stateMap[record.stusps_code] || 'N/A',
      }));

      res.status(200).json(filteredData);

  } catch (error) {
      console.error("Error fetching data:", error.message);
      res.status(500).json({ error: "Failed to fetch data from third-party API" });
  }
};
const getcityzipcode = async (req, res) => {
  try {
      const { zip_codes, page = 1, limit = 10 } = req.query;

      
      if (!zip_codes) {
          return res.status(400).json({ error: "zip_codes parameter is required" });
      }
      const stateMap = Object.fromEntries(states.map(state => [state.stuspsCode, state.fipsCode]));

      console.log("Zip codes received:", zip_codes);

      
      const offset = (page - 1) * limit;
      console.log(offset);

      
      const apiUrl = `https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/georef-united-states-of-america-zc-point@public/records?where=zip_code IN (${zip_codes})&limit=${limit}&offset=${offset}`;

      
      const response = await axios.get(apiUrl);
      
      const data = response.data.results;  

      console.log("Fetched data:", data);

      
      const filteredData = data.map(record => ({
          zip_code: record.zip_code,
          stusps_code: record.stusps_code,
          usps_city: record.usps_city,
          population: record.population,   
          geo_point_2d: record.geo_point_2d,
          fipsCode: stateMap[record.stusps_code] || 'N/A',
      }));

    
      res.status(200).json(filteredData);

  } catch (error) {
      console.error("Error fetching data:", error.message);
      res.status(500).json({ error: "Failed to fetch data" });
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



const getallUsers = async (req, res) => {
  try {
    
    const users = await userData.find();

    res.status(200).json({ message: 'Users retrieved successfully', users });
  } catch (error) {
    console.log(error);
    
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await userData.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a reset token with expiration
    const resetToken = jwt.sign({ email: user.email }, "12345", { expiresIn: '45m' });

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email provider
      auth: {
        user: 'farazahmed.fa276@gmail.com', // Sender's email
        pass: 'obxm mkyv bgpt nbnp', // Replace with your App Password for Gmail
      },
    });

    // Email content
    const mailOptions = {
      from: 'farazahmed.fa276@gmail.com', // Sender's email
      to: user.email, // Recipient's email
      subject: 'Password Reset Request', // Subject is required
      text: `You requested a password reset. Use the following token to reset your password: ${resetToken}`,
      html: `<p>You requested a password reset. Use the following token to reset your password:</p>
             <p><strong>${resetToken}</strong></p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Respond with success message
    res.status(200).json({
      success: true,
      message: 'Password reset token sent to your email!',
      token: resetToken, // Include token in response if frontend needs it
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error sending reset token' });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body; // Get token and new password from request body

    console.log('Received Token:', token);
    console.log('New Password:', newPassword);

    // Verify the reset token
    let decoded;
    try {
      decoded = jwt.verify(token, "12345"); // Verify token with secret key
      console.log('Decoded Token:', decoded);
    } catch (err) {
      console.error('Invalid or expired token:', err);
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const email = decoded.email.toLowerCase(); // Extract the email from the decoded token

    // Check if user exists
    const user = await userData.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's password
    console.log('Updating password for user:', email);
    user.password = newPassword; // Assign the new password to the user
    await user.save(); // Save the updated user

    // Respond with success message
    res.status(200).json({
      success: true,
      message: 'Password reset successfully!',
    });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ success: false, error: 'Error resetting password' });
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

  let dataid = req.body?._id
  if(dataid){

    const updatedCampaign = await proposals.findOneAndUpdate(
      { _id: dataid }, // Match the campaign by ID
      {  proposalName, proposalData, userId }, // Update the isArchive field
      { new: true } // Return the updated document
    );

   return res.status(201).json({ message: 'Proposal updated successfully', proposal: updatedCampaign });
  }

 
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
                  isArchive: 1,
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
const getradius = async (req, res) => {
  try {
 
    const response = await axios.get(
      'https://www.freemaptools.com/ajax/us/get-all-zip-codes-inside-radius.php?radius=41.84&lat=40.706172&lng=-74.008596&rn=3326&showPOboxes=true'
    );

    // Convert the XML response to JSON
    const xmlData = response.data;
    const parseString = require('xml2js').parseString;

    parseString(xmlData, { explicitArray: false }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to parse XML response' });
      }
      res.json(result); // Send JSON response
    });
  } catch (error) {
    console.error('Error calling the API:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from API' });
  }
};




const getdemographyold = async (req, res) => {
  try {
  
    const { zipCodes, stateCode } = req.query;
    
 
    if (!zipCodes || !stateCode) {
      return res.status(400).json({ error: 'Missing required parameters: zipCodes, stateCode' });
    }

 
    const zip_code = zipCodes.split(',').join(',');
    const state_code = stateCode.split(',').join(',');


    const url_demographics = `https://api.census.gov/data/2019/acs/acs5?get=NAME,B01001_001E,B01001_002E,B01001_026E,B03002_003E,B03002_004E,B03002_005E,B03002_006E,B03002_007E,B03002_008E,B03002_009E,B03002_012E,B16010_001E,B15003_001E,B15003_002E,B15003_003E,B15003_004E,B15003_005E&for=zip%20code%20tabulation%20area:${zip_code}&in=state:${state_code}&key=${api_key}`;
    const url_income = `https://api.census.gov/data/2019/acs/acs5?get=NAME,B19001_001E,B19001_002E,B19001_003E,B19001_004E,B19001_005E&for=zip%20code%20tabulation%20area:${zip_code}&in=state:${state_code}&key=${api_key}`;
    const url_education = `https://api.census.gov/data/2019/acs/acs5?get=NAME,B15003_001E,B15003_002E,B15003_003E,B15003_004E,B15003_005E&for=zip%20code%20tabulation%20area:${zip_code}&in=state:${state_code}&key=${api_key}`;

 
    const fetchData = async (url) => {
      try {
        const response = await axios.get(url);
        console.log('Fetched Data: ', response.data);
        return response.data; // Data return karenge

      } catch (error) {
        return { error: `Failed to fetch data from ${url}: ${error.message}` }; // Agar error aaye toh error return karenge
      }
    };

  
    const data_demographics = await fetchData(url_demographics);
    const data_income = await fetchData(url_income);
    const data_education = await fetchData(url_education);


    if (data_demographics.error) {
      return res.status(500).json({ error: data_demographics.error });
    }
    if (data_income.error) {
      return res.status(500).json({ error: data_income.error });
    }
    if (data_education.error) {
      return res.status(500).json({ error: data_education.error });
    }

    
    const processData = (data) => {
      if (!data || data.length < 2) {
        return { error: 'Data is empty or invalid' }; 
      }
      const header = data[0]; 
      const values = data.slice(1);

      return values.map(row => {
        const entry = {}; 
        header.forEach((col, index) => {
          entry[col] = row[index]; 
        });
        return entry;
      });
    };

  
    const demographics_data = processData(data_demographics);
    const income_data = processData(data_income);
    const education_data = processData(data_education);

  
    if (demographics_data.error) {
      return res.status(500).json({ error: demographics_data.error });
    }
    if (income_data.error) {
      return res.status(500).json({ error: income_data.error });
    }
    if (education_data.error) {
      return res.status(500).json({ error: education_data.error });
    }

 
    const extractStatistics = (demographics) => {
      if (!demographics || demographics.length === 0) {
        return { error: 'Demographics data is empty' };
      }
      const demo = demographics[0]; 
      return [ {
        demographics: {
          region_population: parseFloat(demo['B01001_001E']),
          female_population: parseFloat(demo['B01001_026E']) / parseFloat(demo['B01001_001E']),
          male_population: parseFloat(demo['B01001_002E']) / parseFloat(demo['B01001_001E']),
          white_population: parseFloat(demo['B03002_003E']) / parseFloat(demo['B01001_001E']),
          black_population: parseFloat(demo['B03002_004E']) / parseFloat(demo['B01001_001E']),
          asian_population: parseFloat(demo['B03002_005E']) / parseFloat(demo['B01001_001E']),
          hispanic_population: parseFloat(demo['B03002_006E']) / parseFloat(demo['B01001_001E']),
          other_race_population: parseFloat(demo['B03002_007E']) / parseFloat(demo['B01001_001E']),
          median_age: demo['median_age'] || 'N/A', // Median age ko handle kar rahe hain agar nahi ho
          age_under_18: parseFloat(demo['B01001_002E']) / parseFloat(demo['B01001_001E']),
          age_18_24: parseFloat(demo['B01001_026E']) / parseFloat(demo['B01001_001E']),
          age_25_34: parseFloat(demo['B01001_026E']) / parseFloat(demo['B01001_001E']),
          age_35_44: parseFloat(demo['B01001_026E']) / parseFloat(demo['B01001_001E']),
          age_45_54: parseFloat(demo['B01001_026E']) / parseFloat(demo['B01001_001E']),
          age_55_64: parseFloat(demo['B01001_026E']) / parseFloat(demo['B01001_001E']),
          age_65_and_over: parseFloat(demo['B01001_026E']) / parseFloat(demo['B01001_001E']),
          college_no: parseFloat(demo['B15003_002E']) / parseFloat(demo['B15003_001E']),
          college_under: parseFloat(demo['B15003_003E']) / parseFloat(demo['B15003_001E']),
          college_grad: parseFloat(demo['B15003_004E']) / parseFloat(demo['B15003_001E']),
          total_households: parseFloat(demo['B19001_001E']),
          kids_yes: parseFloat(demo['B19001_002E']) / parseFloat(demo['B19001_001E']),
          kids_no: parseFloat(demo['B19001_003E']) / parseFloat(demo['B19001_001E']),
          persons_household: parseFloat(demo['B15003_001E']),
          average_home_value: parseFloat(demo['B15003_002E']),
          household_income: parseFloat(demo['B19001_001E']),
          income_0_50: parseFloat(demo['B19001_002E']) / parseFloat(demo['B19001_001E']),
          income_50_100: parseFloat(demo['B19001_003E']) / parseFloat(demo['B19001_001E']),
          income_100_150: parseFloat(demo['B19001_004E']) / parseFloat(demo['B19001_001E']),
          income_150: parseFloat(demo['B19001_005E']) / parseFloat(demo['B19001_001E']),
          num_establishments: demo['num_establishments'] || 'N/A'
        },
        target_population: demo['B01001_001E'] || 'N/A',
        targeted_region_summary: demo['NAME'] || 'N/A',
        target_region: demo['NAME'] || 'N/A',
        population: demo['B01001_001E'] || 'N/A',
        income: `$${demo['B19001_001E'] || 'N/A'}`,
        total_households: demo['B19001_001E'] || 'N/A',
        normalized_race_population: demo['B01001_001E'] || 'N/A',
        region_population: demo['B01001_001E'] || 'N/A'
      } ];
    };


    const formatted_data = extractStatistics(demographics_data);

   
    if (formatted_data.error) {
      return res.status(500).json({ error: formatted_data.error });
    }

   
    res.json(formatted_data);

  } catch (error) {

    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};

const getspecificdemography = async (req, res) => {
  try {
     
      const { zipCodes, stateCode } = req.query;  // Destructure the query parameters
      
     
      if (!zipCodes || !stateCode) {
          return res.status(400).json({ error: 'ZIP codes and state code required hain.' });
      }
      
      
      const apiKey = 'd404d3926266b3d041a4414d17d13b08fff852a4';  
      const baseUrl = 'https://api.census.gov/data/2019/acs/acs5';
      
      const zipParam = zipCodes.split(',').join(',');
      const url = `${baseUrl}?get=NAME,B01001_001E,B01001_002E,B01001_026E,B03002_003E,B03002_004E,B03002_005E,B03002_006E,B03002_007E,B03002_008E,B03002_009E,B03002_012E,B16010_001E,B15003_001E,B15003_002E,B15003_003E,B15003_004E,B15003_005E&for=zip%20code%20tabulation%20area:${zipParam}&in=state:${stateCode}&key=${apiKey}`;
      
      
      const response = await axios.get(url);
      
     
      const data = response.data;

     
      res.json({ data });
  } catch (error) {
     
      console.error(error);
      res.status(500).json({ error: 'API request has some issues.' });
  }
};


const getdemographydata = async (zipCodes,stateCode) => {
  try {
  
    
 
    
    const api_key = 'd404d3926266b3d041a4414d17d13b08fff852a4';

      
 
    const zip_code = zipCodes.map(zip => `${zip}`).join(',');;
    const state_code = stateCode;


    const url_demographics = `https://api.census.gov/data/2019/acs/acs5?get=NAME,B01001_001E,B01001_002E,B01001_026E,B03002_003E,B03002_004E,B03002_005E,B03002_006E,B03002_007E,B03002_008E,B03002_009E,B03002_012E,B16010_001E,B15003_001E,B15003_002E,B15003_003E,B15003_004E,B15003_005E&for=zip%20code%20tabulation%20area:${zip_code}&in=state:${state_code}&key=${api_key}`;
    const url_income = `https://api.census.gov/data/2019/acs/acs5?get=NAME,B19001_001E,B19001_002E,B19001_003E,B19001_004E,B19001_005E&for=zip%20code%20tabulation%20area:${zip_code}&in=state:${state_code}&key=${api_key}`;
    const url_education = `https://api.census.gov/data/2019/acs/acs5?get=NAME,B15003_001E,B15003_002E,B15003_003E,B15003_004E,B15003_005E&for=zip%20code%20tabulation%20area:${zip_code}&in=state:${state_code}&key=${api_key}`;

 
    const fetchData = async (url) => {
      try {
        const response = await axios.get(url);
        console.log('Fetched Data: ', response.data);
        return response.data; // Data return karenge

      } catch (error) {
        return { error: `Failed to fetch data from ${url}: ${error.message}` }; // Agar error aaye toh error return karenge
      }
    };

  
    const data_demographics = await fetchData(url_demographics);
    const data_income = await fetchData(url_income);
    const data_education = await fetchData(url_education);


    if (data_demographics.error) {
      console.log('error:', data_demographics.error);
      return { error: data_demographics.error };
    }
    if (data_income.error) {
      console.log('error:', data_income.error);
      
      return { error: data_income.error };
    }
    if (data_education.error) {
      console.log('error:', data_education.error);
      
      return { error: data_education.error };
    }

    
    const processData = (data) => {
      if (!data || data.length < 2) {
      console.log('error:', 'Data is empty or invalid');
          return { error: 'Data is empty or invalid' }; 
      }
      const header = data[0]; 
      const values = data.slice(1);

      return values.map(row => {
        const entry = {}; 
        header.forEach((col, index) => {
          entry[col] = row[index]; 
        });
        return entry;
      });
    };

  
    const demographics_data = processData(data_demographics);
    const income_data = processData(data_income);
    const education_data = processData(data_education);

  
    if (demographics_data.error) {
      console.log('error:', demographics_data.error);
      
      return { error: demographics_data.error };
    }
    if (income_data.error) {
      console.log('error:', income_data.error);
      
      return { error: income_data.error };
    }
    if (education_data.error) {
      console.log('error:', education_data.error);
      
      return { error: education_data.error };
    }

 
    const extractStatistics = (demographics) => {
      if (!demographics || demographics.length === 0) {
        return { error: 'Demographics data is empty' };
      }
      const demo = demographics[0]; 
      return [ {
        demographics: {
          region_population: parseFloat(demo['B01001_001E']),
          female_population: parseFloat(demo['B01001_026E']) / parseFloat(demo['B01001_001E']),
          male_population: parseFloat(demo['B01001_002E']) / parseFloat(demo['B01001_001E']),
          white_population: parseFloat(demo['B03002_003E']) / parseFloat(demo['B01001_001E']),
          black_population: parseFloat(demo['B03002_004E']) / parseFloat(demo['B01001_001E']),
          asian_population: parseFloat(demo['B03002_005E']) / parseFloat(demo['B01001_001E']),
          hispanic_population: parseFloat(demo['B03002_006E']) / parseFloat(demo['B01001_001E']),
          other_race_population: parseFloat(demo['B03002_007E']) / parseFloat(demo['B01001_001E']),
          median_age: demo['median_age'] || 'N/A', // Median age ko handle kar rahe hain agar nahi ho
          age_under_18: parseFloat(demo['B01001_002E']) / parseFloat(demo['B01001_001E']),
          age_18_24: parseFloat(demo['B01001_026E']) / parseFloat(demo['B01001_001E']),
          age_25_34: parseFloat(demo['B01001_026E']) / parseFloat(demo['B01001_001E']),
          age_35_44: parseFloat(demo['B01001_026E']) / parseFloat(demo['B01001_001E']),
          age_45_54: parseFloat(demo['B01001_026E']) / parseFloat(demo['B01001_001E']),
          age_55_64: parseFloat(demo['B01001_026E']) / parseFloat(demo['B01001_001E']),
          age_65_and_over: parseFloat(demo['B01001_026E']) / parseFloat(demo['B01001_001E']),
          college_no: parseFloat(demo['B15003_002E']) / parseFloat(demo['B15003_001E']),
          college_under: parseFloat(demo['B15003_003E']) / parseFloat(demo['B15003_001E']),
          college_grad: parseFloat(demo['B15003_004E']) / parseFloat(demo['B15003_001E']),
          total_households: parseFloat(demo['B19001_001E']),
          kids_yes: parseFloat(demo['B19001_002E']) / parseFloat(demo['B19001_001E']),
          kids_no: parseFloat(demo['B19001_003E']) / parseFloat(demo['B19001_001E']),
          persons_household: parseFloat(demo['B15003_001E']),
          average_home_value: parseFloat(demo['B15003_002E']),
          household_income: parseFloat(demo['B19001_001E']),
          income_0_50: parseFloat(demo['B19001_002E']) / parseFloat(demo['B19001_001E']),
          income_50_100: parseFloat(demo['B19001_003E']) / parseFloat(demo['B19001_001E']),
          income_100_150: parseFloat(demo['B19001_004E']) / parseFloat(demo['B19001_001E']),
          income_150: parseFloat(demo['B19001_005E']) / parseFloat(demo['B19001_001E']),
          num_establishments: demo['num_establishments'] || 'N/A'
        },
        target_population: demo['B01001_001E'] || 'N/A',
        targeted_region_summary: demo['NAME'] || 'N/A',
        target_region: demo['NAME'] || 'N/A',
        population: demo['B01001_001E'] || 'N/A',
        income: `$${demo['B19001_001E'] || 'N/A'}`,
        total_households: demo['B19001_001E'] || 'N/A',
        normalized_race_population: demo['B01001_001E'] || 'N/A',
        region_population: demo['B01001_001E'] || 'N/A'
      } ];
    };


    const formatted_data = extractStatistics(demographics_data);

   
    if (formatted_data.error) {
      console.log('error:', formatted_data.error);
      
      return { error: formatted_data.error };
    }

   return formatted_data;
   //return res.json(formatted_data);

  } catch (error) {
    console.log('error:', error);
      
   //return res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};




const getdemography = async (req, res) => {
  const { data } = req.body;
  try {
    let results = [];  


        for (const item of data) {
        let formatted_data = await getdemographydata(item.zip_code, item.fipsCode);
        if(formatted_data.error){
          return res.status(500).json({ error: `Failed to process data: ${formatted_data}` });
        }
        results.push(formatted_data[0]); // Assuming you want only the first element
        }
      console.log("formatted_data", results)

      
      const mergedObject = results.reduce((acc, current) => {
        for (const key in current) {
          if (typeof current[key] === 'object' && current[key] !== null) {
            // Recursively merge nested objects
            acc[key] = acc[key] ? { ...acc[key], ...current[key] } : current[key];
          } else if (typeof current[key] === 'number' && acc[key] === null) {
            // Take the number if the existing value is null
            acc[key] = current[key];
          } else if (typeof acc[key] === 'number' && typeof current[key] === 'number') {
            // Sum numbers if both are numeric
            acc[key] += current[key];
          } else if (acc[key] === null || acc[key] === undefined) {
            // Take the value if the existing value is null or undefined
            acc[key] = current[key];
          }
        }
        return acc;
      }, {});

      console.log("Merged Object:", mergedObject);

          

        res.json(mergedObject);
  } catch (error) {
    //res.status(500).json({ error: `Failed to process data: ${error.message}` });
  }
};


const getproposalbyId = async (req, res) => {
  try {
  
    const { id } = req.params;

    const Proposal = await 
    proposals.findOne({_id: id}) 
      
  
    return res.json({
      success: true,
      data: Proposal,
     
    });
  } catch (error) {
    console.error(error); 
    return res.status(500).json({ success: false, error: 'Error retrieving mat' });
  }
};

const cloneProposal  = async (req, res) => {
    try {
    // 1. Extract the campaign ID from the request body
    const { id } = req.body;

    // 2. Find the campaign by ID
    let campaign = await proposals.findOne({ _id: id });

    if (!campaign) {
      return res.status(404).json({ success: false, message: "proposal not found" });
    }

    //let oldCompanyName = campaign?.campaignName || "";
    //let oldOrderId = campaign?.orderId || "";

    // Convert the Mongoose document to a plain JavaScript object
    let campaignObject = campaign.toObject();

    // Remove fields that should not be duplicated
    delete campaignObject._id;
    //delete campaignObject.campaignName;
    //delete campaignObject.orderId;

    let date = new Date().getTime();
    // 3. Clone the campaign details
    const clonedCampaignDetails = {
      ...campaignObject, // Spread operator to copy the existing details
      createdDate: Date.now(), // Set new created date
    };

    // 4. Save the cloned campaign
    const newCampaign = await proposals.create(clonedCampaignDetails);

    res.send({ success: true, data: newCampaign, oldCampaign: campaign });

  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).json({ success: false, error: error.message });
  }
}


const archiveProposal = async (req, res) => {
  try {
    // 1. Extract the campaign ID and status from the request body
    const { _id, status } = req.body;

    if (!_id || status === undefined) {
      // Validate input
      return res.status(400).json({ success: false, error: "Missing required fields (_id or status)." });
    }

    // 2. Find and update the campaign by ID
    const updatedCampaign = await proposals.findOneAndUpdate(
      { _id }, // Match the campaign by ID
      { isArchive: status }, // Update the isArchive field
      { new: true } // Return the updated document
    );

    if (!updatedCampaign) {
      // Handle case where the campaign is not found
      return res.status(404).json({ success: false, error: "Campaign not found." });
    }

    // 3. Respond with success and the updated campaign
    res.send({ success: true, data: updatedCampaign });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ success: false, error: error.message });
  }
};




const testApi = async (req, res) => {
  try {
    let dataGroups = req.body.dotGroups;
    let eventId = "abc";

    const dotGroups = dataGroups.map((group) => {
      const dotsWithExtraFields = group.dots.map((dot, index) => ({
        ...dot,
        price: 0,
        images: [],
      }));

      return {
        ...group,
        eventId,
        dots: dotsWithExtraFields,
      };
    });
    // Save each group in MongoDB
     await testData.insertMany(dotGroups);
    console.log("Dot groups saved successfully!");
    res.send({ success: true, data: dotGroups });
   
  } catch (error) {
    console.error("Error saving dot groups:", error);
  }
};

const testApiupdate = async (req, res) => {
  try {
    let dataGroups = req.body.dotGroups;
    let eventId = "abc";
    let responseData = [];

    for (const group of dataGroups) {
      const checkdata = await testData.findOne({ eventId, seatMapId: group.seatMapId });

      const dotsWithExtraFields = group.dots.map((dot) => ({
        ...dot,
        price: dot.price || 0,
        images: dot.images || [],
      }));

      const groupToSave = {
        ...group,
        eventId,
        dots: dotsWithExtraFields,
      };

      let savedData;

      if (checkdata) {
        await testData.updateOne(
          { eventId, seatMapId: group.seatMapId },
          { $set: groupToSave }
        );
        savedData = await testData.findOne({ eventId, seatMapId: group.seatMapId }); // updated data ko fetch karna
      } else {
        savedData = await testData.create(groupToSave);
      }

      responseData.push(savedData);
    }

    console.log("Dot groups processed successfully!");
    res.send({ success: true, message: "Dot groups processed successfully!", data: responseData });

  } catch (error) {
    console.error("Error saving dot groups:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

const getTestApi = async (req, res) => {
  try {
    const { eventId } = req.query;
    const dotGroups = await testData.find({ eventId });
    res.json({ success: true, dotGroups });
  } catch (error) {
    console.error("Error fetching dot groups:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const updateTestApi = async (req, res) => {
  try {
    let eventId = "abc";
    let dotId = 337;
    let price = 6;
    let image = ["images1", "images2"]
    const updatedGroup = await testData.findOneAndUpdate(
      {
        eventId,
        "dots.id": dotId,
      },
      {
        $set: {
          "dots.$.price": price, // Update the price
          "dots.$.images": image, // Update the images
        },
      },
      { new: true }
    );

    if (updatedGroup) {
      console.log("Dot updated successfully:", updatedGroup);
      res.send({ success: true, data: updatedGroup });
    } else {
      console.log("Dot not found!");
      res.send({ success: false, data: null });
    }
  } catch (error) {
    console.error("Error updating dot:", error);
  }
};

console.log();




module.exports = { updateTestApi,testApiupdate, getTestApi, testApi,createUser,loginUser, getproposalbyId, archiveProposal, Createproposal, cloneProposal, getProposal, getdata, getinterestdata, getCensusData, fetchGoogleCompanies, fetchYelpBusiness, forgotPassword, resetPassword, getcity,getcitydetail,getcityzipcode,getradius,getallUsers, getdemography, getspecificdemography };