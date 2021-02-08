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
            console.log(verifiedUser.user._id);
            next();

        } catch (error) {
            res.status(404).json({ message: "Unauthorized Access" })
            next();
        }

    } else {
        console.log("no cookie found")
        next();
    }
}

module.exports = myAuth;