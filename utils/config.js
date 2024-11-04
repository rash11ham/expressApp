require("dotenv").config();

const PORT = process.env.PORT;

//previous exercises
//const MONGODB_URI = process.env.MONGODB_URI;

//Part 4 testing backend note
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
};
