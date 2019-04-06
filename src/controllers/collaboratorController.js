const collaboratorQueries = require("../db/queries.collaborators.js");
const userQueries = require("../db/queries.users.js");
const User = require("../db/models").User;
const Wiki = require("../db/models").Wiki;
const Collaborator = require("../db/models").Collaborator;
const wikiQueries = require("../db/queries.wikis.js");

module.exports = {

  new(req, res, next){
    res.render("collaborators/new", {wikiId: req.params.wikiId});
  },

  create(req, res, next) {
    User.findOne({where: {email: req.body.email}}).then((user) => {
      if(!user){
        req.flash("error", [{
          location: 'body',
          param: 'user',
          msg: 'No user found with this email',
          value: '003'
        }]);
        return res.redirect(`/wikis/${req.params.wikiId}/edit`);
      }
      console.log("user:", user);

        Collaborator.findOne({
          where: {
            wikiId: req.params.wikiId,
            userId: user.id
          }
        })
        .then((collaborator)=> {
          if(collaborator){
            req.flash("notice", [{
              location: 'body',
              param: 'user',
              msg: 'Collaborator has already been added',
              value: '003'
            }]);
            return res.redirect(`/wikis/${req.params.wikiId}/edit`);
          }

        let newCollaborator = {
          wikiId: req.params.wikiId,
          userId: user.id
        }
      console.log(newCollaborator)

    collaboratorQueries.addCollaborator(newCollaborator, (err, collaborator) => {
      if(err) {
        console.log(err)
        req.flash("error", err);
        res.redirect(404, "/");
      } else {
        res.redirect(`/wikis/${req.params.wikiId}/edit`);
      }
      });
      });
    });
  },

  destroy(req, res, next){
    collaboratorQueries.deleteCollaborator(req.params.id, (err, deletedRecordsCount) => {
      if(err){
        res.redirect(500, `/wikis/${req.params.wikiId}/collaborators/${req.params.id}`);
      } else {
        res.redirect(303, `/wikis/${req.params.wikiId}`);
      }
    });
  }

}
