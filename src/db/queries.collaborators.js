const Collaborator = require("./models").Collaborator;
const Wiki = require("./models").Wiki;
const User = require("./models").User;

const Authorizer = require("../policies/collaborator");

module.exports = {

  createCollaborator(newCollaborator, callback){
    return Collaborator.create(newCollaborator)
    .then((collaborator) => {
      callback(null, collaborator);
    })
    .catch((err) => {
      callback(err);
    });
  },

  deleteCollaborator(req, callback){
    return Collaborator.findById(req.params.id)
    .then((collaborator) => {
      const authorized = new Authorizer(req.user, collaborator).destroy();

      if(authorized){
        collaborator.destroy();
        callback(null, collaborator)
      } else {
        req.flash("notice", "You are not authorized to do that.")
        callback(401)
      }
    })
  }
  
}
