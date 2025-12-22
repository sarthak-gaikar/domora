const User = require('../models/user');

module.exports.registerForm = (req, res) => {
    res.render('users/register.ejs');
};

module.exports.registerUser = async (req, res) => {
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
};

module.exports.loginForm = (req, res) => {
    res.render('users/login.ejs');
};

module.exports.loginUser = async (req, res) => {
    req.flash('success', 'Welcome back, ' + req.user.username + '!');
    res.redirect(res.locals.redirectUrl || '/listings');
};

module.exports.logoutUser = (req, res, next) => {
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
};