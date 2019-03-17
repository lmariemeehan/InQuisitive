const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

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

	show(req, res, next){
		userQueries.getUser(req.params.id, (err, result) => {
			if(err || result.user === undefined) {
				req.flash("notice", "No user found with that ID.");
				res.redirect("/");
			} else {
				res.render("users/show", {...result});
			}
		});
	},

	upgrade(req, res, next){
		res.render("users/upgrade"); //This upgrades the view, below will charge for the upgrade.

		// Set your secret key: remember to change this to your live secret key in production
		// See your keys here: https://dashboard.stripe.com/account/apikeys
		const stripe = require("stripe")("sk_test_xnxGL3QCgvKeADZVW4oP3Id1");
		// Token is created using Checkout or Elements!
		// Get the payment token ID submitted by the form:
		const token = request.body.stripeToken; // Using Express

		(async () => {
		  const charge = await stripe.charges.create({
		    amount: 1500,
		    currency: 'usd',
		    description: 'Example of upgrading to premium charge',
		    source: token,
		  });
		})();
		userQueries.upgradeUser(req.params.id, (err, user) => {
				if(err && err.type === "StripeCardError"){
						req.flash("notice", "Your payment was unsuccessful");
						res.redirect("/users/upgrade");
				} else{
						req.flash("notice", "Thank you for your payment. You are now a premium user!");
						res.redirect(`/`);
				}
		});
	},

	downgrade(req, res, next){
		res.render("users/downgrade"); //This will update the view. Below will help downgrade user.

		userQueries.downgradeUser(req.params.id, (err, user) => {
			if(err){
					req.flash("notice", "There was an error processing this request");
					res.redirect("users/downgrade");
			} else {
					req.flash("notice", "Your account has been downgraded to standard.");
					res.redirect("/");
			}
		});
	}

}
