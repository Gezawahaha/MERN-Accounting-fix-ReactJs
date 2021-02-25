const mongoose = require("mongoose");

const InvoiceSchema = mongoose.Schema({
  // nama_buku: {
  //   type: String,
  //   required: true,
  // },
  InvoiceID: {
    type: String,
    required: true,
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

module.exports = mongoose.model("Invoice", InvoiceSchema);
