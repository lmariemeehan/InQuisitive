const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;
const Collaborator = require("../../src/db/models").Collaborator;

describe("Collaborator", () => {
  beforeEach((done) => {
    this.user;
    this.wiki;
    this.collaborator;

    sequelize.sync({force: true}).then((res) => {

      User.create({
        name: "Lola Meehan",
        email: "user@example.com",
        password: "helloworld"
      })
      .then((user) => {
        this.user = user;
      })

      Wiki.create({
        title: "Collaboration test",
        body: "Buckle up buttercup.",
        private: true,
        userId: this.user.id,
        collaborators: [{
          name: "Fiona Starbucks",
          userId: this.collaborator.userId,
          wikiId: this.wiki.id
        }]
        }, {include: {
          model: Collaborator,
          as: "collaborators"
        }}
      )
      .then((wiki) => {
        this.wiki = wiki;
        this.collaborator = wiki.collaborators[0];
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("#create", () => {
    it("should create a Collaborator object with a name and an assigned wiki and user id's", (done) => {
      Collaborator.create({
        name: "Katie Meehan",
        wikiId: this.wiki.id,
        userId: this.user.id
      })
      .then((collaborator) => {
        expect(collaborator.name).toBe("Katie Meehan");
        expect(collaborator.wikiId).toBe(this.wiki.id);
        expect(collaborator.userId).toBe(this.user.id);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      })
    })

    it("should not create a collaborator object with a missing name", (done) => {
      Collaborator.create({
        wikiId: this.wiki.id
      })
      .then((collaborator) => {
        //missing name/userId so catch will handle this error
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Collaborator.name cannot be null");
        expect(err.message).toContain("Collaborator.userId cannot be null");
        done();
      })
    })
  })
/*
  describe("#setUser()", () => {
    it("should associate a collaborator and a user together", (done) => {
      Collaborator.create({
        name: this.user.name,
        wikiId: this.wiki.id,
        userId: this.user.id
      })
      .then((collaborator) => {
        this.collaborator = collaborator; //storing collaborator
        expect(collaborator.userId).toBe(this.user.id);

        User.create({   //create a new user
          email: "ktmeehan@gmail.com",
          password: "bigsister"
        })
        .then((newUser) => {
          this.collaborator.setUser(newUser)
          .then((collaborator) => {
            expect(collaborator.userId).toBe(newUser.id); //confirm it was updated
            done();
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("#getUser()", () => {
    it("should return the associated user", (done) => {
      Collaborator.create({
        name: this.user.name,
        wikiId: this.wiki.id,
        userId: this.user.id
      })
      .then((collaborator) => {
        collaborator.getUser()
        .then((user) => {
          expect(user.id).toBe(this.user.id);
          done();
        })
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });
*/
  describe("#setWiki()", () => {
    it("should associate a wiki and a collaborator together", (done) => {
        Wiki.create({
          title: "Planning seester birthday partay",
          body: "Cake or no cake?",
          wikiId: this.wiki.id,
          userId: this.user.id
        })
        .then((newWiki) => {
          expect(this.collaborator.wiki.id).toBe(this.wiki.id);
          this.collaborator.setWiki(newWiki)
          .then((collaborator) => {
            expect(collaborator.wikiId).toBe(newWiki.id); //ensure it was updated
            done();
          })
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });

  describe("#getWiki()", () => {
    it("should return the associated wiki", (done) => {
      Collaborator.create({
        name: this.user.name,
        wikiId: this.wiki.id,
        userId: this.collaborator.userId
      })
      .then((collaborator) => {
        this.collaborator.getWiki()
        .then((associatedWiki) => {
          expect(associatedWiki.title).toBe("Collaboration test");
          done();
        })
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

});
