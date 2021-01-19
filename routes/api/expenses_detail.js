const express = require("express");
const router = express.Router();
const ExpensesDetail = require("../../models/expenses_detail");
const Post = require("../../models/sub_account");
const Main = require("../../models/main_account");
const moment = require("moment");

//GET ALL THE POST
router.get("/", async (req, res) => {
  try {
    const posts = await ExpensesDetail.find();
    res.json(posts);
  } catch (err) {
    res.json({message: err});
  }
});

//SUBMIT A POST
router.post("/", async (req, res) => {
  const post = new ExpensesDetail({
    expenses_account: req.body.expenses_account,
    description: req.body.description,
    tax: req.body.tax,
    expenses_amount: req.body.expenses_amount,
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    link_id: req.body.link_id,
  });
  const sub_post = new Post({
    sub_account_number: req.body.expenses_account,
    name: req.body.name,
    total_debit: 0,
    total_kredit: req.body.expenses_amount + req.body.tax,
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    main_account_number: req.body.main_account_number,
  });

  try {
    const savedPost = await sub_post.save();
    try {
      const specific_main_account = await Main.findOne({
        main_account_number: req.body.main_account_number,
      });
      let debit = specific_main_account.total_debit;
      let kredit = specific_main_account.total_kredit;
      const updatedpost = await Main.updateOne(
        {main_account_number: req.body.main_account_number},
        {
          $set: {
            name: req.body.name,
            total_debit: debit + 0,
            total_kredit: kredit + req.body.expenses_amount + req.body.tax,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        }
      );
      const savedPost = await post.save();
      res.json(savedPost);
    } catch (err) {
      res.json({message: err});
    }
    res.json(savedPost);
  } catch (err) {
    res.json({message: err});
  }
});

//SPECIFIC POST
router.get("/:postId", async (req, res) => {
  try {
    // const post = await Post.findById({account_number: req.params.postId});
    const post = await ExpensesDetail.find({_id: req.params.postId});
    res.json(post);
  } catch (err) {
    res.json({message: err});
  }
});

//DELETE POST
router.delete("/:postId", async (req, res) => {
  try {
    const post = await ExpensesDetail.findById(req.params.postId);
    let sub_post = {
      sub_account_number: post.expenses_account,
      name: post.name,
      total_debit: post.total_debit,
      total_kredit: post.total_kredit,
      main_account_number: post.main_account_number,
    };
    const specific_main_account = await Main.findOne({
      main_account_number: sub_post.main_account_number,
    });
    let debit = specific_main_account.total_debit;
    let kredit = specific_main_account.total_kredit;
    const updatedpost = await Main.updateOne(
      {main_account_number: sub_post.main_account_number},
      {
        $set: {
          name: sub_post.name,
          total_debit: debit - sub_post.total_debit,
          total_kredit: kredit - sub_post.total_kredit,
          updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      }
    );
    const removedpost = await ExpensesDetail.remove({
      _id: req.params.postId,
    });
    res.json(removedpost);
  } catch (err) {
    res.json({message: err});
  }
});

module.exports = router;
