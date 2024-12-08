const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const interestSchema = new mongoose.Schema({
  
  category: {
    type: String,
  }, 
subcategories: []

});

module.exports = {interestSchema };