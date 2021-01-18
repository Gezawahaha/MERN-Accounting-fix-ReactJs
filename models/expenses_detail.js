const mongoose = require("mongoose");

const ExpensesDetailSchema = mongoose.Schema({
  expenses_account: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tax: {
    type: Number,
  },
  expenses_amount: {
    type: Number,
  },
  updated_at: {
    type: String,
  },
  created_at: {
    type: String,
  },
  link_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("ExpensesDetail", ExpensesDetailSchema);
