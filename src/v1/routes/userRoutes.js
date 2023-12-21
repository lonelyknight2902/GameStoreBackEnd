const express = require("express");
const userController = require("../../controllers/userController");
const authentication = require("../../middleware/authentication");

const router = express.Router();
router.get("/", userController.getAllUsers);
router.post("/login", userController.logInUser);
router.post("/signup", userController.createNewUser);
router.get("/cart", authentication.authenticateToken, userController.getCart);
router.post("/cart", authentication.authenticateToken, userController.addToCart);
router.delete("/cart", authentication.authenticateToken, userController.removeFromCart);
router.post("/checkout", authentication.authenticateToken, userController.purchaseGames);
router.post("/refund", authentication.authenticateToken, userController.refundGames);
router.post("/rate", authentication.authenticateToken, userController.rateGame);
router.delete("/rate", authentication.authenticateToken, userController.removeGameRating);
router.patch("/rate", authentication.authenticateToken, userController.updateGameRating);
module.exports = router;