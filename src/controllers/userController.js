const userService = require("../services/userService");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createNewUser = async (req, res) => {
  const { body } = req;
  if (!body.username || !body.password || !body.imageUrl) {
    res.status(400).send({
      status: "FAILED",
      data: {
        error:
          "One of the following keys is missing or is empty in request body: 'username', 'password', 'imageUrl'",
      },
    });
    return;
  }
  const newUser = {
    username: body.username,
    password: body.password,
    imageUrl: body.imageUrl,
  };

  try {
    const createdUser = await userService.createNewUser(newUser);
    res.status(201).send({ status: "OK", data: createdUser });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const logInUser = async (req, res) => {
  const { body } = req;
  if (!body.username || !body.password) {
    res.status(400).send({
      status: "FAILED",
      data: {
        error:
          "One of the following keys is missing or is empty in request body: 'username', 'password'",
      },
    });
    return;
  }
  const user = {
    username: body.username,
    password: body.password,
  };
  try {
    const validUser = await userService.logInUser(user);
    const payload = {
      sub: validUser.USERID,
      name: validUser.USERNAME,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    res.send({
      status: "OK",
      data: { ...validUser, accessToken: accessToken },
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await userService.getAllUser();
    res.send({ status: "OK", data: allUsers });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const addToCart = async (req, res) => {
  const { body, user } = req;
  if (!body.gameId || !user) {
    res.status(400).send({
      status: "FAILED",
      data: {
        error:
          "One of the following keys is missing or is empty in request body: 'gameId'",
      },
    });
    return;
  }
  const cartInfo = {
    userId: user.sub,
    gameId: body.gameId,
  };
  try {
    const cart = await userService.addToCart(cartInfo);
    res.send({ status: "OK", data: cart });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const removeFromCart = async (req, res) => {
  const { body, user } = req;
  if (!body.gameId || !user) {
    res.status(400).send({
      status: "FAILED",
      data: {
        error:
          "One of the following keys is missing or is empty in request body: 'gameId'",
      },
    });
    return;
  }
  const cartInfo = {
    userId: user.sub,
    gameId: body.gameId,
  };
  try {
    await userService.removeFromCart(cartInfo);
    res.send({ status: "OK" });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getCart = async (req, res) => {
  const { user } = req;
  if (!user) {
    res.status(400).send({
      status: "FAILED",
      data: { error: "Parameter ':userId' can not be empty" },
    });
  }
  try {
    const cart = await userService.getCart(user.sub);
    res.send({ status: "OK", data: cart });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const purchaseGames = async (req, res) => {
  const { body, user } = req;
  console.log(body.gameIds);
  if (!body.gameIds || !user) {
    res.status(400).send({
      status: "FAILED",
      data: {
        error:
          "One of the following keys is missing or is empty in request body: 'gameIds'",
      },
    });
    return;
  }
  try {
    await userService.purchaseGames(user.sub, body.gameIds);
    res.send({ status: "OK" });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const refundGames = async (req, res) => {
  const { body, user } = req;
  if (!body.gameId || !user) {
    res.status(400).send({
      status: "FAILED",
      data: {
        error:
          "One of the following keys is missing or is empty in request body: 'gameId'",
      },
    });
    return;
  }
  const refundInfo = {
    userId: user.sub,
    gameId: body.gameId,
  };
  try {
    await userService.refundGames(refundInfo);
    res.send({ status: "OK" });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const rateGame = async (req, res) => {
  const { body, user } = req;
  if (!body.gameId || !user) {
    res.status(400).send({
      status: "FAILED",
      data: {
        error:
          "One of the following keys is missing or is empty in request body: 'gameId'",
      },
    });
    return;
  }
  const rateInfo = {
    userId: user.sub,
    gameId: body.gameId,
    rating: body.rating,
    comment: body.comment,
  };
  try {
    await userService.rateGame(rateInfo);
    res.send({ status: "OK" });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const removeGameRating = async (req, res) => {
  const { body, user } = req;
  if (!body.gameId || !user) {
    res.status(400).send({
      status: "FAILED",
      data: {
        error:
          "One of the following keys is missing or is empty in request body: 'gameId'",
      },
    });
    return;
  }
  const rateInfo = {
    userId: user.sub,
    gameId: body.gameId,
  };
  try {
    await userService.removeGameRating(rateInfo);
    res.send({ status: "OK" });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const updateGameRating = async (req, res) => {
  const { body, user } = req;
  if (!body.gameId || !user) {
    res.status(400).send({
      status: "FAILED",
      data: {
        error:
          "One of the following keys is missing or is empty in request body: 'gameId'",
      },
    });
    return;
  }
  const rateInfo = {
    userId: user.sub,
    gameId: body.gameId,
    rating: body.rating,
    comment: body.comment,
  };
  try {
    await userService.updateGameRating(rateInfo);
    res.send({ status: "OK" });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

module.exports = {
  logInUser,
  createNewUser,
  getAllUsers,
  addToCart,
  removeFromCart,
  getCart,
  purchaseGames,
  refundGames,
  rateGame,
  removeGameRating,
  updateGameRating,
};
