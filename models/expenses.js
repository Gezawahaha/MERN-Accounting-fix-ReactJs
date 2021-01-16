const mongoose = require("mongoose");

const ExpensesSchema = mongoose.Schema({
  pay_from_account_number: {
    type: String,
    required: true,
  },
  beneficiary: {
    type: String,
    required: true,
  },
  transaction_date: {
    type: String,
  },
  payment_method: {
    type: String,
  },
  expense_no: {
    type: Number,
  },
  tags: {
    type: String,
  },
  billing_address: {
    type: String,
  },
  updated_at: {
    type: String,
  },
  created_at: {
    type: String,
  },
});

module.exports = mongoose.model("Expenses", ExpensesSchema);
