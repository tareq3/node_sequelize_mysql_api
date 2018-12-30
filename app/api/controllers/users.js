const {
    userModel,
    validateRegisterUser,
    validateLoginUser
} = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenExpiration = '30d';
const config = require('config');

module.exports = {
    getUser: async (req, res, next) => {

        let users = [];
        try {
            const results = await userModel.findAll();
            for (const user of results) {
                users.push({
                    id: user.id,
                    name: user.name,

                })
            }

            res.json({
                status: "success",
                data: users
            });
        } catch (err) {
            next(err);
        };
    },
    create: async (req, res, next) => {

        //For cheaking the validation using Joi 
        const {
            error
        } = validateRegisterUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);


        try {
            //cheaking wheather the user exist or not
            let user = await userModel.findOne({
                where: {
                    email: req.body.email
                }
            });
            if (user) return res.status(400).send('User already registered');



            const result = await userModel.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                token: null
            });

            //sending response as json file
            res.json({
                status: "success",
                message: "User added successfully!!!",
                data: result
            });

            console.log(result);
        } catch (err) {
            next(err);
        }
    },
    authenticate: async (req, res, next) => {
        //For cheaking the validation using Joi 
        const {
            error
        } = validateLoginUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);


        try {
            //cheaking wheather the user exist or not
            let userInfo = await userModel.findOne({
                where: {
                    email: req.body.email
                }
            });



            const validPassword = await bcrypt.compare(req.body.password, userInfo.password);

            if (validPassword) {
                const m_token = jwt.sign({
                    id: userInfo.id // pay load can be retrived from header
                }, config.get('jwtPrivateKey'), {
                    expiresIn: tokenExpiration
                });

                res.json({
                    status: "success",
                    message: "user found!!!",
                    data: {
                        user: {
                            name: userInfo.name,
                            email: userInfo.email
                        },
                        token: m_token
                    }
                }).status(200);

                //Updating the token into the table 
                //Note: Storing token in database is a bad practice. if u need to do so just encrypt the token like password
                userInfo.update({
                    token: m_token
                });
            } else {
                res.json({
                    status: "error",
                    message: "Invalid email/password!!!",
                    data: null
                }).status(400);
            }

        } catch (error) {
            next(error);
        }
    },
    loggedInUser: async (req, res, next) => {

        try {
            const user = await userModel.findByPk(req.user.id); /// retriving data from payload

            res.json({
                id: user.id,
                name: user.name,
                email: user.email
            });

        } catch (error) {
            next(error);
        }

    }


}