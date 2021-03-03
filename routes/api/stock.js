const express = require("express");
const router = express.Router();
const Stock = require("../../models/stock");
const moment = require("moment");

//GET ALL THE POST
router.get("/Stock-data", async (req, res) => {
  try {
    const posts = await Stock.find();
    res.json(posts);
  } catch (err) {
    res.json({message: err});
  }
});

//SUBMIT A POST
router.post("/Stock-add", async (req, res) => {
  const stocks = new Stock({
    purchaseID: req.body.purchaseID,
    qty: req.body.qty,
    harga_dasar: req.body.harga_dasar,
    harga_dasar_tanpapajak: req.body.harga_dasar_tanpapajak,
    status: req.body.status,
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
  });

  try {
    const savedPost = await stocks.save();
    res.json(savedPost);
  } catch (err) {
    res.json({message: err});
  }
});

//SPECIFIC POST
router.get("/:postId", async (req, res) => {
  try {
    const post = await Stock.findOne({StockID: req.params.postId});
    res.json(post);
  } catch (err) {
    res.json({message: err});
  }
});

//UPDATE POST
router.patch("/:postId", async (req, res) => {
  try {
    const updatedpost = await Stock.findOneAndUpdate(
      {StockID: req.params.postId},
      {
        $set: {
          purchaseID: req.body.purchaseID,
          qty: req.body.qty,
          harga_dasar: req.body.harga_dasar,
          harga_dasar_tanpapajak: req.body.harga_dasar_tanpapajak,
          status: req.body.status,
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
router.delete("/stock-delete/:postId", async (req, res) => {
  try {
    const removedpost = await Stock.findOneAndDelete({
      StockID: req.params.postId,
    });
    res.json(removedpost);
  } catch (err) {
    res.json({message: err});
  }
});

module.exports = router;
