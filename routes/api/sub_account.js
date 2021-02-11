const express = require("express");
const router = express.Router();
const Post = require("../../models/sub_account");
const Main = require("../../models/main_account");
const COA = require("../../models/chart_of_account");
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
router.post("/SoA-add", async (req, res) => {
  const post = new Post({
    sub_account_number: req.body.sub_account_number,
    name: req.body.name,
    total_debit: req.body.total_debit,
    total_kredit: req.body.total_kredit,
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    main_account_number: req.body.main_account_number,
    coa_account_number: req.body.coa_account_number,
  });

  try {
    const savedPost = await post.save();
    try {
      const specific_main_account = await Main.findOne({
        main_account_number: req.body.main_account_number,
        coa_account_number: req.body.coa_account_number,
      });
      let debit = specific_main_account.total_debit;
      let kredit = specific_main_account.total_kredit;
      const updatedpost = await Main.updateOne(
        {
          main_account_number: req.body.main_account_number,
          coa_account_number: req.body.coa_account_number,
        },
        {
          $set: {
            total_debit: debit + req.body.total_debit,
            total_kredit: kredit + req.body.total_kredit,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        }
      );

      const specific_coa_account = await COA.findOne({
        coa_account_number: req.body.coa_account_number,
      });
      let coa_debit = specific_coa_account.total_debit;
      let coa_kredit = specific_coa_account.total_kredit;
      const coa_updatedpost = await COA.updateOne(
        {
          coa_account_number: req.body.coa_account_number,
        },
        {
          $set: {
            total_debit: coa_debit + req.body.total_debit,
            total_kredit: coa_kredit + req.body.total_kredit,
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
router.get("/:coa/:postId", async (req, res) => {
  try {
    // const post = await Post.findById({account_number: req.params.postId});
    const post = await Post.find({
      main_account_number: req.params.postId,
      coa_account_number: req.params.coa,
    });
    res.json(post);
  } catch (err) {
    res.json({message: err});
  }
});

//EDIT PENGELUARAN
router.patch("/:coa/:main/:postId", async (req, res) => {
  try {
    const post = await Post.findOne({
      sub_account_number: req.params.postId,
      main_account_number: req.params.main,
      coa_account_number: req.params.coa,
    });
    const sub_debit = post.total_debit;
    const sub_kredit = post.total_kredit;

    const updatedpost = await Post.updateOne(
      {
        sub_account_number: req.params.postId,
        main_account_number: req.params.main,
        coa_account_number: req.params.coa,
      },
      {
        $set: {
          name: req.body.name,
          total_debit: req.body.total_debit,
          total_kredit: req.body.total_kredit,
          updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      }
    );

    try {
      const specific_main_account = await Main.findOne({
        main_account_number: req.params.main,
        coa_account_number: req.params.coa,
      });
      let debit = specific_main_account.total_debit;
      let kredit = specific_main_account.total_kredit;
      const updatemain = await Main.updateOne(
        {
          main_account_number: req.params.main,
          coa_account_number: req.params.coa,
        },
        {
          $set: {
            total_debit: debit - sub_debit + req.body.total_debit,
            total_kredit: kredit - sub_kredit + req.body.total_kredit,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        }
      );

      const specific_coa_account = await COA.findOne({
        coa_account_number: req.params.coa,
      });
      let coa_debit = specific_coa_account.total_debit;
      let coa_kredit = specific_coa_account.total_kredit;
      const coa_updatedpost = await COA.updateOne(
        {
          coa_account_number: req.body.coa,
        },
        {
          $set: {
            total_debit: coa_debit - sub_debit + req.body.total_debit,
            total_kredit: coa_kredit - sub_kredit + req.body.total_kredit,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        }
      );
    } catch (err) {
      res.json({message: err});
    }
    res.json(updatedpost);
  } catch (err) {
    res.json({message: err});
  }
});

//DELETE POST
router.delete("/delete/:postId", async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.postId,
    });
    const removed_coa = post.coa_account_number;
    const removed_main = post.main_account_number;
    const removed_sub = post.sub_account_number;
    const removed_debit = post.total_debit;
    const removed_kredit = post.total_kredit;

    try {
      const specific_main_account = await Main.findOne({
        main_account_number: removed_main,
        coa_account_number: removed_coa,
      });
      let debit = specific_main_account.total_debit;
      let kredit = specific_main_account.total_kredit;
      const updatemain = await Main.updateOne(
        {
          main_account_number: removed_main,
          coa_account_number: removed_coa,
        },
        {
          $set: {
            total_debit: debit - removed_debit,
            total_kredit: kredit - removed_kredit,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        }
      );

      const specific_coa_account = await COA.findOne({
        coa_account_number: removed_coa,
      });
      let coa_debit = specific_coa_account.total_debit;
      let coa_kredit = specific_coa_account.total_kredit;
      const coa_updatedpost = await COA.updateOne(
        {
          coa_account_number: req.body.coa,
        },
        {
          $set: {
            total_debit: coa_debit - removed_debit,
            total_kredit: coa_kredit - removed_kredit,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        }
      );
      try {
        const removedpost = await Post.remove({
          _id: req.params.postId,
        });
        res.json(removedpost);
      } catch (err) {
        res.json({message: err});
      }
    } catch (err) {
      res.json({message: err});
    }
  } catch (err) {
    res.json({message: err});
  }
});

router.get("/:coa", async (req, res) => {
  try {
    // const post = await Post.findById({account_number: req.params.postId});
    const post = await Post.find({
      coa_account_number: req.params.coa,
    });
    res.json(post);
  } catch (err) {
    res.json({message: err});
  }
});

module.exports = router;
