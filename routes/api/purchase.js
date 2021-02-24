const express = require("express");
const router = express.Router();
const Expenses = require("../../models/expenses");
const ExpensesDetail = require("../../models/expenses_detail");
const Post = require("../../models/sub_account");
const Main = require("../../models/main_account");
const Coa = require("../../models/chart_of_account");
const Buku = require("../../models/buku");
const DetailBuku = require("../../models/buku_detail");
const Purchase = require("../../models/purchase");
const PurchaseDetail = require("../../models/purchase_detail");
const Invoice = require("../../models/invoice");
const moment = require("moment");

//GET ALL THE POST
router.get("/purchase-data", async (req, res) => {
  try {
    const posts = await Purchase.find();
    res.json(posts);
  } catch (err) {
    res.json({message: err});
  }
});

//SUBMIT A POST
router.post("/purchase-add", async (req, res) => {
  const purchase = new Purchase({
    supplierID: req.body.supplierID,
    no_purchase: req.body.no_purchase,
    purchaseDate: req.body.purchaseDate,
    dueDate: req.body.dueDate,
    total_amount_purchase: req.body.total_amount_purchase,
    amount_dibayar: 0,
    status: 0,
    keterangan: req.body.keterangan,
    coa_account_number: req.body.coa_account_number,
    main_account_number: req.body.main_account_number,
    sub_account_number: req.body.sub_account_number,
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
  });

  try {
    const savedPost = await purchase.save();
    let datasaved = 0;

    Object.keys(req.body.purchase_detail).map(async (item) => {
      const post = new PurchaseDetail({
        item_desc: req.body.purchase_detail[item].item_desc,
        qty: req.body.purchase_detail[item].qty,
        price: req.body.purchase_detail[item].price,
        total_price: req.body.purchase_detail[item].total_price,
        coa_account_number: req.body.purchase_detail[item].coa_account_number,
        main_account_number: req.body.purchase_detail[item].main_account_number,
        sub_account_number: req.body.purchase_detail[item].sub_account_number,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        link_id: savedPost._id,
      });

      try {
        // const SubPost = await sub_post.save();
        let biaya_sub = await Post.findOne({
          coa_account_number: req.body.purchase_detail[item].coa_account_number,
          main_account_number:
            req.body.purchase_detail[item].main_account_number,
          sub_account_number: req.body.purchase_detail[item].sub_account_number,
        });
        try {
          let updatedpost = await Post.updateOne(
            {
              coa_account_number:
                req.body.purchase_detail[item].coa_account_number,
              main_account_number:
                req.body.purchase_detail[item].main_account_number,
              sub_account_number:
                req.body.purchase_detail[item].sub_account_number,
            },
            {
              $set: {
                total_debit:
                  biaya_sub.total_debit +
                  req.body.purchase_detail[item].total_price,
                updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
            }
          );
          try {
            //UPDATE MAIN ACC
            let specific_main_account = await Main.findOne({
              coa_account_number:
                req.body.purchase_detail[item].coa_account_number,
              main_account_number:
                req.body.purchase_detail[item].main_account_number,
            });

            let debit = specific_main_account.total_debit;
            let kredit = specific_main_account.total_kredit;
            let updatedmain = await Main.updateOne(
              {
                coa_account_number:
                  req.body.purchase_detail[item].coa_account_number,
                main_account_number:
                  req.body.purchase_detail[item].main_account_number,
              },
              {
                $set: {
                  total_debit:
                    debit + req.body.purchase_detail[item].total_price,
                  updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                },
              }
            );

            //UPDATE COA
            let specific_coa_account = await Coa.findOne({
              coa_account_number:
                req.body.purchase_detail[item].coa_account_number,
            });

            let coa_debit = specific_coa_account.total_debit;
            let coa_kredit = specific_coa_account.total_kredit;
            let updatecoa = await Coa.updateOne(
              {
                coa_account_number:
                  req.body.purchase_detail[item].coa_account_number,
              },
              {
                $set: {
                  total_debit:
                    coa_debit + req.body.purchase_detail[item].total_price,
                  updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                },
              }
            );

            let savedPost = await post.save();
            // res.json(savedPost);
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

    //UPDATE HUTANG DAGANG
    let sub_hutang = await Post.findOne({
      coa_account_number: req.body.coa_account_number,
      main_account_number: req.body.main_account_number,
      sub_account_number: req.body.sub_account_number,
    });

    let updatedsub_hutang = await Post.updateOne(
      {
        coa_account_number: req.body.coa_account_number,
        main_account_number: req.body.main_account_number,
        sub_account_number: req.body.sub_account_number,
      },
      {
        $set: {
          total_kredit:
            sub_hutang.total_kredit + req.body.total_amount_purchase,
          updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      }
    );

    let post_hutang = await Main.findOne({
      coa_account_number: req.body.coa_account_number,
      main_account_number: req.body.main_account_number,
    });

    let updatedmain_hutang = await Main.updateOne(
      {
        coa_account_number: req.body.coa_account_number,
        main_account_number: req.body.main_account_number,
      },
      {
        $set: {
          total_kredit:
            post_hutang.total_kredit + req.body.total_amount_purchase,
          updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      }
    );

    let post_coa_hutang = await Coa.findOne({
      coa_account_number: req.body.coa_account_number,
    });

    let updatedcoa_hutang = await Coa.updateOne(
      {
        coa_account_number: req.body.coa_account_number,
      },
      {
        $set: {
          total_kredit:
            post_coa_hutang.total_kredit + req.body.total_amount_purchase,
          updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      }
    );

    //POST BUKU HUTANG
    let posthutang = new DetailBuku({
      coa_account_number: req.body.coa_account_number,
      main_account_number: req.body.main_account_number,
      sub_account_number: req.body.sub_account_number,
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      description: req.body.keterangan,
      total_debit: 0,
      total_kredit: req.body.total_amount_purchase,
      saldo: 0,
      tgl_transaksi: moment().format("YYYY-MM-DD HH:mm:ss"),
      nomor_bukti: req.body.no_purchase,
      link_id: 7,
    });

    let posthutangsaved = await posthutang.save();
    if (posthutangsaved != null) {
      let bukuhutang = await Buku.findOne({buku_id: 7});
      let kredit = bukuhutang.total_kredit;
      let updatedhutang = await Buku.updateOne(
        {buku_id: 7},
        {
          $set: {
            total_kredit: kredit + req.body.total_amount_purchase,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        }
      );
    }

    res.json(savedPost);
  } catch (err) {
    res.json({message: err});
  }
});

// //SPECIFIC POST
// router.get("/:postId", async (req, res) => {
//   try {
//     // const post = await Post.findById({account_number: req.params.postId});
//     const post = await Expenses.findById(req.params.postId);
//     let responses = "";

//     let postdetail = await ExpensesDetail.find({
//       link_id: req.params.postId,
//     });
//     responses = {
//       pay_from_account_number: post.pay_from_account_number,
//       beneficiary: post.beneficiary,
//       transaction_date: post.transaction_date,
//       payment_method: post.payment_method,
//       expense_no: post.expense_no,
//       tags: post.tags,
//       billing_address: post.billing_address,
//       created_at: post.created_at,
//       updated_at: post.updated_at,
//       detail: postdetail,
//     };

//     // res.json(post);
//     res.json(responses);
//   } catch (err) {
//     res.json({message: err});
//   }
// });

//PEMBAYARAN / PELUNASAN
router.post("/pelunasan", async (req, res) => {
  const invoice = new Invoice({
    nama_buku: req.body.nama_buku,
    InvoiceID: req.body.InvoiceID,
    nomor_bukti: req.body.nomor_bukti,
    amount: req.body.amount,
    date: req.body.date,
    description: req.body.description,
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    link_id: req.body.link_id, //BUKU BANK
    purchaseID: req.body.purchaseID, //AMBIL PURCHASE ID DARI PURCHASE
    // coa_account_number: req.body.coa_account_number,
    // main_account_number: req.body.main_account_number,
    // sub_account_number: req.body.sub_account_number,
  });

  try {
    const savedPost = await invoice.save();

    //UPDATE PURCHASE
    let pelunasan_purchase = await Purchase.findOne({
      purchaseID: req.body.purchaseID,
    });
    let sudah_dibayar = pelunasan_purchase.amount_dibayar;
    let total_yang_harusdibayar = pelunasan_purchase.total_amount_purchase;
    if (total_yang_harusdibayar == sudah_dibayar + req.body.amount) {
      let updatepurchase = await Purchase.updateOne(
        {
          purchaseID: req.body.purchaseID,
        },
        {
          $set: {
            amount_dibayar: sudah_dibayar + req.body.amount,
            status: 1,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        }
      );
    } else {
      let updatepurchase = await Purchase.updateOne(
        {
          purchaseID: req.body.purchaseID,
        },
        {
          $set: {
            amount_dibayar: sudah_dibayar + req.body.amount,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        }
      );
    }

    //UPDATE BANK
    let postbukubank = new DetailBuku({
      coa_account_number: req.body.coa_account_number,
      main_account_number: req.body.main_account_number,
      sub_account_number: req.body.sub_account_number,
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      description: req.body.description,
      total_debit: 0,
      total_kredit: req.body.amount,
      saldo: 0,
      tgl_transaksi: req.body.date,
      nomor_bukti: req.body.nomor_bukti,
      link_id: req.body.link_id,
    });

    let postbukubanksaved = await postbukubank.save();
    if (postbukubanksaved != null) {
      let bukubank = await Buku.findOne({buku_id: req.body.link_id});
      let kredit = bukubank.total_kredit;
      let saldo = bukubank.total_saldo;
      let updatedhutang = await Buku.updateOne(
        {buku_id: req.body.link_id},
        {
          $set: {
            total_kredit: kredit + req.body.amount,
            total_saldo: saldo - req.body.amount,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        }
      );
    }

    //UPDATE HUTANG DAGANG
    let sub_hutang = await Post.findOne({
      coa_account_number: req.body.hutang_coa_account_number,
      main_account_number: req.body.hutang_main_account_number,
      sub_account_number: req.body.hutang_sub_account_number,
    });

    let updatedsub_hutang = await Post.updateOne(
      {
        coa_account_number: req.body.hutang_coa_account_number,
        main_account_number: req.body.hutang_main_account_number,
        sub_account_number: req.body.hutang_sub_account_number,
      },
      {
        $set: {
          total_kredit: sub_hutang.total_kredit - req.body.amount,
          updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      }
    );

    let post_hutang = await Main.findOne({
      coa_account_number: req.body.hutang_coa_account_number,
      main_account_number: req.body.hutang_main_account_number,
    });

    let updatedpost_hutang = await Main.updateOne(
      {
        coa_account_number: req.body.hutang_coa_account_number,
        main_account_number: req.body.hutang_main_account_number,
      },
      {
        $set: {
          total_kredit: post_hutang.total_kredit - req.body.amount,
          updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      }
    );

    let post_coa_hutang = await Coa.findOne({
      coa_account_number: req.body.hutang_coa_account_number,
    });

    let updatedcoa_hutang = await Coa.updateOne(
      {
        coa_account_number: req.body.hutang_coa_account_number,
      },
      {
        $set: {
          total_kredit: post_coa_hutang.total_kredit + req.body.amount,
          updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      }
    );

    //POST BUKU HUTANG
    let posthutang = new DetailBuku({
      coa_account_number: req.body.hutang_coa_account_number,
      main_account_number: req.body.hutang_main_account_number,
      sub_account_number: req.body.hutang_sub_account_number,
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      description: req.body.description,
      total_debit: req.body.amount,
      total_kredit: 0,
      saldo: 0,
      tgl_transaksi: moment().format("YYYY-MM-DD HH:mm:ss"),
      nomor_bukti: req.body.nomor_bukti,
      link_id: 7,
    });

    let posthutangsaved = await posthutang.save();
    if (posthutangsaved != null) {
      let bukuhutang = await Buku.findOne({buku_id: 7});
      let kredit = bukuhutang.total_kredit;
      let debit = bukuhutang.total_debit;
      let updatedhutang = await Buku.updateOne(
        {buku_id: 7},
        {
          $set: {
            total_debit: debit + req.body.amount,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        }
      );
    }

    res.json(savedPost);
  } catch (err) {
    res.json({message: err});
  }
});

// //DELETE POST
// router.delete("/purchase-delete/:postId", async (req, res) => {
//   try {
//     const removedpost = await Expenses.remove({
//       _id: req.params.postId,
//     });
//     res.json(removedpost);
//   } catch (err) {
//     res.json({message: err});
//   }
// });

module.exports = router;
