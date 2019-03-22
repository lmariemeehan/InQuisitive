const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");
const validation = require("./validation");
const helper = require("../auth/helpers");

  router.get("/wikis", wikiController.index);
  router.get("/wikis/new", wikiController.new);
  router.post("/wikis/create",
    helper.ensureAuthenticated,
    validation.validateWikis,
    wikiController.create);
  router.get("/wikis/:id", wikiController.show);
  router.post("/wikis/:id/destroy", wikiController.destroy);
  router.get("/wikis/:id/edit", wikiController.edit);
  router.post("/wikis/:id/update", wikiController.update);
  router.post("/wikis/:id/private", wikiController.private);
  router.post("/wikis/:id/public", wikiController.public);

module.exports = router;
