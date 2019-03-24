const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

  describe("Wiki", () => {
    beforeEach((done) => {
      this.user;
      this.wiki;

      sequelize.sync({force: true}).then((res) => {
        User.create({
          email: "user@example.com",
          password: "helloworld",
          role: 0,
          name: "Lola Meehan"
        })
        .then((user) => {
          this.user = user; //storing the user

          Wiki.create({
            title: "Dusty the Klepto Kitty",
            body: "Meet Dusty, the cat burglar.",
            userId: this.user.id,
            private: false,
          })
          .then((wiki) => {
            this.wiki = wiki;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          })
        });
      });
    });

    describe("#create()", () => {
      it("should create a wiki object with a title, body, and assigned user", (done) => {

        Wiki.create({
          title: "Japanese supercentenarian Kane Tanaka",
          body: "Oldest living person at 116 years old.",
          userId: this.user.id,
          private: false
        })
        .then((wiki) => {
          expect(wiki.title).toBe("Japanese supercentenarian Kane Tanaka");
          expect(wiki.body).toBe("Oldest living person at 116 years old.");
          expect(wiki.userId).toBe(this.user.id);
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });

      it("should not create a wiki with a missing title, body, or userId", (done) => {
        Wiki.create({
          title: "Japanese supercentenarian Kane Tanaka"
        })
        .then((wiki) => {
          //missing body so catchblock will catch this.
          done();
        })
        .catch((err) => {
          expect(err.message).toContain("Wiki.body cannot be null");
          done();
        })
      });
    });

    describe("#setUser()", () => {
      it("should associate a wiki and a user together", (done) => {
        User.create({
          email: "lola@wikiexample.com",
          password: "password",
          name: "Lola Meehan"
        })
        .then((newUser) => {
          expect(this.wiki.userId).toBe(this.user.id);
          this.wiki.setUser(newUser)
          .then((wiki) => {
            expect(this.wiki.userId).toBe(newUser.id);
            done();
          });
        });
      });
    });

  });
