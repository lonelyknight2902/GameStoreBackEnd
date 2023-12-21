const Game = require("../database/Game");

const getAllGames = async () => {
  try {
    const allGames = await Game.getAllGames();
    return allGames;
  } catch (error) {
    throw error;
  }
};

const getOneGame = async (gameId, user) => {
  try {
    const game = await Game.getOneGame(gameId, user);
    return game;
  } catch (error) {
    throw error;
  }
};

const getFeatureGames = async () => {
  try {
    const featureGames = await Game.getFeatureGames();
    return featureGames;
  } catch (error) {
    throw error;
  }
};

const getUserGames = async (userId) => {
  try {
    const userGames = await Game.getUserGames(userId);
    return userGames;
  } catch (error) {
    throw error;
  }
};

const getGameSales = async (gameId) => {
  try {
    const sales = await Game.getGameSales(gameId);
    return sales;
  } catch (error) {
    throw error;
  }
};

const getGamesFromProvider = async (providerId) => {
  try {
    const gamesFromProvider = await Game.getGamesFromProvider(providerId);
    return gamesFromProvider;
  } catch (error) {
    throw error;
  }
};

const getGamesByTag = async (tagId) => {
  try {
    const gamesByTag = await Game.getGamesByTag(tagId);
    return gamesByTag;
  } catch (error) {
    throw error;
  }
};

const getGameRates = async (gameId, userId) => {
  try {
    const gameRates = await Game.getGameRates(gameId, userId);
    return gameRates;
  } catch (error) {
    throw error;
  }
};

const getGamesBySearch = async (query) => {
  try {
    const games = await Game.getGamesBySearch(query);
    return games;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllGames,
  getOneGame,
  getFeatureGames,
  getUserGames,
  getGameSales,
  getGamesFromProvider,
  getGamesByTag,
  getGameRates,
  getGamesBySearch
};
