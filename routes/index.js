const express =  require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");

const peopleRouter = require('./people');
const shopRouter = require('./shop');

const config = require("../config");
const MY_SECRET = config.secretKey;

router.use("/people", peopleRouter);

router.use(async (req, res, next) => {
    try{
        const token = req.headers.authorization;
        const people = jwt.verify(token.split(" ")[1], MY_SECRET)
        req.people = people; 
    }catch (e){
        return res.json({msg : "token not found / invalid"})
    }

    next();
})

router.use("/shop", shopRouter);

module.exports = router;
