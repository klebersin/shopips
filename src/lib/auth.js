module.exports = {
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('message','Necesitas Iniciar Sesión');        
        return res.redirect('/signin');
    },
    isAdmin (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        
    }
};