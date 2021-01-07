const express = require("express");
const router = express.Router();
const Post = require("../../models/payments");
const moment = require("moment");

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
    PaymentID: req.body.PaymentID,
    BankAccount: req.body.BankAccount,
    AccountNumber: req.body.AccountNumber,
    coa_account_number: req.body.coa_account_number,
    main_account_number: req.body.main_account_number,
    description: req.body.description,
    amount: req.body.amount,
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
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
    const post = await Post.find({PaymentID: req.params.postId});
    res.json(post);
  } catch (err) {
    res.json({message: err});
  }
});

//UPDATE POST
router.patch("/:postId", async (req, res) => {
  try {
    const updatedpost = await Post.updateOne(
      {PaymentID: req.params.postId},
      {
        $set: {
          BankAccount: req.body.BankAccount,
          AccountNumber: req.body.AccountNumber,
          coa_account_number: req.body.coa_account_number,
          main_account_number: req.body.main_account_number,
          description: req.body.description,
          amount: req.body.amount,
          updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
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
      PaymentID: req.params.postId,
    });
    res.json(removedpost);
  } catch (err) {
    res.json({message: err});
  }
});

module.exports = router;
