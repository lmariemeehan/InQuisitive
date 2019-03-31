const User = require("./models").User;
const Wiki = require("./models").Wiki;
const bcrypt = require("bcryptjs");

module.exports = {
	createUser(newUser, callback) {
		const salt = bcrypt.genSaltSync();
		const hashedPassword = bcrypt.hashSync(newUser.password, salt);

		return User.create({
			name: newUser.name,
			email: newUser.email,
			password: hashedPassword,
			role: newUser.role
		})
		.then((user) => {
			callback(null, user);
		})
		.catch((err) => {
			callback(err);
		})
	},

	getUser(id, callback){
    let result = {};
    User.findById(id)
      .then((user) => {

        if(!user) {
          callback(404);
        } else {
          result["user"] = user;

					Wiki.scope({method: ["lastFiveFor", id]}).all()
					.then((wikis) => {

						result["wikis"] = wikis;
					})
					.catch((err) => {
						callback(err);
					})
				}
		})
	},

	upgradeUser(id, callback){
		return User.findById(id)
		.then((user) => {
				if(!user){
						return callback("User not found");
				} else {
						user.update({role: 1}, {where: {id}})
				.then(() => {
						callback(null, user);
				})
				.catch((err) => {
						callback(err);
				})
				}
		});
	},

	downgradeUser(id, callback){
		return User.findById(id)
		.then((user) => {
				if(!user){
						return callback("User not found");
				} else {
						user.update({role: 0}, {where: {id}})
						user.update("")
				.then(() => {
						callback(null, user);
				})
				.catch((err) => {
						callback(err);
				})
				}
		});
	}

}
