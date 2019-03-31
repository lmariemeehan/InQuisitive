const collaboratorQueries = require("../db/queries.collaborators.js");
const Authorizer = require("../policies/collaborator.js");
const userQueries = require("../db/queries.users.js");
const User = require("../db/models").User;

module.exports = {

  new(req, res, next){
    res.render("collaborators/new", {wikiId: req.params.wikiId});
  },

  create(req, res, next) {
    User.findAll({where: {id: req.body.userId}}).then((users) => {
      users.forEach((user) => {
      const authorized = new Authorizer(user).create();
        if(authorized){

        let newCollaborator = {
          name: req.body.name,
          wikiId: req.params.wikiId,
          userId: req.body.userId
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

        }
      })
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

  destroy(req, res, next){
    collaboratorQueries.deleteCollaborator(req.params.id, (err, deletedRecordsCount) => {
      if(err){
        res.redirect(500, `/wikis/${req.params.wikiId}/collaborators/${req.params.id}`);
      } else {
        res.redirect(303, `/wikis/${req.params.wikiId}`);
      }
    });
  },

  edit(req, res, next){
    collaboratorQueries.getCollaborator(req.params.id, (err, collaborator) => {
      if(err || collaborator == null) {
        res.redirect(404, "/");
      } else {
        res.render("wikis/edit", {collaborator});
      }
    });
  },

  update(req, res, next) {
    collaboratorQueries.updateCollaborator(req.params.id, req.body, (err, collaborator) => {
      if(err || collaborator == null) {
        res.redirect(404, `/wikis/${req.params.wikiId}/collaborators/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${req.params.wikiId}/collaborators/${req.params.id}`);
      }
    });
  }

}
