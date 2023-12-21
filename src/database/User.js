const oracledb = require("oracledb");
const config = require("./config");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const getAllUsers = async () => {
  let connection;
  let result;
  let sql = `SELECT * FROM USERS`;
  let binds = {};
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
  };
  try {
    await oracledb.createPool(config);
    connection = await oracledb.getConnection();
    result = await connection.execute(sql, binds, options);
    // if (result.rows.length == 0) {
    //   return;
    // }
    return result.rows;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
};

const createNewUser = async (newUser) => {
  let binds = {};
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
    autoCommit: true,
  };
  try {
    await oracledb.createPool(config);
    let sql = `SELECT UserId FROM USERS WHERE Username='${newUser.username}'`;
    let connection = await oracledb.getConnection();
    let result = await connection.execute(sql, binds, options);
    if (result.rows.length > 0) {
      throw {
        status: 400,
        message: `User with the username '${newUser.username}' already exists`,
      };
    }
    let hashPassword = await bcrypt.hash(newUser.password, saltRounds);
    sql = `INSERT INTO USERS (Username, Password, ImageUrl) VALUES ('${newUser.username}', '${hashPassword}', '${newUser.imageUrl}')`;
    console.log(sql);
    await connection.execute(sql, binds, options);
    return newUser;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
};

const logInUser = async (user) => {
  let binds = {};
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  };
  try {
    await oracledb.createPool(config);
    let sql = `SELECT * FROM USERS WHERE Username='${user.username}'`;
    let connection = await oracledb.getConnection();
    let result = await connection.execute(sql, binds, options);
    if (result.rows.length == 0) {
      throw {
        status: 400,
        message: `Incorrect username or password`,
      };
    }
    let valid = await bcrypt.compare(user.password, result.rows[0].PASSWORD);
    if (!valid) {
      throw {
        status: 400,
        message: `Incorrect username or password`,
      };
    }
    delete result.rows[0]["PASSWORD"];
    return result.rows[0];
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
};

const addToCart = async (cartInfo) => {
  let binds = {};
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
    autoCommit: true,
  };
  try {
    let sql = `SELECT GameId FROM IN_CART WHERE UserId = ${cartInfo.userId} AND GameId = ${cartInfo.gameId}`;
    await oracledb.createPool(config);
    connection = await oracledb.getConnection();
    let result = await connection.execute(sql, binds, options);
    if (result.rows.length > 0) {
      throw {
        status: 400,
        message: `'Game already exists in cart`,
      };
    }
    sql = `INSERT INTO IN_CART (GameId, UserId) VALUES (${cartInfo.gameId}, ${cartInfo.userId})`;
    result = await connection.execute(sql, binds, options);
    return cartInfo;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
};

const removeFromCart = async (cartInfo) => {
  let binds = {};
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
    autoCommit: true,
  };
  try {
    let sql = `SELECT GameId FROM IN_CART WHERE UserId = ${cartInfo.userId} AND GameId = ${cartInfo.gameId}`;
    await oracledb.createPool(config);
    connection = await oracledb.getConnection();
    let result = await connection.execute(sql, binds, options);
    if (result.rows.length == 0) {
      throw {
        status: 400,
        message: `'Game is not in cart`,
      };
    }
    sql = `DELETE FROM IN_CART WHERE UserId = ${cartInfo.userId} AND GameId = ${cartInfo.gameId}`;
    result = await connection.execute(sql, binds, options);
    return;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
};

const getCart = async (userId) => {
  let binds = {};
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
  };
  try {
    let sql = `SELECT G.GameId, G.Name, G.Price, G.CoverImageUrl, Amount, EndDate FROM GAMES G JOIN IN_CART IC on G.GameId = IC.GameId LEFT JOIN SALES S on G.GameId = S.GameId WHERE UserId = ${userId}`;
    await oracledb.createPool(config);
    connection = await oracledb.getConnection();
    let result = await connection.execute(sql, binds, options);
    return result.rows;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
};

// const purchaseAGame = async (userId, gameId) => {
//   let binds = {};
//   let options = {
//     outFormat: oracledb.OUT_FORMAT_OBJECT,
//     autoCommit: true,
//   };
//   try {
//     let sql = `DELETE IN_CART WHERE UserId = ${userId} AND gameId = ${gameId}`;
//     await oracledb.createPool(config);
//     connection = await oracledb.getConnection();
//     await connection.execute(sql, binds, options);
//     sql = `INSERT INTO OWNS (UserId, GameId) VALUES (${userId}, ${GameId})`;
//     await connection.execute(sql, binds, options);
//     return;
//   } catch (error) {
//     throw { status: error?.status || 500, message: error?.message || error };
//   } finally {
//     await oracledb.getPool().close(0);
//   }
// }

