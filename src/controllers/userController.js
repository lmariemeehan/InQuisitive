const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
	signUp(req, res, next){
		res.render("users/sign_up");
	},

	create(req, res, next) {
		let newUser = {
			email: req.body.email,
			password: req.body.password,
			passwordConfirmation: req.body.passwordConfirmation
		};

		const msg = {
		  to: 'lmariemeehan@gmail.com',
		  from: 'test@example.com',
		  subject: 'Sending with SendGrid is Fun',
		  text: 'and easy to do anywhere, even with Node.js',
		  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
		};
		sgMail.send(msg);

		userQueries.createUser(newUser, (err, user) => {
			if(err){
				req.flash("error", err);
				res.redirect("/users/sign_up");
			} else {

				passport.authenticate("local")(req, res, () => {
					req.flash("notice", "You've successfully signed in!");
					res.redirect("/");
				})
			}
		});
	},

	signInForm(req, res, next){
		res.render("users/sign_in");
	},

	signIn(req, res, next){
		passport.authenticate("local")(req, res, function () {
			if(!req.user){
				req.flash("notice", "Sign in failed. Please try again.")
				res.redirect("/users/sign_in");
			} else {
				req.flash("notice", "You've successfully signed in!");
				res.redirect("/");
			}
		})
	},

	signOut(req, res, next){
		req.logout();
		req.flash("notice", "You've successfully signed out!");
		res.redirect("/");
	},

	show(req, rest, next){
		userQueries.getUser(req.params.id, (err, result) => {
			if(err || result.user === undefined) {
				req.flash("notice", "No user found with that ID.");
				res.redirect("/");
			} else {
				res.render("users/show", {...result});
			}
		});
	}
}
