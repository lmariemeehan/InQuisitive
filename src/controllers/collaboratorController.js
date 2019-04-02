const collaboratorQueries = require("../db/queries.collaborators.js");
const Authorizer = require("../policies/collaborator.js");
const userQueries = require("../db/queries.users.js");
const User = require("../db/models").User;
const Wiki = require("../db/models").Wiki;
const wikiQueries = require("../db/queries.wikis.js");

module.exports = {

  new(req, res, next){
    res.render("collaborators/new", {wikiId: req.params.wikiId});
  },

  create(req, res, next) {
    collaboratorQueries.addCollaborator(req.params.id, (err, collaborator) => {
      if(err) {
        console.log(err);
        req.flash("error", err);
      } else {
        console.log("Successfully created a collaborator");
        res.redirect(`/wikis/${req.params.wikiId}`);
      }
    });
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
