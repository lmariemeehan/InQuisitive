const Collaborator = require("./models").Collaborator;
const Wiki = require("./models").Wiki;
const User = require("./models").User;

const Authorizer = require("../policies/collaborator");

module.exports = {

  addCollaborator(newCollaborator, callback){
    return Collaborator.create(newCollaborator)
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
    return Collaborator.destroy({
      where: { id }
    })
    .then((deletedRecordsCount) => {
      callback(null, deletedRecordsCount);
    })
    .catch((err) => {
      callback(err);
    })
  },

  updateCollaborator(id, updatedCollaborator, callback){
    return Collaborator.findById(id)
    .then((collaborator) => {
      if(!collaborator){
        return callback("Collaborator not found");
      }

      collaborator.update(updatedCollaborator, {
        fields: Object.keys(updatedCollaborator)
      })
      .then(() => {
        callback(err);
      });
    });
  }

}
