const express = require("express");
const router = express.Router();
const Post = require("../../models/chart_of_account");
const Main = require("../../models/main_account");
const moment = require("moment");

//GET ALL THE POST
router.get("/CoA-data", async (req, res) => {
  try {
    const posts = await Post.find();
    const datacount = posts.length;
    let count = 0;
    Object.keys(posts).map(async (item) => {
      let temporary = await Main.find({
        coa_account_number: posts[item].coa_account_number,
      });
      let total_debit = 0;
      let total_kredit = 0;
      Object.keys(temporary).map((temporaryitem) => {
        // Create a new array based on current state:
        total_debit = total_debit + temporary[temporaryitem].total_debit;
        total_kredit = total_kredit + temporary[temporaryitem].total_kredit;
      });
      const updatedpost = await Post.updateOne(
        {coa_account_number: posts[item].coa_account_number},
        {
          $set: {
            name: posts[item].name,
            total_debit: total_debit,
            total_kredit: total_kredit,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        }
      );
      count = count + 1;
      if (datacount == count) {
        const anotherone = await Post.find();
        res.json(anotherone);
      }
    });
  } catch (err) {
    res.json({message: err});
  }
});

//SUBMIT A POST
router.post("/add-CoA", async (req, res) => {
  const post = new Post({
    coa_account_number: req.body.coa_account_number,
    name: req.body.name,
    total_debit: 0,
    total_kredit: 0,
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

//UPDATE POST
router.patch("/:postId", async (req, res) => {
  try {
    const updatedpost = await Post.updateOne(
      {coa_account_number: req.params.postId},
      {
        $set: {
          name: req.body.name,
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
      coa_account_number: req.params.postId,
    });
    res.json(removedpost);
  } catch (err) {
    res.json({message: err});
  }
});

module.exports = router;
