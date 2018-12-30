const config = require('config');
var jwt = require("jsonwebtoken");

//validate user middleware function
module.exports = function validateUser(req, res, next) {

    const token = req.header('x-access-token');
    if (!token) return res.status(401).send('Access denied. No x-access-token added to header');

    jwt.verify(
        token,
        config.get('jwtPrivateKey'),
        (err, decoded) => {
            if (err) {
                res.status(400).json({
                    status: "error",
                    message: err.message,
                    data: null
                });
            } else {
                /*    // add user id to request
                   req.body.userId = decoded._id; */

                req.user = decoded;
                next();
            }
        }
    );
}