const express = require("express");
const router = express.Router();
const staticController = require("../controllers/staticController");

router.get("/", (req, res, next) => {
	res.send("Welcome to Blocipedia");
});

router.get("/", staticController.index);

module.exports = router;