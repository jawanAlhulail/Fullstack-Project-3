const crypto = require("crypto");

const hashPassword = (password, salt = "secret") => {
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
};

module.exports = hashPassword;
