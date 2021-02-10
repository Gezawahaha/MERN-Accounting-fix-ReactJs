const mongoose = require("mongoose");

const CustomerSchema = mongoose.Schema({
  CustomerID: {type: String, required: true, unique: true},
  SalesID: {type: String},
  CompanyName: {type: String},
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

module.exports = mongoose.model("Customer", CustomerSchema);
