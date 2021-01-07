const mongoose = require("mongoose");

const SubAccountSchema = mongoose.Schema({
  sub_account_number: {
    type: String,
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
  main_account_number: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("SubAccount", SubAccountSchema);
