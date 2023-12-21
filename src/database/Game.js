// const DB = require("./db.json")
const oracledb = require("oracledb");
// const pool = require("./db");
const config = require("./config");

const getAllGames = async () => {
  let connection;
  let result;
  let sql = `SELECT * FROM GAMES`;
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

const getOneGame = async (gameId, user) => {
  let connection;
  let result;
  let sql = [
    `SELECT GAMES.*, PUBLISHER.Name PublisherName, DEVELOPER.Name DeveloperName, Amount, EndDate, (SELECT AVG(RATING) FROM RATES WHERE GAMES.GameId = RATES.GameId) AS AvgRating FROM GAMES INNER JOIN PROVIDERS PUBLISHER ON GAMES.PublisherId = PUBLISHER.ProviderId JOIN PROVIDERS DEVELOPER ON GAMES.PublisherId = DEVELOPER.ProviderId LEFT JOIN SALES S on GAMES.GameId = S.GameId WHERE GAMES.GameId = ${gameId}`,
    `SELECT TAGS.TagId, TAGS.TagName
  FROM HAS_TAG JOIN TAGS on TAGS.TagId = HAS_TAG.TagId
  WHERE GameId = ${gameId}`,
    `SELECT ImageUrl
    FROM IMAGES
    WHERE GameId = ${gameId}`,
  ];
  let binds = {};
  // For a complete list of options see the documentation.
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
  };

  try {
    // const game = DB.games.find((game) => game.id === gameId);
    // if (!game) {
    //   return;
    // }
    // return game;
    await oracledb.createPool(config);
    connection = await oracledb.getConnection();
    result = await connection.execute(sql[0], binds, options);
    if (result.rows.length == 0) {
      return [];
    }
    let tags = await connection.execute(sql[1], binds, options);
    let images = await connection.execute(sql[2], binds, options);
    result.rows[0].tags = tags.rows;
    result.rows[0].images = images.rows.map((imageObj) => imageObj.IMAGEURL);
    if (user) {
      let ownSql = `SELECT GameId FROM OWNS WHERE GameId = ${gameId} AND UserId = ${user.sub}`;
      let cartSql = `SELECT GameId FROM IN_CART WHERE GameId = ${gameId} AND UserId = ${user.sub}`;
      let own = await connection.execute(ownSql, binds, options);
      let cart = await connection.execute(cartSql, binds, options);

      result.rows[0].own = own.rows.length > 0;
      result.rows[0].cart = cart.rows.length > 0;
    } else {
      result.rows[0].own = false;
      result.rows[0].cart = false;
    }
    return result.rows;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
};

const getFeatureGames = async () => {
  let connection;
  let result;
  let sql = `SELECT GameId, Name, Price, Summary, CoverImageUrl, FeatureImageUrl FROM GAMES WHERE IsFeature='y'`;
  let binds = {};
  // For a complete list of options see the documentation.
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
  };
  try {
    await oracledb.createPool(config);
    connection = await oracledb.getConnection();
    result = await connection.execute(sql, binds, options);
    // if (result.rows.length == 0) {
    //   return [];
    // }
    return result.rows;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
};

const getUserGames = async (userId) => {
  let binds = {};
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
  };
  try {
    let sql = `SELECT G.GameId, G.Name, G.CoverImageUrl FROM GAMES G JOIN OWNS O on G.GameId = O.GameId WHERE UserId = ${userId}`;
    await oracledb.createPool(config);
    connection = await oracledb.getConnection();
    let result = await connection.execute(sql, binds, options);
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

const addFeatureGame = async (gameId) => {
  let connection;
  let result;
  let sql = `UPDATE GAMES SET IsFeature = 'y' WHERE GameId = ${gameId} AND IsFeature = 'n'`;
  let binds = {};
  // For a complete list of options see the documentation.
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
    autoCommit: true,
  };
  try {
    await oracledb.createPool(config);
    connection = await oracledb.getConnection();
    result = await connection.execute(sql, binds, options);
    // if (result.rows.length == 0) {
    //   return [];
    // }
    return;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
};

const removeFeatureGame = async (gameId) => {
  let connection;
  let result;
  let sql = `UPDATE GAMES SET IsFeature = 'n' WHERE GameId = ${gameId} AND IsFeature = 'y'`;
  let binds = {};
  // For a complete list of options see the documentation.
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
    autoCommit: true,
  };
  try {
    await oracledb.createPool(config);
    connection = await oracledb.getConnection();
    result = await connection.execute(sql, binds, options);
    // if (result.rows.length == 0) {
    //   return [];
    // }
    return;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
};

const getGameSales = async (gameId) => {
  let binds = {};
  // For a complete list of options see the documentation.
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
  };
  try {
    await oracledb.createPool(config);
    let sql = `SELECT COUNT(GameId) FROM OWNS WHERE GameId = ${gameId}`;
    let connection = await oracledb.getConnection();
    let result = await connection.execute(sql, binds, options);
    // if (result.rows.length == 0) {
    //   return [];
    // }
    return result.rows[0]["COUNT(GAMEID)"];
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
};

const getGamesFromProvider = async (providerId) => {
  let binds = {};
  // For a complete list of options see the documentation.
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
  };
  try {
    await oracledb.createPool(config);
    let sql = `SELECT GameId, Name, Price, CoverImageUrl FROM GAMES WHERE DeveloperId = ${providerId} OR PublisherId = ${providerId}`;
    let connection = await oracledb.getConnection();
    let result = await connection.execute(sql, binds, options);
    // if (result.rows.length == 0) {
    //   return [];
    // }
    return result.rows;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
};

const getGamesByTag = async (tagId) => {
  let binds = {};
  // For a complete list of options see the documentation.
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
  };
  try {
    await oracledb.createPool(config);
    let sql = `SELECT GAMES.GameId, Name, Price, CoverImageUrl FROM GAMES JOIN HAS_TAG HT on GAMES.GameId = HT.GameId WHERE TagId = ${tagId}`;
    let connection = await oracledb.getConnection();
    let result = await connection.execute(sql, binds, options);
    // if (result.rows.length == 0) {
    //   return [];
    // }
    return result.rows;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
};

const getGameRates = async (gameId, userId) => {
  let binds = {};
  // For a complete list of options see the documentation.
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
  };
  try {
    await oracledb.createPool(config);
    let sql = `SELECT RATES.UserId, Username, ImageUrl, "Comment", Rating FROM RATES JOIN USERS U on U.UserId = RATES.UserId WHERE GameId = ${gameId}`;
    if(userId) sql += ` ORDER BY (CASE RATES.UserId WHEN ${userId} then 0 else 1 end)`;
    console.log(sql);
    let connection = await oracledb.getConnection();
    let result = await connection.execute(sql, binds, options);
    // if (result.rows.length == 0) {
    //   return [];
    // }
    if(userId && result.rows[0] && result.rows[0].USERID == userId) {
      return {
        userComment: result.rows[0],
        comments: result.rows.slice(1)
      };
    }
    return {
      comments: result.rows
    }
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
};

const getGamesBySearch = async (query) => {
  let binds = {};
  let options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
  };
  try {
    let sql = `SELECT GameId, Name, CoverImageUrl FROM GAMES WHERE LOWER(Name) LIKE '%${query}%'`;
    await oracledb.createPool(config);
    connection = await oracledb.getConnection();
    let result = await connection.execute(sql, binds, options);
    // if (result.rows.length == 0) {
    //   return;
    // }
    return result.rows;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  } finally {
    await oracledb.getPool().close(0);
  }
}

module.exports = {
  getAllGames,
  getOneGame,
  getFeatureGames,
  getUserGames,
  addFeatureGame,
  removeFeatureGame,
  getGameSales,
  getGamesFromProvider,
  getGamesByTag,
  getGameRates,
  getGamesBySearch
};
