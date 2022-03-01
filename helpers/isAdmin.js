module.exports = {
	isAdmin: (req, res, next) => {
		if(req.isAuthenticated() && req.user.isAdmin == 1){
			return next();
		}else {
			req.flash("error_msg", "Your must be logged in as Admin to have access to this session.");
			res.redirect('/');
		}
	}
}