const purchaseGames = async (userId, gameIds) => {
  let binds = {};
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
    autoCommit: true,
  };
  try {
    // let sql = `SELECT GameId FROM IN_CART WHERE UserId = ${userId}`;
    let sql = `DELETE FROM IN_CART WHERE UserId = ${userId} AND GameId IN (${gameIds.join()})`;
    console.log(sql);
    await oracledb.createPool(config);
    connection = await oracledb.getConnection();
    await connection.execute(sql, binds, options);
    for (game of gameIds) {
      sql = `INSERT INTO OWNS(UserId, GameId) VALUES (${userId}, ${game})`;
      await connection.execute(sql, binds, options);
    }
    return;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
};

const refundGames = async (refundInfo) => {
  let binds = {};
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
    autoCommit: true,
  };
  try {
    let sql = `SELECT GameId FROM OWNS WHERE UserId = ${refundInfo.userId} AND GameId = ${refundInfo.gameId}`;
    await oracledb.createPool(config);
    connection = await oracledb.getConnection();
    let result = await connection.execute(sql, binds, options);
    if (result.rows.length == 0) {
      throw {
        status: 400,
        message: `User doesn't own this game`,
      };
    }
    sql = `DELETE FROM OWNS WHERE UserId = ${refundInfo.userId} AND GameId = ${refundInfo.gameId}`;
    await connection.execute(sql, binds, options);
    return;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
};

const rateGame = async (rateInfo) => {
  let binds = {};
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
    autoCommit: true,
  };
  try {
    let sql = `SELECT GameId FROM RATES WHERE UserId = ${rateInfo.userId} AND GameId = ${rateInfo.gameId}`;
    await oracledb.createPool(config);
    connection = await oracledb.getConnection();
    let result = await connection.execute(sql, binds, options);
    if (result.rows.length > 0) {
      throw {
        status: 400,
        message: `User has already rated the game`,
      };
    }
    if (rateInfo.comment) {
      sql = `INSERT INTO RATES (UserId, GameId, Rating, "Comment") VALUES (${rateInfo.userId}, ${rateInfo.gameId}, ${rateInfo.rating}, '${rateInfo.comment}')`;
    } else {
      sql = `INSERT INTO RATES (UserId, GameId, Rating) VALUES (${rateInfo.userId}, ${rateInfo.gameId}, ${rateInfo.rating})`;
    }
    await connection.execute(sql, binds, options);
    return;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
};

const removeGameRating = async (rateInfo) => {
  let binds = {};
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
    autoCommit: true,
  };
  try {
    let sql = `SELECT GameId FROM RATES WHERE UserId = ${rateInfo.userId} AND GameId = ${rateInfo.gameId}`;
    await oracledb.createPool(config);
    connection = await oracledb.getConnection();
    let result = await connection.execute(sql, binds, options);
    if (result.rows.length == 0) {
      throw {
        status: 400,
        message: `User has not rated the game`,
      };
    }
    sql = `DELETE FROM RATES WHERE UserId = ${rateInfo.userId} AND GameId = ${rateInfo.gameId}`;
    await connection.execute(sql, binds, options);
    return;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
};

const updateGameRating = async (rateInfo) => {
  let binds = {};
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
    autoCommit: true,
  };
  try {
    let sql = `SELECT GameId FROM RATES WHERE UserId = ${rateInfo.userId} AND GameId = ${rateInfo.gameId}`;
    await oracledb.createPool(config);
    connection = await oracledb.getConnection();
    let result = await connection.execute(sql, binds, options);
    if (result.rows.length == 0) {
      throw {
        status: 400,
        message: `User has not rated the game`,
      };
    }
    sql = `UPDATE RATES SET Rating = ${rateInfo.rating}, "Comment" = '${rateInfo.comment}' WHERE UserId = ${rateInfo.userId} AND GameId = ${rateInfo.gameId}`;
    await connection.execute(sql, binds, options);
    return;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
};

module.exports = {
  createNewUser,
  logInUser,
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
