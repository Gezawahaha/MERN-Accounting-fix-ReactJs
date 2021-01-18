const express = require("express");
const router = express.Router();
const Expenses = require("../../models/expenses");
const ExpensesDetail = require("../../models/expenses_detail");
const moment = require("moment");

//GET ALL THE POST
router.get("/", async (req, res) => {
  try {
    const posts = await Expenses.find();
    res.json(posts);
  } catch (err) {
    res.json({message: err});
  }
});

//SUBMIT A POST
router.post("/", async (req, res) => {
  const post = new Expenses({
    pay_from_account_number: req.body.pay_from_account_number,
    beneficiary: req.body.beneficiary,
    transaction_date: req.body.transaction_date,
    payment_method: req.body.payment_method,
    expense_no: req.body.expense_no,
    tags: req.body.tags,
    billing_address: req.body.billing_address,
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
    const post = await Expenses.findById(req.params.postId);
    let responses = "";

    let postdetail = await ExpensesDetail.find({
      link_id: req.params.postId,
    });
    responses = {
      pay_from_account_number: post.pay_from_account_number,
      beneficiary: post.beneficiary,
      transaction_date: post.transaction_date,
      payment_method: post.payment_method,
      expense_no: post.expense_no,
      tags: post.tags,
      billing_address: post.billing_address,
      created_at: post.created_at,
      updated_at: post.updated_at,
      detail: postdetail,
    };

    // res.json(post);
    res.json(responses);
  } catch (err) {
    res.json({message: err});
  }
});

// //UPDATE POST
// router.patch("/:postId", async (req, res) => {
//   try {
//     const updatedpost = await Post.updateOne(
//       {_id: req.params.postId},
//       {
//         $set: {
//           CompanyName: req.body.CompanyName,
//           Address1: req.body.Address1,
//           Address2: req.body.Address2,
//           Country: req.body.Country,
//           City: req.body.City,
//           StateProvince: req.body.StateProvince,
//           ZipPostalCode: req.body.ZipPostalCode,
//           Email: req.body.Email,
//           Phone: req.body.Phone,
//           Fax: req.body.Fax,
//         },
//       }
//     );
//     res.json(updatedpost);
//   } catch (err) {
//     res.json({message: err});
//   }
// });

//DELETE POST
router.delete("/:postId", async (req, res) => {
  try {
    const removedpost = await Expenses.remove({
      _id: req.params.postId,
    });
    res.json(removedpost);
  } catch (err) {
    res.json({message: err});
  }
});

module.exports = router;
