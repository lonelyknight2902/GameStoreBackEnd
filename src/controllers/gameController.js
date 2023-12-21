const gameService = require("../services/gameService");

const getAllGames = async (req, res) => {
  try {
    const allGames = await gameService.getAllGames();
    res.send({ status: "OK", data: allGames });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getOneGame = async (req, res) => {
  const {
    params: { gameId },
    user,
  } = req;
  if (!gameId) {
    res.status(400).send({
      status: "FAILED",
      data: { error: "Parameter ':gameId' can not be empty" },
    });
  }
  try {
    const game = await gameService.getOneGame(gameId, user);
    res.send({ status: "OK", data: game });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getFeatureGames = async (req, res) => {
  try {
    const featureGames = await gameService.getFeatureGames();
    res.send({ status: "OK", data: featureGames });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getUserGames = async (req, res) => {
  const { user } = req;
  if (!user) {
    res.status(400).send({
      status: "FAILED",
      data: { error: "User is not defined" },
    });
  }
  try {
    const userGames = await gameService.getUserGames(user.sub);
    res.send({ status: "OK", data: userGames });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getGameSale = async (req, res) => {
  const {
    params: { gameId },
  } = req;
  if (!gameId) {
    res.status(400).send({
      status: "FAILED",
      data: { error: "Parameter ':gameId' can not be empty" },
    });
  }
  try {
    const sales = await gameService.getGameSales(gameId);
    res.send({ status: "OK", data: { sales: sales } });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getGamesFromProvider = async (req, res) => {
  const {
    params: { providerId },
  } = req;
  if (!providerId) {
    res.status(400).send({
      status: "FAILED",
      data: { error: "Parameter ':providerId' can not be empty" },
    });
  }
  try {
    const gamesFromProvider = await gameService.getGamesFromProvider(
      providerId
    );
    res.send({ status: "OK", data: gamesFromProvider });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getGamesByTag = async (req, res) => {
  const {
    params: { tagId },
  } = req;
  if (!tagId) {
    res.status(400).send({
      status: "FAILED",
      data: { error: "Parameter ':tagId' can not be empty" },
    });
  }
  try {
    const gamesByTag = await gameService.getGamesByTag(tagId);
    res.send({ status: "OK", data: gamesByTag });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getGameRates = async (req, res) => {
  const {
    params: { gameId },
    user,
  } = req;
  if (!gameId) {
    res.status(400).send({
      status: "FAILED",
      data: { error: "Parameter ':gameId' can not be empty" },
    });
  }
  try {
    let gameRates;
    if (user) {
      gameRates = await gameService.getGameRates(gameId, user.sub);
    } else {
      gameRates = await gameService.getGameRates(gameId, null);
    }
    res.send({ status: "OK", data: gameRates });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getGamesBySearch = async (req, res) => {
  const { query } = req;
  if (!query.q) {
    res.status(400).send({
      status: "FAILED",
      data: { error: "Query 'q' can not be empty" },
    });
  }
  try {
    let games;
    games = await gameService.getGamesBySearch(query.q);
    res.send({ status: "OK", data: games });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

module.exports = {
  getAllGames,
  getOneGame,
  getFeatureGames,
  getUserGames,
  getGameSale,
  getGamesFromProvider,
  getGamesByTag,
  getGameRates,
  getGamesBySearch
};
