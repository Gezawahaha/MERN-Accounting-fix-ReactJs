const mongoose = require("mongoose");

const BukuSchema = mongoose.Schema({
  buku_id: {
    type: Number,
    required: true,
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
  updated_at: {
    type: String,
  },
  created_at: {
    type: String,
  },
  keterangan: {
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
});

module.exports = mongoose.model("Buku", BukuSchema);
