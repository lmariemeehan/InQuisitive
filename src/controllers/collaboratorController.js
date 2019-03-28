const collaboratorQueries = require("../db/queries.collaborators.js");
const Authorizer = require("../policies/collaborator.js");

module.exports = {

  create(req, res, next) {
  const authorized = new Authorizer(req.user).create();
  if(authorized){

    let newCollaborator = {
      name: req.body.body,
      wikiId: req.params.wikiId,
      userId: req.user.id
    };

    collaboratorQueries.createCollaborator(newCollaborator, (err, collaborator) => {
      if(err) {
        req.flash("error", err);
      }
      res.redirect(req.headers.referer);
    });
    } else {
      req.flash("notice", "You must be signed in to do that.")
      req.redirect("/users/sign_in");
    }
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
