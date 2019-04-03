const Collaborator = require("./models").Collaborator;
const Wiki = require("./models").Wiki;
const User = require("./models").User;

const Authorizer = require("../policies/collaborator");

module.exports = {
  
  addCollaborator(req, callback){
    let newCollaborator = {
      wikiId: req.params.wikiId,
      userId: user.id
    }
    return Collaborator.create({newCollaborator})
    .then((collaborator) => {
      callback(null, collaborator);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getCollaborator(id, callback){
    return Collaborator.findById(id)
    .then((collaborator) => {
      callback(null, collaborator);
    })
    .catch((err) => {
      callback(err);
    })
  },

  deleteCollaborator(id, callback){
    return Collaborator.remove({
      where: { id }
    })
    .then((deletedRecordsCount) => {
      callback(null, deletedRecordsCount);
    })
    .catch((err) => {
      callback(err);
    })
  }

}
