const User = require("../database/User");

const createNewUser = async (newUser) => {
  try {
    const createdUser = await User.createNewUser(newUser);
    return createdUser;
  } catch (error) {
    throw error;
  }
};

const logInUser = async (user) => {
  try {
    const validUser = await User.logInUser(user);
    return validUser;
  } catch (error) {
    throw error;
  }
};

const getAllUser = async () => {
  try {
    const users = await User.getAllUsers();
    return users;
  } catch (error) {
    throw error;
  }
};

const addToCart = async (cartInfo) => {
  try {
    const cart = await User.addToCart(cartInfo);
    return cart;
  } catch (error) {
    throw error;
  }
};

const removeFromCart = async (cartInfo) => {
  try {
    await User.removeFromCart(cartInfo);
  } catch (error) {
    throw error;
  }
};

const getCart = async (userId) => {
  try {
    const cart = await User.getCart(userId);
    return cart;
  } catch (error) {
    throw error;
  }
};

const purchaseGames = async (userId, gameIds) => {
  try {
    await User.purchaseGames(userId, gameIds);
  } catch (error) {
    throw error;
  }
};

const refundGames = async (refundInfo) => {
  try {
    await User.refundGames(refundInfo);
  } catch (error) {
    throw error;
  }
};

const rateGame = async (rateInfo) => {
  try {
    await User.rateGame(rateInfo);
  } catch (error) {
    throw error;
  }
};

const removeGameRating = async (rateInfo) => {
  try {
    await User.removeGameRating(rateInfo);
  } catch (error) {
    throw error;
  }
};

const updateGameRating = async (rateInfo) => {
  try {
    await User.updateGameRating(rateInfo);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createNewUser,
  logInUser,
  getAllUser,
  addToCart,
  removeFromCart,
  getCart,
  purchaseGames,
  refundGames,
  rateGame,
  removeGameRating,
  updateGameRating
};
