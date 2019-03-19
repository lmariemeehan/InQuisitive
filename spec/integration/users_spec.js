const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {
	beforeEach((done) => {
		sequelize.sync({force: true})
		.then(() => {
			done();
		})
		.catch((err) => {
			console.log(err);
			done();
		});
	});

	describe("GET /users/sign_up", () => {
		it("should render a view with a sign up form", (done) => {
			request.get(`${base}sign_up`, (err, res, body) => {
				expect(err).toBeNull();
				expect(body).toContain("Sign Up");
				done();
			});
		});
	});

	describe("POST /users", () => {
		it("should create a new user with valid values and redirect", (done) => {
			const options = {
				url: base,
				form: {
					email: "user@example.com",
					password: "helloworld"
				}
			}
			request.post(options, (err, res, body) => {
				User.findOne({where: {email: "user@example.com"}})
				.then((user) => {
					expect(user).not.toBeNull();
					expect(user.email).toBe("user@example.com");
					expect(user.id).toBe(1);
					done();
				})
				.catch((err) => {
					console.log(err);
					done();
				});
			});
		});

		it ("should not create a new user with invalid attributes and redirect", (done) => {
			request.post({
			  url: base,
			  form: {
				  email: "no",
				  password: "helloworld"
			  }
			},
			(err, res, body) => {
				User.findOne({where: {email: "no"}})
				.then((user) => {
					expect(user).toBeNull();
					done();
				})
				.catch((err) => {
					console.log(err);
					done();
				});
			}
			);
		});
	});

	describe("GET /users/sign_in", () => {
		it("should render a view with a sign in form", (done) => {
			request.get(`${base}sign_in`, (err, res ,body) => {
				expect(err).toBeNull();
				expect(body).toContain("Sign in");
				done();
			});
		});
	});

	describe("GET /users/:id", () => {
		beforeEach((done) => {
			this.user;
			this.wiki;

			User.create({
				email: "user@example.com",
				password: "helloworld"
			})
			.then((res) => {
				this.user = res;

				Wiki.create({
					title: "Dusty the Klepto Kitty",
					body: "Meet Dusty, the cat burglar.",
					userId: this.user.id,
					private: false
				})
				.then((res) => {
					this.wiki = res.wikis[0];
					done();
				})
			})
		});

		it("should present a list of wikis a user has created", (done) => {
			request.get(`${base}${this.user.id}`, (err, res, body) => {
				expect(body).toContain("Dusty the Klepto Kitty");
				done();
			});
		});
	});

	describe("GET /users/:id/upgrade", () => {
		it("should render a view with an upgrade form", (done) => {
			request.get(`${base}${this.user.id}/upgrade`, (err, res, body) => {
				expect(err).toBeNull();
				expect(body).toContain("Upgrade");
				done();
			});
		});
	});

	describe("GET /users/:id/downgrade", () => {
		it("should render a view with a downgrade form", (done) => {
			request.get(`${base}${this.user.id}/downgrade`, (err, res, body) => {
				expect(err).toBeNull();
				expect(body).toContain("Downgrade");
				done();
			});
		});
	});

});
