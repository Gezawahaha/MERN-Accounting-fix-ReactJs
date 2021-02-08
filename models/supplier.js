const mongoose = require("mongoose");

const SupplierSchema = mongoose.Schema({
  SupplierID: {type: String, required: true, unique: true},
  CompanyName: {type: String, required: true},
  Address1: {type: String},
  Address2: {type: String},
  Country: {type: String},
  City: {type: String},
  StateProvince: {type: String},
  ZipPostalCode: {type: Number},
  Email: {type: String},
  Phone: {type: Number},
  Fax: {type: String},
});

module.exports = mongoose.model("Supplier", SupplierSchema);
