const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {
  beforeEach((done) => {
    this.user;
    this.wiki;

    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "user@example.com",
        password: "helloworld",
        role: 0
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: "Dusty the Klepto Kitty",
          body: "Meet Dusty, the cat burglar.",
          userId: this.user.id,
          private: false
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        })
      })
    })
  })

  //ADMIN USER CONTEXT
  describe("admin user performing CRUD actions for Wiki", () => {
    beforeEach((done) => {
      User.create({
        email: "admin@example.com",
        password: "adminpassword",
        role: 2
      })
      .then((user) => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            role: user.role,
            userId: user.id,
            email: user.email
          }
        }, (err, res, body) => {
          done();
        });
      });
    });

    describe("GET /wikis", () => {
      it("should respond with all public wikis", (done) => {
        request.get(base, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          expect(body).toContain("Dusty the Klepto Kitty");
          done();
        });
      });
    });

    describe("GET /wikis/new", () => {
      it("should render a new wiki form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });
    });

    describe("POST /wikis/create", () => {
      //Admin user creating a PUBLIC wiki
      it("should create a new public wiki and redirect", (done) => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Mill Ends Park - the smallest park in Oregon",
          body: "Once contained a miniature ferris wheel that was delivered by a full size crane.",
          userId: this.user.id,
          private: false
        }
      };

        request.post(options, (err, res, body) => {
          Wiki.findOne({where: {title: "Mill Ends Park - the smallest park in Oregon"}})
          .then((wiki) => {
            expect(wiki.title).toBe("Mill Ends Park - the smallest park in Oregon");
            expect(wiki.body).toBe("Once contained a miniature ferris wheel that was delivered by a full size crane.");
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });

      //Admin user creating a PRIVATE wiki
      it("should create a new private wiki and redirect", (done) => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Mill Ends Park - the smallest park in Oregon",
          body: "Once contained a miniature ferris wheel that was delivered by a full size crane.",
          userId: this.user.id,
          private: true
        }
      };

        request.post(options, (err, res, body) => {
          Wiki.findOne({where: {title: "Mill Ends Park - the smallest park in Oregon"}})
          .then((wiki) => {
            expect(wiki.title).toBe("Mill Ends Park - the smallest park in Oregon");
            expect(wiki.body).toBe("Once contained a miniature ferris wheel that was delivered by a full size crane.");
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });

      it("should not create a new wiki that fails validations", (done) => {
        const options = {
          url: `${base}create`,
            form: {
              title: "a",
              body: "b",
              userId: this.user.id,
              private: false
            }
          };
          request.post(options, (err, res, body) => {
            Wiki.findOne({where: {title: "a"}})
            .then((wiki) => {
                expect(wiki).toBeNull();
                done();
            })
            .catch((err) => {
              console.log(err);
              done();
          });
        })
      })
    });

    describe("GET /wikis/:id", () => {
      it("should render a view with the selected wiki", (done) => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Dusty the Klepto Kitty");
          done();
        });
      });
    });

    describe("POST /wikis/:id/destroy", () => {
      it("should delete the wiki with the associated ID", (done) => {
        Wiki.findAll()
        .then((wikis) => {
          const wikiCountBeforeDelete = wikis.length;
          expect(wikiCountBeforeDelete).toBe(1);

          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.findAll()
            .then((wikis) => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete -1);
              done();
            })
          });
        });
      });
    });

    describe("GET /wikis/:id/edit", () => {
      it("should render a view with a wiki form", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain("Meet Dusty, the cat burglar.");
          done();
        });
      });
    });

    describe("POST /wikis/:id/update", () => {
      it("should update the wiki with the given values", (done) => {
        request.post({
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "Dusty the Klepto Kitty",
            body: "Meet Dusty, the cat burglar."
          }
        }, (err, res, body) => {
          expect(err).toBeNull();

          Wiki.findOne({
            where: { id:1 }
          })
          .then((wiki) => {
            expect(wiki.title).toBe("Dusty the Klepto Kitty");
            done();
          });
        });
      });
    });

  }); //END OF ADMIN USER CONTEXT

  //PREMIUM USER CONTEXT
  describe("Premium user performing CRUD actions for Wikis", () => {
    beforeEach((done) => {
      User.create({
        email: "premiumuser@example.com",
        password: "premiumpassword",
        role: 1
      })
      .then((user) => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            role: user.role,
            userId: user.id,
            email: user.email
          }
        }, (err, res, body) => {
          done();
        });
      });
    });

    describe("GET /wikis", () => {
      it("should respond with all wikis", (done) => {
        request.get(base, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          expect(body).toContain("Dusty the Klepto Kitty");
          done();
        });
      });
    });

    describe("GET /wikis/new", () => {
      it("should render a new wiki form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });
    });

    //Premium user creating a PUBLIC wiki
    describe("POST /wikis/create", () => {
      it("should create a new wiki and redirect", (done) => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Mill Ends Park - the smallest park in Oregon",
          body: "Once contained a miniature ferris wheel that was delivered by a full size crane.",
          userId: this.user.id,
          private: false
        }
      };
        request.post(options, (err, res, body) => {
          Wiki.findOne({where: {title: "Mill Ends Park - the smallest park in Oregon"}})
          .then((wiki) => {
            expect(wiki.title).toBe("Mill Ends Park - the smallest park in Oregon");
            expect(wiki.body).toBe("Once contained a miniature ferris wheel that was delivered by a full size crane.");
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });

      //Premium user creating a PRIVATE wiki
      it("should create a new private wiki and redirect", (done) => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Mill Ends Park - the smallest park in Oregon",
          body: "Once contained a miniature ferris wheel that was delivered by a full size crane.",
          userId: this.user.id,
          private: true
        }
      };

        request.post(options, (err, res, body) => {
          Wiki.findOne({where: {title: "Mill Ends Park - the smallest park in Oregon"}})
          .then((wiki) => {
            expect(wiki.title).toBe("Mill Ends Park - the smallest park in Oregon");
            expect(wiki.body).toBe("Once contained a miniature ferris wheel that was delivered by a full size crane.");
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
      it("should not create a new wiki that fails validations", (done) => {
        const options = {
          url: `${base}create`,
            form: {
              title: "a",
              body: "b"
            }
          };
          request.post(options, (err, res, body) => {
            Wiki.findOne({where: {title: "a"}})
            .then((wiki) => {
                expect(wiki).toBeNull();
                done();
            })
            .catch((err) => {
              console.log(err);
              done();
          });
        })
      })
    });

    describe("GET /wikis/:id", () => {
      it("should render a view with the selected wiki", (done) => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Meet Dusty, the cat burglar.");
          done();
        });
      });
    });

    describe("POST /wikis/:id/destroy", () => {
      it("should delete the wiki with the associated ID", (done) => {
        Wiki.findAll()
        .then((wikis) => {
          const wikiCountBeforeDelete = wikis.length;
          expect(wikiCountBeforeDelete).toBe(1);

          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.findAll()
            .then((wikis) => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete -1);
              done();
            })
          });
        });
      });
    });

    describe("GET /wikis/:id/edit", () => {
      it("should render a view with a wiki form", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain("Meet Dusty, the cat burglar.");
          done();
        });
      });
    });

    describe("POST /wikis/:id/update", () => {
      it("should update the wiki with the given values", (done) => {
        request.post({
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "Dusty the Klepto Kitty",
            body: "Meet Dusty, the cat burglar."
          }
        }, (err, res, body) => {
          expect(err).toBeNull();

          Wiki.findOne({
            where: { id:1 }
          })
          .then((wiki) => {
            expect(wiki.title).toBe("Dusty the Klepto Kitty");
            done();
          });
        });
      });
    });
  }); //END OF PREMIUM CONTEXT

  //STANDARD USER CONTEXT
  describe("Standard user performing CRUD actions for Wikis", () => {
    beforeEach((done) => {
      User.create({
        email: "standarduser@example.com",
        password: "standarduserpassword",
        role: 0
      })
      .then((user) => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            role: user.role,
            userId: user.id,
            email: user.email
          }
        }, (err, res, body) => {
          done();
        });
      });
    });

    describe("GET /wikis", () => {
      it("should respond with all wikis", (done) => {
        request.get(base, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          expect(body).toContain("Dusty the Klepto Kitty");
          done();
        });
      });
    });

    describe("GET /wikis/new", () => {
      it("should redirect to wikis view", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          done();
        });
      });
    });

    describe("POST /wikis/create", () => {
      //Standard user creating a PUBLIC wiki
      it("should create a new public wiki and redirect", (done) => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Mill Ends Park - the smallest park in Oregon",
          body: "Once contained a miniature ferris wheel that was delivered by a full size crane.",
          userId: this.user.id,
          private: false
        }
      };

        request.post(options, (err, res, body) => {
          Wiki.findOne({where: {title: "Mill Ends Park - the smallest park in Oregon"}})
          .then((wiki) => {
            expect(wiki.title).toBe("Mill Ends Park - the smallest park in Oregon");
            expect(wiki.body).toBe("Once contained a miniature ferris wheel that was delivered by a full size crane.");
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });

      it("should not be able to create a private wiki", (done) => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Mill Ends Park - the smallest park in Oregon",
          body: "Once contained a miniature ferris wheel that was delivered by a full size crane.",
          userId: this.user.id,
          private: true
        }
      };

        request.post(options, (err, res, body) => {
          Wiki.findOne({where: {title: "Mill Ends Park - the smallest park in Oregon"}})
          .then((wiki) => {
            expect(wiki).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe("GET /wikis/:id", () => {
      it("should render a view with the selected wiki", (done) => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Meet Dusty, the cat burglar.");
          done();
        });
      });
    });

    describe("POST /wikis/:id/destroy", () => {
      it("should not delete the wiki with the associated ID", (done) => {
        Wiki.findAll()
        .then((wikis) => {
          const wikiCountBeforeDelete = wikis.length;
          expect(wikiCountBeforeDelete).toBe(1);

          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.findAll()
            .then((wikis) => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete);
              done();
            })
          });
        });
      });
    });

    describe("GET /wikis/:id/edit", () => {
      it("should render a view with a wiki form", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain("Meet Dusty, the cat burglar.");
          done();
        });
      });
    });

    describe("POST /wikis/:id/update", () => {
      it("should update the wiki with the given values", (done) => {
        request.post({
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "Dusty the Klepto Kitty",
            body: "Meet Dusty, the cat burglar."
          }
        }, (err, res, body) => {
          expect(err).toBeNull();

          Wiki.findOne({
            where: { id:1 }
          })
          .then((wiki) => {
            expect(wiki.title).toBe("Dusty the Klepto Kitty");
            done();
          });
        });
      });
    });
  }); //END OF STANDARD USER CONTEXT

});
