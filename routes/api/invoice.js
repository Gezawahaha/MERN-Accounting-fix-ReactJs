const express = require("express");
const router = express.Router();
const Post = require("../../models/invoice");

//GET ALL THE POST
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json({message: err});
  }
});

//SUBMIT A POST
router.post("/", async (req, res) => {
  const post = new Post({
    InvoiceID: req.body.InvoiceID,
    ContactID: req.body.ContactID,
    PaymentID: req.body.PaymentID,
    TermPayment: req.body.TermPayment,
    InvoiceNumber: req.body.InvoiceNumber,
    InvoiceDate: req.body.InvoiceDate,
    InvoiceDueDate: req.body.InvoiceDueDate,
    BillingAddress: req.body.BillingAddress,
    BillingCountry: req.body.BillingCountry,
    BillingCity: req.body.BillingCity,
    BillingPostalCode: req.body.BillingPostalCode,
    Phone: req.body.Phone,
    Quantity: req.body.Quantity,
    UnitPrice: req.body.UnitPrice,
    Tax: req.body.Tax,
  });

  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.json({message: err});
  }
});

//SPECIFIC POST
router.get("/:postId", async (req, res) => {
  try {
    // const post = await Post.findById({account_number: req.params.postId});
    const post = await Post.find({InvoiceID: req.params.postId});
    res.json(post);
  } catch (err) {
    res.json({message: err});
  }
});

//UPDATE POST
router.patch("/:postId", async (req, res) => {
  try {
    const updatedpost = await Post.updateOne(
      {InvoiceID: req.params.postId},
      {
        $set: {
          ContactID: req.body.ContactID,
          PaymentID: req.body.PaymentID,
          TermPayment: req.body.TermPayment,
          InvoiceNumber: req.body.InvoiceNumber,
          InvoiceDate: req.body.InvoiceDate,
          InvoiceDueDate: req.body.InvoiceDueDate,
          BillingAddress: req.body.BillingAddress,
          BillingCountry: req.body.BillingCountry,
          BillingCity: req.body.BillingCity,
          BillingPostalCode: req.body.BillingPostalCode,
          Phone: req.body.Phone,
          Quantity: req.body.Quantity,
          UnitPrice: req.body.UnitPrice,
          Tax: req.body.Tax,
        },
      }
    );
    res.json(updatedpost);
  } catch (err) {
    res.json({message: err});
  }
});

//DELETE POST
router.delete("/:postId", async (req, res) => {
  try {
    const removedpost = await Post.remove({
      InvoiceID: req.params.postId,
    });
    res.json(removedpost);
  } catch (err) {
    res.json({message: err});
  }
});

module.exports = router;
