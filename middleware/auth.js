const config = require('config'); //for using config files
const jwt = require("jsonwebtoken");

//validate user middleware function
module.exports = function validateUser(req, res, next) {

    const token = req.header('x-access-token'); //req for x-access-token in header

    //if there is no header token
    if (!token) return res.status(401).send('Access denied. No x-access-token added to header');

    //verify the token
    jwt.verify(
        token,
        config.get('jwtPrivateKey'),
        //callback
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


                req.user = decoded; // decoded value{ id: 1, iat: 1557859186, exp: 1560451186 }

                next();
            }
        }
    );
};