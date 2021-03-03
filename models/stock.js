const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const StockSchema = mongoose.Schema({
  StockID: {
    type: Number,
  },
  purchaseID: {
    type: Number,
  },
  item_desc: {
    type: String,
  },
  qty: {
    type: Number,
  },
  harga_dasar: {
    type: Number,
  },
  harga_dasar_tanpapajak: {
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
});

StockSchema.plugin(AutoIncrement, {inc_field: "StockID"});
module.exports = mongoose.model("Stock", StockSchema);
