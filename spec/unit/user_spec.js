const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {
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

	describe("#create()", () => {
		it("should create a User object with a valid email and password", (done) => {
			User.create({
				email: "user@example.com",
				password: "helloworld",
				role: 0,
				name: "Lola Meehan"
			})
			.then((user) => {
				expect(user.email).toBe("user@example.com");
				expect(user.id).toBe(1);
				done();
			})
			.catch((err) => {
				console.log(err);
				done();
			})
		})

		it("should not create a user with an invalid email or password", (done) => {
			User.create({
				email: "Wownowbrowncow",
				password: "helloworld",
				name: "Lola Meehan"
			})
			.then((user) => {
				//Nothing will happen here since the email is invalid so will skip and the catchblock below will handle the request
				done();
			})
			.catch((err) => {
				expect(err.message).toContain("Validation error: must be a valid email");
				done();
			});
		});

		it("should not create a user with an email that's already been taken", (done) => {
			User.create({
				email: "user@example.com",
				password: "helloworld",
				role: 0,
				name: "Lola Meehan"
			})
			.then((user) => {

				User.create({
					email: "user@example.com",
					password: "psssst.. this seats taken!",
					role: 0,
					name: "Lola Meehan"
				})
				.then((user) => {
					//Nothing will happen here since there's an error
					done();
				})
				.catch((err) => {
					expect(err.message).toContain("Validation error");
					done();
				});
				done();
			})
			.catch((err) => {
				console.log(err);
				done();
			});
		});
	});
});
