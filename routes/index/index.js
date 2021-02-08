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

var cors = require('cors')
let myAuth = require("../auth/auth")

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

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

                let jwtToken = jwt.sign({ user: user }, process.env.RANDOM_KEY_FOR_JWT, { expiresIn: 3600 })
                res.setHeader('Set-Cookie', cookie.serialize("myAgainJwt3", jwtToken, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 7,
                    sameSite: "none",
                    secure: true
                }))

                res.status(200).json({ message: "login successful" })

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

router.get("/check", (req, res) => {
    res.status(200).json({ message: "user is here" })
})

module.exports = router; 