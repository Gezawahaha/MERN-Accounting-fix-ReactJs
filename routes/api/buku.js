const express = require("express");
const router = express.Router();
const Buku = require("../../models/buku");
const DetailBuku = require("../../models/buku_detail");
const Post = require("../../models/chart_of_account");
const Main = require("../../models/main_account");
const Sub = require("../../models/sub_account");
const moment = require("moment");

//GET ALL THE POST
router.get("/", async (req, res) => {
  try {
    const posts = await Buku.find();
    res.json(posts);
  } catch (err) {
    res.json({message: err});
  }
});

//SUBMIT A POST
router.post("/", async (req, res) => {
  const post = new Buku({
    nama_buku: req.body.nama_buku,
    total_saldo: 0,
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

//SPECIFIC POST
router.get("/:postId", async (req, res) => {
  try {
    // const post = await Post.findById({account_number: req.params.postId});
    const post = await Buku.find({buku_id: req.params.postId});
    const datacount = post.length;
    if (datacount === 0) {
      res.json(posts);
    } else {
      const detail_buku = await DetailBuku.find({link_id: req.params.postId});
      let response = {
        buku_id: post.buku_id,
        nama_buku: post.nama_buku,
        total_saldo: post.total_saldo,
        total_debit: post.total_debit,
        total_kredit: post.total_kredit,
        updated_at: post.updated_at,
        created_at: post.created_at,
        details: detail_buku,
      };
      res.json(response);
    }
  } catch (err) {
    res.json({message: err});
  }
});

//UPDATE SALDO
router.patch("/:postId", async (req, res) => {
  try {
    const updatedpost = await Buku.updateOne(
      {buku_id: req.params.postId},
      {
        $set: {
          total_saldo: req.body.total_saldo,
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
    const buku = Buku.findOne({buku_id: req.params.postId});
    if (buku.length > 0) {
      const detailbukus = DetailBuku.find({link_id: buku.buku_id});
      Object.keys(detailbukus).map(async (item) => {
        let detailbuku = detailbukus[item];

        let detail_saldo = detailbuku.saldo;
        let detail_debit = detailbuku.total_debit;
        let detail_kredit = detailbuku.total_kredit;
        const buku = await Buku.findOne({buku_id: detailbuku.link_id});
        let saldo = buku.total_saldo;
        let debit = buku.total_debit;
        let kredit = buku.total_kredit;
        const updatedpost = await Buku.updateOne(
          {buku_id: req.body.link_id},
          {
            $set: {
              total_saldo: saldo - detail_saldo,
              total_debit: debit - detail_debit,
              total_kredit: kredit - detail_kredit,
              updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
          }
        );

        //UPDATE SUB
        const sub = Sub.findOne({
          coa_account_number: detailbuku.coa_account_number,
          main_account_number: detailbuku.main_account_number,
          sub_account_number: detailbuku.sub_account_number,
        });
        let sub_debit = sub.total_debit;
        let sub_kredit = sub.total_kredit;

        const updatedsub = await Sub.updateOne(
          {
            coa_account_number: detailbuku.coa_account_number,
            main_account_number: detailbuku.main_account_number,
            sub_account_number: detailbuku.sub_account_number,
          },
          {
            $set: {
              total_debit: sub_debit + detail_debit,
              total_kredit: sub_kredit + detail_kredit,
              updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
          }
        );

        //UPDATE MAIN
        const main = Main.findOne({
          coa_account_number: detailbuku.coa_account_number,
          main_account_number: detailbuku.main_account_number,
        });
        let main_debit = main.total_debit;
        let main_kredit = main.total_kredit;

        const updatedmain = await Main.updateOne(
          {
            coa_account_number: detailbuku.coa_account_number,
            main_account_number: detailbuku.main_account_number,
          },
          {
            $set: {
              total_debit: main_debit + detail_debit,
              total_kredit: main_kredit + detail_kredit,
              updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
          }
        );

        //UPDATE COA
        const coa = Post.findOne({
          coa_account_number: detailbuku.coa_account_number,
        });
        let coa_debit = coa.total_debit;
        let coa_kredit = coa.total_kredit;

        const updatedcoa = await Post.updateOne(
          {coa_account_number: detailbuku.coa_account_number},
          {
            $set: {
              total_debit: coa_debit + detail_debit,
              total_kredit: coa_kredit + detail_kredit,
              updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
          }
        );
      });
    }

    const removedpost = await Buku.remove({
      buku_id: req.params.postId,
    });
    res.json(removedpost);
  } catch (err) {
    res.json({message: err});
  }
});

module.exports = router;
