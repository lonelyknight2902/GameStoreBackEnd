const DB = require("./db.json");

const getOwnForGame = (gameId) => {
  try {
    const own = DB.records.filter((record) => record.workout === gameId);
    if(!own) {
      throw {
        status: 400,
        message: `Can't find game with the id '${gameId}'`,
      };
    }
    return own;
  } catch(error) {
    throw {status: error?.status || 500, message: error?.message || error};
  }
};

module.exports = { getOwnForGame };