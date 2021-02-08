function MyCors(req, res, next) {
    console.log('hello')
    console.log(req.body);
    let allowedOrigin = ["http://localhost:3000"]
    if (allowedOrigin.indexOf(req.headers.origin) != -1) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.setHeader("Access-Control-Allow-Credentials", true);
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Set-Cookie");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    }

    console.log(allowedOrigin.indexOf(req.headers.origin));

    next();
}

module.exports = MyCors;