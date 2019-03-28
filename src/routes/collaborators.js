const express = require("express");
const router = express.Router();

const collaboratorController = require("../controllers/collaboratorController");
const validation = require("./validation");

router.post("/wikis/:wikiId/addCollaborator",
  validation.validateCollaborators,
  collaboratorController.create);

router.post("wikis/:wikiId/removeCollaborators",
  collaboratorController.destroy);

module.exports = router;
