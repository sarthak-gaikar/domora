const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get('/register', (req, res) => {
    res.render('users/register.ejs');
})

router.post('/register', wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log("New user registered: " + registeredUser);
        req.login(registeredUser, (err) => {
            if(err) return next(err);
            req.flash('success', 'Registration successful! Welcome, ' + registeredUser.username + '!');
            res.redirect('/listings');
        });
        
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }  
}));

router.get('/login', (req, res) => {
    res.render('users/login.ejs');
})

router.post('/login', saveRedirectUrl, passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), wrapAsync(async (req, res) => {
    req.flash('success', 'Welcome back, ' + req.user.username + '!');
    res.redirect(res.locals.redirectUrl || '/listings');
}));

router.get('/logout', (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'You are not logged in.');
        return res.redirect('/login');
    }
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash('success', 'You have been logged out.');
        res.redirect('/login');
    })
})

module.exports = router;