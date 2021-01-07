const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/api/users");
const akun = require("./routes/api/chart_of_account");

//require('./config/passport')(passport);

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.listen(9000);

const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log("MongoDB successfully connected."))
  .catch((err) => console.log(err));

app.use(passport.initialize());

app.use("/api", users);
app.use("/akun", akun);

//Import Routes
app.use(express.json());

const ChartOfAccountRoute = require("./routes/api/chart_of_account");
const MainAccountRoute = require("./routes/api/main_account");
const SubAccountRoute = require("./routes/api/sub_account");
// const CustomerRoute = require("./routes/api/customer");
// const EmployeeRoute = require("./routes/api/employee");
// const InvoiceRoute = require("./routes/api/invoice");
// const PaymentRoute = require("./routes/api/payments");
// const SupplierRoute = require("./routes/api/supplier");

app.use("/coa", ChartOfAccountRoute);
app.use("/coa/main", MainAccountRoute);
app.use("/coa/main/sub", SubAccountRoute);
// app.use("/customer", CustomerRoute);
// app.use("/employee", EmployeeRoute);
// app.use("/invoice", InvoiceRoute);
// app.use("/payments", PaymentRoute);
// app.use("/supplier", SupplierRoute);

app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// const port = process.env.PORT || 5000;
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
