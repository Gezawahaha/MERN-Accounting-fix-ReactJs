const express = require("express");
const router = express.Router();
const Post = require("../../models/sub_account");
const moment = require("moment");

//GET ALL THE POST
// router.get("/", async (req, res) => {
//   try {
//     const posts = await Post.find();
//     res.json(posts);
//   } catch (err) {
//     res.json({message: err});
//   }
// });

//SUBMIT A POST
router.post("/SoA-add", async (req, res) => {
  const post = new Post({
    sub_account_number: req.body.sub_account_number,
    name: req.body.name,
    total_debit: 0,
    total_kredit: 0,
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    main_account_number: req.body.main_account_number,
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
    const post = await Post.find({main_account_number: req.params.postId});
    res.json(post);
  } catch (err) {
    res.json({message: err});
  }
});

//UPDATE POST
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
