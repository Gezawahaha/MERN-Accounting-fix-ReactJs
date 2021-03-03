const mongoose = require("mongoose");
// const AutoIncrement = require("mongoose-sequence")(mongoose);

const SalesDetailSchema = mongoose.Schema({
  item_desc: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  total_price: {
    type: Number,
  },
  updated_at: {
    type: String,
  },
  created_at: {
    type: String,
  },
  link_id: {
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

// AsetSchema.plugin(AutoIncrement, {inc_field: "aset_id"});
module.exports = mongoose.model("SalesDetail", SalesDetailSchema);
