const wikiQueries = require("../db/queries.wikis.js");
const Wiki = require("../db/models").Wiki;
const User = require("../db/models").User;
const Authorizer = require("../policies/wiki");
const Sequelize = require("sequelize");
const markdown = require("markdown").markdown;
const passport = require("passport");

module.exports = {

  index(req, res, next){
    wikiQueries.getAllWikis((err, wikis) => {
      if(err){
        req.flash("error", "Error:");
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/index", {wikis});
      }
    })
  },

  new(req, res, next){
    const authorized = new Authorizer(req.user).new();
      if(authorized) {
        res.render("wikis/new");
      } else {
        req.flash("notice", "You need to be signed in to create a wiki.");
        res.redirect("/wikis");
      }
  },

  create(req, res, next){
    if(req.body.private == "false" || req.body.private == null){
        let newWiki = {
          title: req.body.title,
          body: req.body.body,
          userId: req.user.id,
          private: false
        }
        wikiQueries.addWiki(newWiki, (err, wiki) => {
          if(err){
            console.log(err);
            res.redirect(500, "/wikis/new");
          } else {
            console.log(wiki);
            res.redirect(303, `/wikis/${wiki.id}`);
          }
        });
      } else {
        let newWiki = {
          title: req.body.title,
          body: req.body.body,
          userId: req.user.id,
          private: true
        }
        wikiQueries.addWiki(newWiki, (err, wiki) => {
          if(err){
            console.log(err);
            res.redirect(500, "/wikis/new");
          } else {
            console.log(wiki);
            res.redirect(303, `/wikis/${wiki.id}`);
          }
        });
      }
  },

  show(req, res, next){
    console.log("initial view")
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null){
        console.log(err);
        res.redirect(404, "/");
      } else {
        wiki.title = markdown.toHTML(wiki.title);
        wiki.body = markdown.toHTML(wiki.body);
        res.render("wikis/show", {wiki});
      }
    });
  },

  destroy(req, res, next){
    wikiQueries.deleteWiki(req.params.id, (err, wiki) => {
      if(err){
        res.redirect(500, `/wikis/${req.params.id}`);
      } else {
        res.redirect(303, "/wikis");
      }
    });
  },

  edit(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null){
        res.redirect(404, "/");
      } else {
        res.render("wikis/edit", {wiki});
      }
    });
  },

  update(req, res, next){
    wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
      if(err || wiki == null){
        res.redirect(404, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${wiki.id}`);
      }
    });
  }

}
