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
    type: String,
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
  total_expense_amount: {
    type: Number,
  },
  coa_account_number: {
    type: Number,
    required: true,
  },
  main_account_number: {
    type: Number,
    required: true,
  },
  sub_account_number: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Expenses", ExpensesSchema);
