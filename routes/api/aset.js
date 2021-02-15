const express = require("express");
const router = express.Router();
const Buku = require("../../models/buku");
const DetailBuku = require("../../models/buku_detail");
const COA = require("../../models/chart_of_account");
const Main = require("../../models/main_account");
const Sub = require("../../models/sub_account");
const Aset = require("../../models/aset");
const moment = require("moment");

//GET ALL THE POST
router.get("/Aset-Data", async (req, res) => {
  try {
    const posts = await Aset.find();
    res.json(posts);
  } catch (err) {
    res.json({message: err});
  }
});

//SUBMIT A POST
router.post("/Aset-add", async (req, res) => {
  const post = new Aset({
    nama_barang: req.body.nama_barang,
    jumlah_barang: req.body.jumlah_barang,
    price: req.body.price,
    total_price: req.body.total_price,
    tanggal_beli: req.body.tanggal_beli,
    coa_account_number: req.body.coa_account_number,
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
  });

  try {
    const savedPost = await post.save();
    const specific_coa_account = await COA.findOne({
      coa_account_number: req.body.coa_account_number,
    });
    let coa_debit = specific_coa_account.total_debit;
    const coa_updatedpost = await COA.updateOne(
      {
        coa_account_number: req.body.coa_account_number,
      },
      {
        $set: {
          total_debit: coa_debit + total_price,
          updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      }
    );
    res.json(savedPost);
  } catch (err) {
    res.json({message: err});
  }
});

//SPECIFIC POST
router.get("/:postId", async (req, res) => {
  try {
    // const post = await Post.findById({account_number: req.params.postId});
    const post = await Aset.find({coa_account_number: req.params.postId});
    const datacount = post.length;
    let response = "";
    if (datacount === 0) {
      res.json(post);
    } else {
      const coa = await COA.find({coa_account_number: req.params.postId});
      response = {
        coa_account_number: coa.coa_account_number,
        name: coa.name,
        total_debit: coa.total_debit,
        total_kredit: coa.total_kredit,
        updated_at: coa.updated_at,
        created_at: coa.created_at,
        asets: post,
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
    const aset = await Aset.findOne({
      aset_id: req.params.postId,
    });
    const aset_coa = aset.coa_account_number;
    const aset_totalprice = aset.total_price;

    const updatedpost = await Aset.updateOne(
      {aset_id: req.params.postId},
      {
        $set: {
          nama_barang: req.body.nama_barang,
          jumlah_barang: req.body.jumlah_barang,
          price: req.body.price,
          total_price: req.body.total_price,
        },
      }
    );

    try {
      const specific_coa_account = await COA.findOne({
        coa_account_number: aset_coa,
      });
      let coa_debit = specific_coa_account.total_debit;
      const coa_updatedpost = await COA.updateOne(
        {
          coa_account_number: aset_coa,
        },
        {
          $set: {
            total_debit: coa_debit - aset_totalprice + req.body.total_price,
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
router.delete("/:postId", async (req, res) => {
  try {
    const aset = await Aset.findOne({
      aset_id: req.params.postId,
    });
    const aset_coa = aset.coa_account_number;
    const aset_totalprice = aset.total_price;

    const specific_coa_account = await COA.findOne({
      coa_account_number: aset_coa,
    });
    let coa_debit = specific_coa_account.total_debit;
    const coa_updatedpost = await COA.updateOne(
      {
        coa_account_number: aset_coa,
      },
      {
        $set: {
          total_debit: coa_debit - aset_totalprice,
          updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      }
    );

    try {
      const removedpost = await Aset.remove({aset_id: req.params.postId});
      res.json(removedpost);
    } catch (err) {
      res.json({message: err});
    }
  } catch (err) {
    res.json({message: err});
  }
});

module.exports = router;
