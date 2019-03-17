const User = require("./models").User;
const Wiki = require("./models").Wiki;
const bcrypt = require("bcryptjs");

module.exports = {
	createUser(newUser, callback) {
		const salt = bcrypt.genSaltSync();
		const hashedPassword = bcrypt.hashSync(newUser.password, salt);

		return User.create({
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
	}

}
