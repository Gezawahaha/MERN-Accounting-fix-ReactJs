const mongoose = require("mongoose");

const BukuSchema = mongoose.Schema({
  buku_id: {
    type: Number,
    required: true,
  },
  nama_buku: {
    type: String,
    required: true,
  },
  total_saldo: {
    type: Number,
    required: true,
  },
  updated_at: {
    type: String,
  },
  created_at: {
    type: String,
  },
});

module.exports = mongoose.model("Buku", BukuSchema);
