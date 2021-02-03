const mongoose = require("mongoose");

const BukuDetailSchema = mongoose.Schema({
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
  updated_at: {
    type: String,
  },
  created_at: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  total_debit: {
    type: Number,
  },
  total_kredit: {
    type: Number,
  },
  saldo: {
    type: Number,
    required: true,
  },
  tgl_transaksi: {
    type: String,
    required: true,
  },
  nomor_bukti: {
    type: String,
  },
  link_id: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("BukuDetail", BukuDetailSchema);
