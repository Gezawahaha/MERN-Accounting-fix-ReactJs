const mongoose = require("mongoose");

const EmployeeSchema = mongoose.Schema({
  EmployeeID: {type: String, required: true, unique: true},
  FirstName: {type: String},
  LastName: {type: String},
  JobTitle: {type: String},
  Gender: {type: String},
  BirthDate: {type: String},
  Salary: {type: Number},
  Phone: {type: Number},
  Address: {type: String},
  Field: {type: String},
});

module.exports = mongoose.model("Employee", EmployeeSchema);
