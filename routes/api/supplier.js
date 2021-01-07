const express = require("express");
const router = express.Router();
const Post = require("../../models/supplier");

//GET ALL THE POST
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json({message: err});
  }
});

//SUBMIT A POST
router.post("/", async (req, res) => {
  const post = new Post({
    SupplierID: req.body.SupplierID,
    CompanyName: req.body.CompanyName,
    Address1: req.body.Address1,
    Address2: req.body.Address2,
    Country: req.body.Country,
    City: req.body.City,
    StateProvince: req.body.StateProvince,
    ZipPostalCode: req.body.ZipPostalCode,
    Email: req.body.Email,
    Phone: req.body.Phone,
    Fax: req.body.Fax,
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
    const post = await Post.find({SupplierID: req.params.postId});
    res.json(post);
  } catch (err) {
    res.json({message: err});
  }
});

//UPDATE POST
router.patch("/:postId", async (req, res) => {
  try {
    const updatedpost = await Post.updateOne(
      {SupplierID: req.params.postId},
      {
        $set: {
          CompanyName: req.body.CompanyName,
          Address1: req.body.Address1,
          Address2: req.body.Address2,
          Country: req.body.Country,
          City: req.body.City,
          StateProvince: req.body.StateProvince,
          ZipPostalCode: req.body.ZipPostalCode,
          Email: req.body.Email,
          Phone: req.body.Phone,
          Fax: req.body.Fax,
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
      SupplierID: req.params.postId,
    });
    res.json(removedpost);
  } catch (err) {
    res.json({message: err});
  }
});

module.exports = router;
