const bcrypt = require("bcrypt");
const Users = require("../models/User");
var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("../config");
const MY_SECRET = config.secretKey;


router.post("/signUp", async (req, res, next) => {
    try{
        const {email, password} = req.body
        if (password.length < 8) {
            return res.json({ msg: "password should have at least 8 characters" });
        }

        let person = await Users.findOne({email})
        if (person) return res.json({msg: "user exists!"})

        await Users.create({...req.body, password: await bcrypt.hash(password, 5) });
        return res.json({msg: "user has been created! congrats!"})
    }catch(error){
        console.error(error)
    }

    next();
});

router.post("/login", async (req, res, next) => {
    try{
        const {email, password} = req.body

        const person = await Users.findOne({email})
        if (!person) return res.json({msg: "user does not exist! please sign up!"})

        const passwordCheck= await bcrypt.compare(password, person.password);
        if(!passwordCheck) return res.json({msg: "wrong password! please try again!"})
        
        const token  = jwt.sign({
            email,
            createdAt: new Date(),
            admin: person.admin,
        }, MY_SECRET, {expiresIn: "1d"});

        res.json({
            msg: "you have logged in!", 
            token
        })
    }catch(error){
        console.error(error);
    }
    next();
})

router.use((req, res, next) => {
    if (!req.user.admin) return res.json({ msg: "you are not the admin" })
    else next()
})

router.delete("/deleteUser", async (req, res) => {
    try {
        const {email} = req.body

        const person = await Users.findOne({email})
        if (!person) return res.json({msg: "user does not exist!"});

        await person.findByIdAndDelete(req.body.email);

        res.json({ message: "Person deleted successfully" });
    } catch (error) {
        console.error(error);
        res.json({ message: "Failed to delete person" });
    }
});


module.exports = router;