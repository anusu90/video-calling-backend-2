var express = require('express');
var router = express.Router();
const path = require('path');
var mongodb = require('mongodb');
const bcrypt = require('bcrypt');
// const nodemailer = require("nodemailer");
require('dotenv').config(path.join(__dirname, "../../.env"))
const MongoClient = require('mongodb').MongoClient
const uri = `mongodb+srv://dBanusu90:${process.env.DB_PASS}@Cluster0.xudfg.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const jwt = require('jsonwebtoken');
var cookie = require('cookie');
let myAuth = require("../auth/auth")

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send(process.env.DB_PASS);
});

router.get('/login', function (req, res, next) {
    res.send(process.env.DB_PASS);
});


//REGISTER BACKEND

router.post("/register", async (req, res) => {

    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        let userDBCollection = client.db('video-calling-db').collection("users");
        let user = await userDBCollection.findOne({
            email: req.body.email
        });

        if (user) {
            res.status(500).json({ message: "User email already exists. Please try forgot password" })
        } else {

            let salt = await bcrypt.genSalt(10);
            let hashedPass = await bcrypt.hash(req.body.password, salt);
            req.body.password = hashedPass;
            let input = await userDBCollection.insertOne(req.body);

            await client.close();

            if (input.insertedCount === 1) {
                console.log("user inserted")
                res.status(200).json({
                    "message": "user inserted"
                })
            } else {
                res.status(500).json({ message: "User registration failed. Please try again" })
            }
        }

    } catch (error) {

    }

})



// LOGIN BACKEND

router.post("/login", async (req, res) => {

    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        let userDBCollection = client.db('video-calling-db').collection("users");
        let user = await userDBCollection.findOne({
            email: req.body.email
        });

        if (user) {

            let compare = await bcrypt.compare(req.body.password, user.password);
            if (compare == true) {

                let jwtToken = jwt.sign({ user: user }, process.env.RANDOM_KEY_FOR_JWT, { expiresIn: 1800 })
                res.setHeader('Set-Cookie', cookie.serialize("myAgainJwt3", jwtToken, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 7,
                    sameSite: "none",
                    secure: true
                }))

                res.status(200).json(user)

            } else {
                res.status(500).json({ message: "Invalid Credentials. Please try again" })
            }

        } else {
            res.status(500).json({ message: "No user found" })
        }

        await client.close();

    } catch (error) {

        res.status(500).json({ message: error })

    }

})


//LOGOUT BACKEND

router.get("/logout", (req, res) => {
    try {

        res.setHeader('Set-Cookie', cookie.serialize('myAgainJwt3', "invalid-cookie", {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 1 week,
            sameSite: "none",
            secure: true
        }));
        res.status(200).json({ message: "Logout Successful" })

    } catch (err) {

        res.status(500).json({ message: error })

    }
})


router.get("/check", myAuth, async (req, res) => {

    try {

        let userID = req.body.userID;
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        let userDBCollection = client.db('video-calling-db').collection("users");
        let user = await userDBCollection.findOne({
            _id: mongodb.ObjectID(userID)
        });
        res.status(200).json(user)

    } catch (error) {

        res.status(500).json({ message: error })

    }

})

module.exports = router; 