const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const BukuSchema = mongoose.Schema({
  buku_id: {
    type: Number,
    // required: true,
  },
  nama_buku: {
    type: String,
    required: true,
  },
  total_saldo: {
    type: Number,
    required: true,
  },
  total_debit: {
    type: Number,
    required: true,
  },
  total_kredit: {
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

BukuSchema.plugin(AutoIncrement, {inc_field: "buku_id"});
module.exports = mongoose.model("Buku", BukuSchema);
