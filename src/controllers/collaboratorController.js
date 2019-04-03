const collaboratorQueries = require("../db/queries.collaborators.js");
const Authorizer = require("../policies/collaborator.js");
const userQueries = require("../db/queries.users.js");
const User = require("../db/models").User;
const Wiki = require("../db/models").Wiki;
const Collaborator = require("../db/models").User;
const wikiQueries = require("../db/queries.wikis.js");

module.exports = {

  new(req, res, next){
    res.render("collaborators/new", {wikiId: req.params.wikiId});
  },

  create(req, res, next) {
    User.findOne({where: {email: req.body.email}}).then((user) => {
      if(!user){
        req.flash("notice", "User not found");
      }
      console.log("user:", user);

        Collaborator.findAll({
          where: {
            wikiId: req.params.wikiId,
            userId: user.id
          }
        })
        .then((collaborators)=> {
          if(collaborators.length != 0){
            req.flash("notice", "Collaborator has already been added")
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
        res.redirect(`/wikis/${req.params.wikiId}/collaborators/${collaborator.id}`);
      }
      });
      });
    });
  },

  show(req, res, next) {
    wikiQueries.getAllWikis(req.params.wikiId, (err, result) => {
        wiki = result["wiki"];
        collaborators = result["collaborators"];

        if (err || result.wiki == null) {
            res.redirect(404, "/");
        } else {
            const authorized = new Authorizer(req.user, wiki, collaborators).show();
            if (authorized) {
                res.render("collaborators/show", {
                    wiki,
                    collaborators
                });
            } else {
                req.flash("notice", "You are not authorized to do that");
                res.redirect(`/wikis/${req.params.wikiId}`)
            }
        }
    });
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
