const Users = require("../models/User");
const Shop = require("../models/Shop");
var express = require('express');
var router = express.Router();

router.post("/getProductId", async (req, res) => {
    try {
        const prod = await Shop.findOne({ isbn: req.body.prodID }).populate({
            path: "user",
            select: "-password" // Exclude the password field
        });
        if (!prod) return res.json({ msg: "PRODUCT NOT FOUND" })
        res.json({ msg: "PRODUCT FOUND", data: prod })
    } catch (error) {
        console.error(error)
    }
});

router.use((req, res, next) => {
    if (!req.user.admin) return res.json({ msg: "you are not the admin" })
    else next()
})

router.delete("/deleteProd", async (req, res) => {
    try {
        const prod = await Shop.findOne({ prodID: req.body.prodID })
        if (!prod) return res.json({ msg: "product not found!" })
        await Shop.deleteOne({ prodID: req.body.prodID })
        res.json({ msg: "product has been deleted" })
    } catch (error) {
        console.error(error)
    }
});

router.post("/addProd", async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.body.email })
        if (!user) return res.json({ msg: "user not found" })
        await Shop.create({ ...req.body, user: user._id })
        res.json({ msg: "product added!" })
    } catch (error) {
        console.error(error)
    }
});

router.put("/updateProdInfo", async (req, res) => {
    try {
        const updateShop = await Shop.findByIdAndUpdate(req.params.prodID, req.body, { new: true });
        res.json({ msg: "shop updated successfully", data: updateShop });
    } catch (error) {
        console.error(error);
        res.json({ msg: "updating shop failed" });
    }
});

module.exports = router;