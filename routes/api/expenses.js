const express = require("express");
const router = express.Router();
const Expenses = require("../../models/expenses");
const ExpensesDetail = require("../../models/expenses_detail");
const Post = require("../../models/sub_account");
const Main = require("../../models/main_account");
const Coa = require("../../models/chart_of_account");
const Buku = require("../../models/buku");
const DetailBuku = require("../../models/buku_detail");
const moment = require("moment");

//GET ALL THE POST
router.get("/Biaya-data", async (req, res) => {
  try {
    const posts = await Expenses.find();
    res.json(posts);
  } catch (err) {
    res.json({message: err});
  }
});

//SUBMIT A POST
router.post("/Biaya-add", async (req, res) => {
  const expenses = new Expenses({
    pay_from_account_number: req.body.pay_from_account_number,
    beneficiary: req.body.beneficiary,
    transaction_date: req.body.transaction_date,
    payment_method: req.body.payment_method,
    expense_no: req.body.expense_no,
    tags: req.body.tags,
    billing_address: req.body.billing_address,
    total_expense_amount: req.body.total_expense_amount,
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
  });

  try {
    const savedPost = await expenses.save();
    let datasaved = 0;
    // console.log(savedPost._id);
    // res.json(savedPost);
    //
    Object.keys(req.body.expense_detail).map(async (item) => {
      const post = new ExpensesDetail({
        expenses_account: req.body.expense_detail[item].expenses_account,
        description: req.body.expense_detail[item].description,
        tax: req.body.expense_detail[item].tax,
        expenses_amount: req.body.expense_detail[item].expenses_amount,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        link_id: savedPost._id,
      });

      try {
        // const SubPost = await sub_post.save();
        let biaya_sub = await Post.findOne({
          sub_account_number: req.body.expense_detail[item].expenses_account,
          main_account_number:
            req.body.expense_detail[item].main_account_number,
          coa_account_number: req.body.expense_detail[item].coa_account_number,
        });
        try {
          let updatedpost = await Post.updateOne(
            {
              sub_account_number:
                req.body.expense_detail[item].expenses_account,
              main_account_number:
                req.body.expense_detail[item].main_account_number,
              coa_account_number:
                req.body.expense_detail[item].coa_account_number,
            },
            {
              $set: {
                total_debit:
                  biaya_sub.total_debit +
                  req.body.expense_detail[item].expenses_amount +
                  req.body.expense_detail[item].tax,
                updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
            }
          );
          try {
            //UPDATE MAIN ACC
            let specific_main_account = await Main.findOne({
              main_account_number:
                req.body.expense_detail[item].main_account_number,
              coa_account_number:
                req.body.expense_detail[item].coa_account_number,
            });

            let updatedmain = await Main.updateOne(
              {
                main_account_number:
                  req.body.expense_detail[item].main_account_number,
                coa_account_number:
                  req.body.expense_detail[item].coa_account_number,
              },
              {
                $set: {
                  total_debit:
                    specific_main_account.total_debit +
                    req.body.expense_detail[item].expenses_amount +
                    req.body.expense_detail[item].tax,
                  updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                },
              }
            );

            //UPDATE COA
            let specific_coa_account = await Coa.findOne({
              coa_account_number:
                req.body.expense_detail[item].coa_account_number,
            });

            let updatecoa = await Coa.updateOne(
              {
                coa_account_number:
                  req.body.expense_detail[item].coa_account_number,
              },
              {
                $set: {
                  total_debit:
                    specific_coa_account.total_debit +
                    req.body.expense_detail[item].expenses_amount +
                    req.body.expense_detail[item].tax,
                  updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                },
              }
            );

            //UPDATE KAS
            let post_kas = await Post.findOne({
              sub_account_number: 1,
              main_account_number: 1,
              coa_account_number: 1,
            });

            let updatedpost_kas = await Post.updateOne(
              {
                sub_account_number: 1,
                main_account_number: 1,
                coa_account_number: 1,
              },
              {
                $set: {
                  total_debit:
                    post_kas.total_debit -
                    req.body.expense_detail[item].expenses_amount -
                    req.body.expense_detail[item].tax,
                  updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                },
              }
            );

            let savedPost = await post.save();

            //POST BUKU BIAYA
            let postbuku = new DetailBuku({
              sub_account_number:
                req.body.expense_detail[item].expenses_account,
              main_account_number:
                req.body.expense_detail[item].main_account_number,
              coa_account_number:
                req.body.expense_detail[item].coa_account_number,
              created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
              updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
              description: req.body.expense_detail[item].description,
              total_debit: req.body.expense_detail[item].expenses_amount,
              total_kredit: 0,
              saldo: req.body.expense_detail[item].expenses_amount,
              tgl_transaksi: moment().format("YYYY-MM-DD HH:mm:ss"),
              nomor_bukti: req.body.expense_detail[item].nomor_bukti,
              link_id: 3,
            });

            let postbukusaved = await postbuku.save();
            if (postbukusaved != null) {
              let buku = await Buku.findOne({buku_id: 3});
              let saldo = buku.total_saldo;
              let debit = buku.total_debit;
              let kredit = buku.total_kredit;
              let updatedbuku = await Buku.updateOne(
                {buku_id: 3},
                {
                  $set: {
                    total_saldo:
                      saldo + req.body.expense_detail[item].expenses_amount,
                    total_debit:
                      debit + req.body.expense_detail[item].expenses_amount,
                    updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                  },
                }
              );
            }
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

    let postbukukas = new DetailBuku({
      sub_account_number: 1,
      main_account_number: 1,
      coa_account_number: 1,
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      description: req.body.tags,
      total_debit: 0,
      total_kredit: req.body.total_expense_amount,
      saldo: req.body.total_expense_amount,
      tgl_transaksi: moment().format("YYYY-MM-DD HH:mm:ss"),
      nomor_bukti: req.body.expense_no,
      link_id: 4,
    });

    let postbukukassaved = await postbukukas.save();

    if (postbukukassaved != null) {
      let BukuKAS = await Buku.findOne({buku_id: 4});
      let kas_saldo = BukuKAS.total_saldo;
      let kas_debit = BukuKAS.total_debit;
      let kas_kredit = BukuKAS.total_kredit;
      let updatedbuku = await Buku.updateOne(
        {buku_id: 4},
        {
          $set: {
            total_saldo: kas_saldo - req.body.total_expense_amount,
            total_kredit: kas_kredit + req.body.total_expense_amount,
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

//SPECIFIC POST
router.get("/:postId", async (req, res) => {
  try {
    // const post = await Post.findById({account_number: req.params.postId});
    const post = await Expenses.findById(req.params.postId);
    let responses = "";

    let postdetail = await ExpensesDetail.find({
      link_id: req.params.postId,
    });
    responses = {
      pay_from_account_number: post.pay_from_account_number,
      beneficiary: post.beneficiary,
      transaction_date: post.transaction_date,
      payment_method: post.payment_method,
      expense_no: post.expense_no,
      tags: post.tags,
      billing_address: post.billing_address,
      created_at: post.created_at,
      updated_at: post.updated_at,
      detail: postdetail,
    };

    // res.json(post);
    res.json(responses);
  } catch (err) {
    res.json({message: err});
  }
});

// //UPDATE POST
// router.patch("/:postId", async (req, res) => {
//   try {
//     const updatedpost = await Post.updateOne(
//       {_id: req.params.postId},
//       {
//         $set: {
//           CompanyName: req.body.CompanyName,
//           Address1: req.body.Address1,
//           Address2: req.body.Address2,
//           Country: req.body.Country,
//           City: req.body.City,
//           StateProvince: req.body.StateProvince,
//           ZipPostalCode: req.body.ZipPostalCode,
//           Email: req.body.Email,
//           Phone: req.body.Phone,
//           Fax: req.body.Fax,
//         },
//       }
//     );
//     res.json(updatedpost);
//   } catch (err) {
//     res.json({message: err});
//   }
// });

//DELETE POST
router.delete("/expense-delete/:postId", async (req, res) => {
  try {
    const removedpost = await Expenses.remove({
      _id: req.params.postId,
    });
    res.json(removedpost);
  } catch (err) {
    res.json({message: err});
  }
});

module.exports = router;
