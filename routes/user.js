const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../model/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware.js');
const users = require('../controllers/users.js');


//GET Request to get the form to register to a new user
router.get('/register', users.renderRegisterForm);

//POST Request to create a new user 
router.post('/register', catchAsync(users.registerUser));

//GET Request to get the form for login
router.get('/login', users.renderLoginForm)

//POST Request to login the registered user
router.post('/login', storeReturnTo, passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}), catchAsync(users.loginUser));

//GET Request to logout the logged in user
router.get('/logout', users.logOutUser);

module.exports = router;