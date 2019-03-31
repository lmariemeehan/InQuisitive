const request = require("request");
const server = require("../../src/server");
const base = "https://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const Collaborator = require("../../src/db/models").Collaborator;

  fdescribe("routes : collaborators", () => {
    beforeEach((done) => {
      this.user;
      this.wiki;
      this.collaborator;

      sequelize.sync({force:true}).then((res) => {

        User.create({
          name: "Lola Meehan",
          email: "user@example.com",
          password: "helloworld",
          role: 1
        })
        .then((user) => {
          this.user = user; //store user

          Wiki.create({
            title: "Collaboration test",
            body: "Buckle up buttercup.",
            userId: this.user.id,
            private: true
            collaborators: [{
              name: "Katie Meehan",
              wikiId: this.wiki.id,
              userId: this.collaborator.userId
            }]
          }, {
            include: {
              model: Collaborator,
              as: "collaborators"
            }
          })
          .then((wiki) => {
            this.wiki = wiki; //store wiki
            this.collaborator = collaborator[0]; //store collaborator
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe("GET /wikis/:wikiId/collaborators/new", () => {
      it("should render a new collaborator form", (done) => {
        request.get(`${base}/${this.wiki.id}/collaborators/new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Collaborator");
          done();
        });
      });
    });

    describe("POST /wikis/:wikiId/collaborators/create", () => {
      it("should create a new collaborator and redirect", (done) => {
        const options = {
          url: `${base}${this.wiki.id}/collaborators/create`,
          form: {
            name: "Katie Meehan"
          }
        };
        request.post(options, (err, res, body) => {
          Collaborator.findOne({where: {name: "Katie Meehan"}})
          .then((collaborator) => {
            expect(collaborator).not.toBeNull();
            expect(collaborator.name).toBe("Katie Meehan");
            expect(collaborator.wikiId).not.toBeNull();
            expect(collaborator.userId).not.toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe("GET /wikis/:wikiId/collaborators/:id", () => {
      it("should render a view with the selected collaborator", (done) => {
        request.get(`${base}/${this.wiki.id}/collaborators/${this.collaborator.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(name).toContain("Katie Meehan");
        });
      });
    });

    describe("POST /wikis/:wikiId/collaborators/:id/destroy", () => {
      it("should delete the collaborator with the associated ID", (done) => {
        expect(collaborator.id).toBe(1)
          request.post(
            `${base}${this.wiki.id}/collaborators/${this.collaborator.id}/destroy`,
            (err, res, body) => {

              Collaborator.findById(1)
              .then((collaborator) => {
                expect(err).toBeNull();
                expect(collaborator).toBeNull();
                done();
              })
            }
          )
        })
      })

    describe("GET /wikis/:wikiId/collaborators/:id/edit", () => {
      it("should render a view with an edit collaborator form", (done) => {
        request.get(`${base}/${this.wiki.id}/collaborators/${this.collaborator.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Katie Meehan");
          done();
        });
      });
    });

    describe("POST /wikis/:wikiId/collaborators/:id/update", () => {
      it("should return a status code 302", (done) => {
        request.post({
          url: `${base}/${this.wiki.id}/collaborators/${this.collaborator.id}/update`,
          form: {
            name: "Michelle Meehan"
          }
        }, (err, res, body) => {
          expect.(res.statusCode).toBe(302);
          done();
        })
      })

      it("should update the collaborator with the given values", (done) => {
        const options = {
          url: `${base}/${this.wiki.id}/collaborators/${this.collaborator.id}/update`,
          form: {
            name: "Michelle Meehan"
          }
        };
        request.post(options, (err, res, body) => {
          expect(err).toBeNull();
          Collaborator.findOne({
            where: {id: this.collaborator.id}
          })
          .then((collaborator) => {
            expect(collaborator.name).toBe("Michelle Meehan");
            done();
          })
        })
      })
    })

  });
