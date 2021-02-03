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
  let saldoakhir = req.body.total_debit - req.body.total_kredit;
  const post = new DetailBuku({
    coa_account_number: req.body.coa_account_number,
    main_account_number: req.body.main_account_number,
    sub_account_number: req.body.sub_account_number,
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    description: req.body.description,
    total_debit: req.body.total_debit,
    total_kredit: req.body.total_kredit,
    saldo: saldoakhir,
    tgl_transaksi: req.body.tgl_transaksi,
    nomor_bukti: req.body.nomor_bukti,
    link_id: req.body.link_id,
  });

  try {
    // UPDATE BUKU
    const savedPost = await post.save();
    if (savedPost != null) {
      console.log("success");
      const buku = await Buku.findOne({buku_id: req.body.link_id});
      let saldo = buku.total_saldo;
      let debit = buku.total_debit;
      let kredit = buku.total_kredit;
      const updatedpost = await Buku.updateOne(
        {buku_id: req.body.link_id},
        {
          $set: {
            total_saldo: saldo + saldoakhir,
            total_debit: debit + req.body.total_debit,
            total_kredit: kredit + req.body.total_kredit,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        }
      );
    }

    //UPDATE SUB ACCOUNT
    if (savedPost != null) {
      const sub = await Sub.findOne({
        coa_account_number: req.body.coa_account_number,
        main_account_number: req.body.main_account_number,
        sub_account_number: req.body.sub_account_number,
      });
      let debit = sub.total_debit;
      let kredit = sub.total_kredit;
      const updatedsub = await Sub.updateOne(
        {_id: sub._id},
        {
          $set: {
            total_debit: debit + req.body.total_debit,
            total_kredit: kredit + req.body.total_kredit,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        }
      );
    }

    //UPDATE MAIN ACCOUNT
    if (savedPost != null) {
      const main = await Main.findOne({
        coa_account_number: req.body.coa_account_number,
        main_account_number: req.body.main_account_number,
      });
      let debit = main.total_debit;
      let kredit = main.total_kredit;
      const updatedmain = await Main.updateOne(
        {_id: main._id},
        {
          $set: {
            total_debit: debit + req.body.total_debit,
            total_kredit: kredit + req.body.total_kredit,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        }
      );
    }

    //UPDATE COA ACCOUNT
    if (savedPost != null) {
      const coa = await Post.findOne({
        coa_account_number: req.body.coa_account_number,
      });
      let debit = coa.total_debit;
      let kredit = coa.total_kredit;
      const updatedcoa = await Post.updateOne(
        {coa_account_number: req.body.coa_account_number},
        {
          $set: {
            total_debit: debit + req.body.total_debit,
            total_kredit: kredit + req.body.total_kredit,
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
    const post = await DetailBuku.find({_id: req.params.postId});
    res.json(post);
  } catch (err) {
    res.json({message: err});
  }
});

// //UPDATE POST
// router.patch("/:postId", async (req, res) => {
//   try {
//     const updatedpost = await Buku.updateOne(
//       {buku_id: req.params.postId},
//       {
//         $set: {
//           SalesID: req.body.SalesID,
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
router.delete("/:postId", async (req, res) => {
  try {
    const detailbuku = DetailBuku.findOne({_id: req.params.postId});
    if (detailbuku.length > 0) {
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

      if (updatedpost.length > 0) {
        const removedpost = await DetailBuku.remove({
          _id: req.params.postId,
        });
      }
    } else {
    }
    res.json(removedpost);
  } catch (err) {
    res.json({message: err});
  }
});

module.exports = router;
