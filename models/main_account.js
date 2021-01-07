const mongoose = require("mongoose");

const MainAccountSchema = mongoose.Schema({
  main_account_number: {
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
  coa_account_number: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("MainAccount", MainAccountSchema);
