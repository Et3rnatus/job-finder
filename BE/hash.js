/**
 * Hash password: 123456
 * Chạy: node hash-123456.js
 */

const bcrypt = require("bcrypt");

const PASSWORD = "123456";
const SALT_ROUNDS = 10;

(async () => {
  const hash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);

  console.log("Plain password:", PASSWORD);
  console.log("Bcrypt hash:");
  console.log(hash);
})();
