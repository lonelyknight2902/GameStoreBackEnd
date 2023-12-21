const express = require("express");
const gameController = require("../../controllers/gameController");
const ownController = require("../../controllers/ownController");
const authentication = require("../../middleware/authentication");
// const userController = require("../../controllers/userController");

const router = express.Router();

router.get("/", gameController.getAllGames);

router.get("/feature", gameController.getFeatureGames);

router.get("/user", authentication.authenticateToken, gameController.getUserGames);
router.get("/search", gameController.getGamesBySearch)
router.get("/:gameId", authentication.authenticationCheck ,gameController.getOneGame);
router.get("/rate/:gameId", authentication.authenticationCheck, gameController.getGameRates);
router.get("/sales/:gameId", gameController.getGameSale);
router.get("/provider/:providerId", gameController.getGamesFromProvider);
router.get("/tag/:tagId", gameController.getGamesByTag);

// router.get("/:gameId/own", ownController.getOwnForGame);




module.exports = router;