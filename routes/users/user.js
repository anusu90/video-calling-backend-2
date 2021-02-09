var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid')
let myAuth = require("../auth/auth")
var mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient
const uri = `mongodb+srv://dBanusu90:${process.env.DB_PASS}@Cluster0.xudfg.mongodb.net/<dbname>?retryWrites=true&w=majority`;
let tokenGenerator = require("../../modules/twilio-access-token")

router.get('/', myAuth, async function (req, res) {

    try {

        let userID = req.body.userID;
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        let userDBCollection = client.db('video-calling-db').collection("users");
        let user = await userDBCollection.findOne({
            _id: mongodb.ObjectID(userID)
        });
        console.log("hello")

        let identity = user.email;
        let room = uuidv4();

        console.log(identity, room)


        let jwtTwilioToken = tokenGenerator(identity, room);
        console.log('yo baba', jwtTwilioToken)
        res.status(200).json({ jwtTwilioToken: jwtTwilioToken, identity: identity, room: room })

    } catch (error) {

        res.status(500).json({ message: error })

    }

    // res.status(200).json({ uuuid: room })
    // res.redirect(`/user/${uuidv4()}`)
});

router.get('/:room', myAuth, function (req, res, next) {
    res.render('room', { roomID: req.params.room });
});

module.exports = router; 