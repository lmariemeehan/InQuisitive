const request = require("request");
const server = require("../../src/server");
const base = "https://localhost:3000/wikis/";

const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const Collaborator = require("../../src/db/models").Collaborator;

describe("routes : collaborators", () => {
  beforeEach((done) => {
    this.user;
    this.wiki;
    this.collaborator;

    sequelize.sync({force:true}).then((res) => {

      User.create({
        name: "Lola Meehan",
        email: "user@example.com",
        password: "helloworld"
      })
      .then((user) => {
        this.user = user; //store user

        Wiki.create({
          title: "Collaboration test",
          body: "Buckle up buttercup."
        })
        .then((wiki) => {
          this.wiki = wiki; //store wiki
        })

        Collaborator.create({
          name: this.user.name,
          wikiId: this.wiki.id,
          userId: this.user.id
        })
        .then((collaborator) => {
          this.collaborator = collaborator; //store collaborator
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  //Standard user context
  describe("standard user performing CRUD actions for Collaborator", () => {
    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: 0,
          userId: this.user.id
        }
      }, (err, res, body) => {
        done();
      }
    )
  });

    describe("POST /wikis/:wikiId/collaborators/create", () => {
      it("should create a new collaborator and redirect", (done) => {
        const options = {
          url: `${base}${this.wiki.id}/collaborators/create`,
          form: {
            body: "Katie Meehan"
          }
        };
        request.post(options, (err, res, body) => {
          Collaborator.findOne({where: {body: "Katie Meehan"}})
          .then((collaborator) => {
            expect(collaborator).not.toBeNull();
            expect(collaborator.body).toBe("Katie Meehan")
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe("POST /wikis/:wikiId/collaborators/:id/destroy", () => {
      it("should delete the collaborator with the associated ID", (done) => {
        Collaborator.all()
        .then((collaborators) => {
          const collaboratorCountBeforeDelete = collaborators.length;

          expect(collaboratorCountBeforeDelete).toBe(1);

          request.post(
            `${base}${this.wiki.id}/collaborators/${this.collaborator.id}/destroy`,
            (err, res, body) => {
              expect(res.statusCode).toBe(302);
              Collaborator.all()
              .then((collaborators) => {
                expect(err).toBeNull();
                expect(collaborators.length).toBe(collaboratorCountBeforeDelete-1);
                done();
              })
            }
          )
        })
      })
    });
  }); //end context for standard user

  
});
