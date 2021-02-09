const jwt = require('jsonwebtoken')
const path = require('path')
require('dotenv').config(path.join(__dirname, "../../.env"))

function myAuth(req, res, next) {

    console.log(req.headers)

    if (req.headers.cookie) {
        try {
            let jwtToBeVerfied = req.headers.cookie.split('=')[1];
            let verifiedUser = jwt.verify(jwtToBeVerfied, process.env.RANDOM_KEY_FOR_JWT)
            req.body.userID = verifiedUser.user._id;
            console.log("bholenath", req.body.userID);
            next();

        } catch (error) {
            res.status(404).json({ message: "Unauthorized Access" })
        }

    } else {
        console.log("no cookie found")
        res.status(404).json({ message: "Unauthorized Access" })
    }
}

module.exports = myAuth;