const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const PurchaseSchema = mongoose.Schema({
  supplierID: {
    type: Number,
    // required: true,
  },
  no_purchase: {
    type: String,
  },
  purchaseDate: {
    type: String,
  },
  dueDate: {
    type: String,
  },
  total_amount_purchase: {
    type: Number,
  },
  amount_dibayar: {
    type: Number,
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
  purchaseID: {
    type: Number,
  },
  keterangan: {
    type: String,
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

PurchaseSchema.plugin(AutoIncrement, {inc_field: "purchaseID"});
module.exports = mongoose.model("Purchase", PurchaseSchema);
