const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const InvoiceSchema = mongoose.Schema({
  InvoiceID: {
    type: Number,
  },
  nomor_bukti: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
  },
  date: {
    type: String,
  },
  description: {
    type: String,
  },
  updated_at: {
    type: String,
  },
  created_at: {
    type: String,
  },
  link_id: {
    type: Number,
    required: true,
  },
  purchaseID: {
    type: Number,
  },
});

InvoiceSchema.plugin(AutoIncrement, {inc_field: "InvoiceID"});
module.exports = mongoose.model("Invoice", InvoiceSchema);
