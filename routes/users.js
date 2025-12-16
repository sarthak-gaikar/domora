const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get('/register', (req, res) => {
    res.render('users/register.ejs');
})

router.post('/register', wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log("New user registered: " + registeredUser);
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }  
}));

router.get('/login', (req, res) => {
    res.render('users/login.ejs');
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), wrapAsync(async (req, res) => {
    req.flash('success', 'Welcome back, ' + req.user.username + '!');
    res.redirect('/listings');
}));

module.exports = router;