const express = require("express");
const router = express.Router();
const collaboratorController = require("../controllers/collaboratorController");
const validation = require("./validation");


router.get("/wikis/:wikiId/collaborators/new", collaboratorController.new);
router.post("/wikis/:wikiId/collaborators/create",
  validation.validateCollaborators,
  collaboratorController.create);
router.get("/wikis/:wikiId/collaborators/:id", collaboratorController.show);
router.post("wikis/:wikiId/collaborators/:id/remove", collaboratorController.remove);
//router.get("/wikis/:wikiId/collaborators/:id/edit", collaboratorController.edit);
//router.post("/wikis/:wikiId/collaborators/:id/update", collaboratorController.update);

module.exports = router;
