const mongoose = require("mongoose");

const ChartsOfAccountSchema = mongoose.Schema({
  coa_account_number: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  total_debit: {
    type: Number,
  },
  total_kredit: {
    type: Number,
  },
  updated_at: {
    type: String,
  },
  created_at: {
    type: String,
  },
});

module.exports = mongoose.model("ChartsOfAccount", ChartsOfAccountSchema);
