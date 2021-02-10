const express = require("express");
const router = express.Router();
const Post = require("../../models/customer");

//GET ALL THE POST
router.get("/Cust-data", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json({message: err});
  }
});

//SUBMIT A POST
router.post("/Cust-add", async (req, res) => {
  const post = new Post({
    CustomerID: req.body.CustomerID,
    SalesID: req.body.SalesID,
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
    const post = await Post.find({CustomerID: req.params.postId});
    res.json(post);
  } catch (err) {
    res.json({message: err});
  }
});

//UPDATE POST
router.patch("/:postId", async (req, res) => {
  try {
    const updatedpost = await Post.updateOne(
      {CustomerID: req.params.postId},
      {
        $set: {
          SalesID: req.body.SalesID,
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
router.delete("/delete/:postId", async (req, res) => {
  try {
    const removedpost = await Post.remove({
      CustomerID: req.params.postId,
    });
    res.json(removedpost);
  } catch (err) {
    res.json({message: err});
  }
});

module.exports = router;
