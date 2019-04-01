/*

ALTERNATE collaboratorController

const collaboratorQueries = require("../db/queries.collaborators.js");
const Authorizer = require("../policies/collaborator.js");
const userQueries = require("../db/queries.users.js");
const User = require("../db/models").User;

module.exports = {

  new(req, res, next){
    res.render("collaborators/new", {wikiId: req.params.wikiId});
  },

  create(req, res, next) {
    User.findOne({where: {email: req.body.email}}).then((user) => {

      if(user){

      let newCollaborator = {
        wikiId: req.params.wikiId,
        userId: req.user.id
      };

      collaboratorQueries.addCollaborator(newCollaborator, (err, collaborator) => {
        if(err) {
          console.log("ERROR", err);
          req.flash("error", err);
          res.redirect(typeof err == "number" ? err: 500, req.headers.referer);
        } else {
          req.redirect(303, `/wikis/${newCollaborator.wikiId}/collaborators/${collaborator.id}`);
        }
      })
      } else {
        req.flash("notice", "User not found");
        res.redirect("/wikis");
      }
    })
  },

  show(req, res, next) {
    collaboratorQueries.getCollaborator(req.params.id, (err, collaborator) => {
      if(err || collaborator == null){
        res.redirect(404, "/");
      } else {
        res.render("collaborators/show", {collaborator});
      }
    })
  },

  remove(req, res, next){
    collaboratorQueries.deleteCollaborator(req.params.id, (err, deletedRecordsCount) => {
      if(err){
        res.redirect(500, `/wikis/${req.params.wikiId}/collaborators/${req.params.id}`);
      } else {
        res.redirect(303, `/wikis/${req.params.wikiId}`);
      }
    });
  }

}

*?
