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
      });
      let debit = specific_main_account.total_debit;
      let kredit = specific_main_account.total_kredit;
      const updatedpost = await Main.updateOne(
        {main_account_number: req.body.main_account_number},
        {
          $set: {
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
router.patch("/:main/:postId", async (req, res) => {
  try {
    const updatedpost = await Post.updateOne(
      {
        sub_account_number: req.params.postId,
        main_account_number: req.params.main,
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
      const posts = await Main.find();
      const datacount = posts.length;
      let count = 0;
      if (datacount === 0) {
        res.json(posts);
      } else {
        Object.keys(posts).map(async (item) => {
          let temporary = await Post.find({
            main_account_number: posts[item].main_account_number,
          });

          let temporary_totaldebit = posts[item].total_debit;
          let temporary_totalkredit = posts[item].total_kredit;
          let total_debit = 0;
          let total_kredit = 0;

          Object.keys(temporary).map((temporaryitem) => {
            // Create a new array based on current state:
            total_debit = total_debit + temporary[temporaryitem].total_debit;
            total_kredit = total_kredit + temporary[temporaryitem].total_kredit;
          });

          if (
            temporary_totaldebit == total_debit &&
            temporary_totalkredit == total_kredit
          ) {
            const updatedpost = await Main.updateOne(
              {main_account_number: posts[item].main_account_number},
              {
                $set: {
                  name: posts[item].name,
                  total_debit: total_debit,
                  total_kredit: total_kredit,
                },
              }
            );
          } else {
            const updatedpost = await Main.updateOne(
              {main_account_number: posts[item].main_account_number},
              {
                $set: {
                  name: posts[item].name,
                  total_debit: total_debit,
                  total_kredit: total_kredit,
                  updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                },
              }
            );
          }
        });
      }
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
    const removedpost = await Post.remove({
      sub_account_number: req.params.postId,
    });
    res.json(removedpost);
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
