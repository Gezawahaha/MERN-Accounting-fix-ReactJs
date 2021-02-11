const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const AsetSchema = mongoose.Schema({
  aset_id: {
    type: Number,
    // required: true,
  },
  nama_barang: {
    type: String,
    required: true,
  },
  jumlah_barang: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
  },
  tanggal_beli: {
    type: String,
    required: true,
  },
  updated_at: {
    type: String,
  },
  created_at: {
    type: String,
  },
  coa_account_number: {
    type: Number,
    required: true,
  },
});

AsetSchema.plugin(AutoIncrement, {inc_field: "aset_id"});
module.exports = mongoose.model("Aset", AsetSchema);
