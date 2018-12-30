const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const userCtr = require('../app/api/controllers/users');
router.get('/', userCtr.getUser);
router.post('/register', userCtr.create);
router.post('/authenticate', userCtr.authenticate);
//private route
router.get('/me', auth, userCtr.loggedInUser); //this route provide current logged in user info from x-access-token
module.exports = router;