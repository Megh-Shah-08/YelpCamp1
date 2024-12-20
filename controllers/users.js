const User = require('../model/user');

//render the register form
module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
};

//register the user
module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', "Welcome to YelpCamp");
            res.redirect('/campgrounds');
        })
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/register');
    }
};

//render the login form 
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

//login the user
module.exports.loginUser = async (req, res) => {
    console.log(req.isAuthenticated());
    req.flash('success', "Welcome Back!");
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

//logout the user
module.exports.logOutUser = (req, res) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'GoodBye!');
        res.redirect('/campgrounds');
    });
};