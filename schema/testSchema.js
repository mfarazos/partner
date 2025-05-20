const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const testSchema = new mongoose.Schema({
  
  eventId: {
    type: String,
  }, 
  dots: [],
 bounds: {
 type: Object,   
 },
 centerVenue: {
    type: Boolean,   
},
columns: {
    type: Number,   
    },
    curveIntensity: {
       type: Number,   
   },
   seatMapId: {
    type: Number,   
    },
    labels: {
       type: Array,   
   },
   leftVenue: {
    type: String,   
    },
    rightVenue: {
       type: String,   
   },
   rotation: {
    type: Number,   
},
stretchFactor: {
 type: Number,   
 }

});

module.exports = { testSchema };