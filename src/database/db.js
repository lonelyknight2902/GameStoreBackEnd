const oracledb = require("oracledb");
const config = require("./config");

let pool = oracledb.createPool(config);

module.exports = pool;