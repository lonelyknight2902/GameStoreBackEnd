const ownService = require("../services/ownService");

const getOwnForGame = (req, res) => {
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
    const own = ownService.getOwnForGame(gameId);
    res.send({ status: "OK", data: own });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

module.exports = { getOwnForGame };
