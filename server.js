const express = require("express"); // importing a CommonJS module
const helmet = require("helmet");

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

//Middleware
function bouncer(req, res, next) {
  res.status(404).json("These are not the droids you are looking for");
}

function teamer(req, res, next) {
  req.team = "Web 17";
  next();
}

function noPass(req, res, next) {
  const seconds = new Date().getSeconds();
  if (seconds % 3 === 0) {
    res.status(403).json("You shall not pass!");
  }
  next();
}

server.use(teamer);
server.use(noPass);
server.use(express.json());
server.use(helmet());

//Routing
server.use("/api/hubs", hubsRouter);

//Route handlers ARE middleware
server.get("/", restricted, (req, res, next) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${req.team} to the Lambda Hubs API</p>
    `);
});

function restricted(req, res, next) {
  const password = req.headers.password;

  if (password === "melon") {
    next();
  } else {
    res.status(401).send("You shall not pass!!");
  }
}

module.exports = server;
