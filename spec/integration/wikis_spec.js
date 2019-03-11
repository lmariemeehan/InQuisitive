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
        password: "helloworld"
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
      Wiki.all()
      .then((wikis) => {
        const wikiCountBeforeDelete = wikis.length;
        expect(wikiCountBeforeDelete).toBe(1);

        request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
          Wiki.all()
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
});
