module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.orginalUrl;
        req.flash("error","You need to be signed in");
        return res.redirect('/login');
    }
    next();
}