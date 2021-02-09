const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const path = require('path');
var cookieParser = require('cookie-parser');


const indexRouter = require("./routes/index/index")
const userRouter = require('./routes/users/user.js')

var port = normalizePort(process.env.PORT || '1234');

app.set('port', port);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use((req, res, next) => {
    console.log(req.headers);
    console.log("going to next")
    let allowedOrigin = ["http://localhost:3000", "https://happy-wilson-7ab93e.netlify.app"]
    if (allowedOrigin.indexOf(req.headers.origin) != -1) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.setHeader("Access-Control-Allow-Credentials", true);
        res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Set-Cookie");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    }
    console.log(allowedOrigin.indexOf(req.headers.origin));
    next();
})

app.use("/", indexRouter);
app.use("/user", userRouter);



server.listen(port)
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}



app.po

