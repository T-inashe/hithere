const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const hashPassword = async (password) => bcrypt.hash(password, SALT_ROUNDS);
const comparePassword = async (password, hash) => bcrypt.compare(password, hash);

module.exports = {
  hashPassword,
  comparePassword,
};