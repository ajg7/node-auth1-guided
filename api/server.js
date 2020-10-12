const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");


const usersRouter = require("../users/users-router.js");
const authRouter = require("../auth/auth-router.js");
const protected = require("../auth/protected-mw");

const server = express();

const sessionConfiguration = {
    name: "monster", //defaults to sid for the cookie name
    secret: process.env.SESSION_SECRET || "keep it secret, keep it safe!",
    cookie: {
      httpOnly: true, //true means JS can't access the cookie data
      maxAge: 1000 * 60 * 10, // expires after 10 mins
      secure: process.env.SECURE_COOKIES || false, // true means send cookies over https only
    },
    resave: false, // re-save the session information even if there are no changes
    saveUninitialized: true, // read about GDPR compliance
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.listen(session(sessionConfiguration))

server.use("/api/auth", authRouter);
server.use("/api/users", protected, usersRouter);

server.get("/", (req, res) => {
  res.json({ api: "up", session: req.session });
});

module.exports = server;
