const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const SalesSchema = mongoose.Schema({
  CustomerID: {
    type: Number,
  },
  MarketingID: {
    type: Number,
  },
  date: {
    type: String,
  },
  duedate: {
    type: String,
  },
  no_sales: {
    type: Number,
  },
  profit: {
    type: Number,
  },
  total_amount_sales: {
    type: Number,
  },
  amount_dibayar: {
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
  status: {
    type: Number,
  },
  updated_at: {
    type: String,
  },
  created_at: {
    type: String,
  },
});

module.exports = mongoose.model("Stock", SalesSchema);
