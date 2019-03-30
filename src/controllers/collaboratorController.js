const collaboratorQueries = require("../db/queries.collaborators.js");
const Authorizer = require("../policies/collaborator.js");

module.exports = {

  new(req, res, next){
    res.render("collaborators/new", {wikiId: req.params.wikiId});
  },

  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();
    if(authorized){

      let newCollaborator = {
        name: req.body.body,
        wikiId: req.params.wikiId,
        userId: req.body.collaborator.id
      };

      collaboratorQueries.addCollaborator(newCollaborator, (err, collaborator) => {
        if(err) {
          res.redirect(500, "/collaborators/new");
        } else {
          req.flash("notice", "You must be signed in to do that.")
          req.redirect(303, `/wikis/${newCollaborator.wikiId}/collaborators/${collaborator.id}`);
        }
      })
    }
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
    collaboratorQueries.deleteCollaborator(req, (err, collaborator) => {
      if(err){
        res.redirect(err, req.headers.referer);
      } else {
        res.redirect(req.headers.referer);
      }
    });
  }


}
