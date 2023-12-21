const Own = require("../database/Own");

const getOwnForGame = (gameId) => {
  try {
    const own = Own.getOwnForGame(gameId);
    return own;
  } catch (error) {
    throw error;
  }
}

module.exports = { getOwnForGame };