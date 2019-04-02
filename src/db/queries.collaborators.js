const Collaborator = require("./models").Collaborator;
const Wiki = require("./models").Wiki;
const User = require("./models").User;

const Authorizer = require("../policies/collaborator");

module.exports = {
  addCollaborator(newCollaborator, callback){
    User.findOne({where: {email: req.body.email}}).then((user) => {
      if(!user){
        callback("User not found");
      }
      console.log(user);
        Collaborator.findAll({
          where: {
            wikiId: req.params.wikiId,
            userId: user.id
          }
        })
        .then((collaborators)=> {
          if(collaborators.length != 0){
            callback("Collaborator has already been added")
          }

        let newCollaborator = {
          wikiId: req.params.wikiId,
          userId: user.id
        }
      console.log("newCollaborator");
        return Collaborator.create({
          wikiId: newCollaborator.wikiId,
          userId: newCollaborator.userId
        })
        .then((collaborator) => {
          callback(null, collaborator);
        })
        .catch((err) => {
          callback(err);
        })
      })
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
