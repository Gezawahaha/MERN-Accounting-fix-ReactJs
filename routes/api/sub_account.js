const express = require("express");
const router = express.Router();
const Post = require("../../models/sub_account");
const Main = require("../../models/main_account");
const moment = require("moment");

//GET ALL SUB ACCOUNT
router.get("/Sub-data", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json({message: err});
  }
});

//CREATE SUB ACCOUNT / INPUT PENGELUARAN
router.post("/", async (req, res) => {
  const post = new Post({
    sub_account_number: req.body.sub_account_number,
    name: req.body.name,
    total_debit: req.body.total_debit,
    total_kredit: req.body.total_kredit,
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    main_account_number: req.body.main_account_number,
  });

  try {
    const savedPost = await post.save();
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
            total_debit: debit + req.body.total_debit,
            total_kredit: kredit + req.body.total_kredit,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        }
      );
    } catch (err) {
      res.json({message: err});
    }
    res.json(savedPost);
  } catch (err) {
    res.json({message: err});
  }
});

//GET LIST SUB ACCOUNT BY MAIN ACCOUNT NUMBER
router.get("/:postId", async (req, res) => {
  try {
    // const post = await Post.findById({account_number: req.params.postId});
    const post = await Post.find({main_account_number: req.params.postId});
    res.json(post);
  } catch (err) {
    res.json({message: err});
  }
});

//EDIT PENGELUARAN
router.patch("/:postId", async (req, res) => {
  try {
    const updatedpost = await Post.updateOne(
      {sub_account_number: req.params.postId},
      {
        $set: {
          name: req.body.name,
          total_debit: req.body.total_debit,
          total_kredit: req.body.total_kredit,
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
      sub_account_number: req.params.postId,
    });
    res.json(removedpost);
  } catch (err) {
    res.json({message: err});
  }
});

module.exports = router;
