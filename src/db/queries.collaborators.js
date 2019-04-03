const Collaborator = require("./models").Collaborator;
const Wiki = require("./models").Wiki;
const User = require("./models").User;

const Authorizer = require("../policies/collaborator");

module.exports = {
  addCollaborator(req, callback){
    console.log(req.body.email);
    User.findOne({where: {email: req.body.email}}).then((user) => {
      if(!user){
        callback("User not found");
      }
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
          email: req.body.email,
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
