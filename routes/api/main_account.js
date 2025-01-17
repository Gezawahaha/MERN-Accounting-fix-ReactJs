const express = require("express");
const router = express.Router();
const Post = require("../../models/main_account");
const Sub = require("../../models/sub_account");
const moment = require("moment");
const isEmpty = require("is-empty");

//SUBMIT A POST
router.post("/MoA-add", async (req, res) => {
  const post = new Post({
    main_account_number: req.body.main_account_number,
    name: req.body.name,
    total_debit: 0,
    total_kredit: 0,
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    coa_account_number: req.body.coa_account_number,
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
    const posts = await Post.find({coa_account_number: req.params.postId});
    const datacount = posts.length;
    res.json(posts);
    // if (datacount === 0) {
    //   res.json(posts);
    // } else {
    //   let count = 0;
    //   Object.keys(posts).map(async (item) => {
    //     let temporary = await Sub.find({
    //       main_account_number: posts[item].main_account_number,
    //     });
    //     const temporarydatacount = posts.length;
    //     let temporary_totaldebit = posts[item].total_debit;
    //     let temporary_totalkredit = posts[item].total_kredit;
    //     let total_debit = 0;
    //     let total_kredit = 0;
    //     if (temporarydatacount === 0) {
    //     } else {
    //       Object.keys(temporary).map((temporaryitem) => {
    //         // Create a new array based on current state:
    //         total_debit = total_debit + temporary[temporaryitem].total_debit;
    //         total_kredit = total_kredit + temporary[temporaryitem].total_kredit;
    //       });
    //       if (
    //         temporary_totaldebit == total_debit &&
    //         temporary_totalkredit == total_kredit
    //       ) {
    //         const updatedpost = await Post.updateOne(
    //           {main_account_number: posts[item].main_account_number},
    //           {
    //             $set: {
    //               total_debit: total_debit,
    //               total_kredit: total_kredit,
    //             },
    //           }
    //         );
    //       } else {
    //         const updatedpost = await Post.updateOne(
    //           {main_account_number: posts[item].main_account_number},
    //           {
    //             $set: {
    //               total_debit: total_debit,
    //               total_kredit: total_kredit,
    //               updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    //             },
    //           }
    //         );
    //       }
    //     }

    //     count = count + 1;

    //     if (datacount == count) {
    //       const anotherone = await Post.find({
    //         coa_account_number: req.params.postId,
    //       });
    //       res.json(anotherone);
    //     }
    //   });
    // }
  } catch (err) {
    res.json({message: err});
  }
});

//UPDATE POST
router.patch("/:postId", async (req, res) => {
  try {
    const updatedpost = await Post.updateOne(
      {main_account_number: req.params.postId},
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
      main_account_number: req.params.postId,
    });
    res.json(removedpost);
  } catch (err) {
    res.json({message: err});
  }
});

//GET ALL POST
router.get("/test/MoA-data", async (req, res) => {
  try {
    // const post = await Post.findById({account_number: req.params.postId});
    const posts = await Post.find();
    const datacount = posts.length;
    let count = 0;
    res.json(posts);
    // if (datacount === 0) {
    //   res.json(posts);
    // } else {
    //   Object.keys(posts).map(async (item) => {
    //     let temporary = await Sub.find({
    //       main_account_number: posts[item].main_account_number,
    //       coa_account_number: posts[item].coa_account_number,
    //     });

    //     let temporary_totaldebit = posts[item].total_debit;
    //     let temporary_totalkredit = posts[item].total_kredit;
    //     let total_debit = 0;
    //     let total_kredit = 0;

    //     Object.keys(temporary).map((temporaryitem) => {
    //       // Create a new array based on current state:
    //       total_debit = total_debit + temporary[temporaryitem].total_debit;
    //       total_kredit = total_kredit + temporary[temporaryitem].total_kredit;
    //     });

    //     if (
    //       temporary_totaldebit == total_debit &&
    //       temporary_totalkredit == total_kredit
    //     ) {
    //       const updatedpost = await Post.updateOne(
    //         {
    //           main_account_number: posts[item].main_account_number,
    //           coa_account_number: posts[item].coa_account_number,
    //         },
    //         {
    //           $set: {
    //             total_debit: total_debit,
    //             total_kredit: total_kredit,
    //           },
    //         }
    //       );
    //     } else {
    //       const updatedpost = await Post.updateOne(
    //         {
    //           main_account_number: posts[item].main_account_number,
    //           coa_account_number: posts[item].coa_account_number,
    //         },
    //         {
    //           $set: {
    //             total_debit: total_debit,
    //             total_kredit: total_kredit,
    //             updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    //           },
    //         }
    //       );
    //     }

    //     count = count + 1;

    //     if (datacount == count) {
    //       const anotherone = await Post.find();
    //       res.json(anotherone);
    //     }
    //   });
    // }
  } catch (err) {
    res.json({message: err});
  }
});

module.exports = router;
