const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const proposalSchema = new mongoose.Schema({
  proposalName: {
    type: String,
    required: true,  // Proposal name is mandatory
    
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
 
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  proposalData: {}
});

module.exports = { proposalSchema };
