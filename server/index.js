const express = require("express");
const helmet = require("helmet");
var md5 = require("md5");
const bodyParser = require("body-parser");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const lib = require("./lib/lib");
var ip = require("ip");

const app = express();
const port = 8080;
const router = express.Router();

var WebSocketServer = require("ws").Server;
var ws = new WebSocketServer({ port: 8081 });
const clients = new Map();
/* session composed of id: int, session name, player: array of {playername, playerId}*/
var session = [];

function exist(arr, name) {
  const found = arr.find((el) => el.sessionName === name);
  if (!found) return false;
  return true;
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "0x";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function setRandomConsomable() {
  var arr = [];
  for (let i = 0; i !== 100; i = i + 1) {
    arr.push({
      id: i + 1,
      position: { y: Math.random() * 4000, x: Math.random() * 4000 },
      size: { r: 20 },
      color: getRandomColor(),
      score: 30,
    });
  }
  return arr;
}

console.log("Server started...");

ws.on("connection", function (ws) {
  console.log("Browser connected online...");
  clients.set(ws);

  ws.on("message", function (str) {
    var ob = JSON.parse(str);
    //console.log(ob);
    if (ob.type === "update_position") {
      const foundS = session.find((el) => el.id === ob.sessionId);
      const foundP = foundS.players.find((el) => el.id === ob.playerId);
      foundP.position = ob.position;
      clients.set(ws, { session: foundS, player: foundP });
      [...clients.keys()].forEach((client) => {
        client.send(JSON.stringify(clients.get(ws)));
      });
    }
    if (ob.type === "update_size") {
      const foundS = session.find((el) => el.id === ob.sessionId);
      const foundP = foundS.players.find((el) => el.id === ob.playerId);
      foundP.size = ob.size;
      clients.set(ws, { session: foundS, player: foundP });
      [...clients.keys()].forEach((client) => {
        client.send(JSON.stringify(clients.get(ws)));
      });
    }
    if (ob.type === "point_colision") {
      const foundS = session.find((el) => el.id === ob.sessionId);
      const foundPl = foundS.players.find((el) => el.id === ob.playerId);
      const foundPt = foundS.point.find((el) => el.id === ob.pointId);
      foundPl.score = foundPl.score + foundPt.score;
      foundPt.position = { y: Math.random() * 4000, x: Math.random() * 4000 };
      clients.set(ws, { session: foundS, player: foundPl });
      [...clients.keys()].forEach((client) => {
        client.send(JSON.stringify(clients.get(ws)));
      });
    }
    if (ob.type === "player_colision") {
		const foundS = session.find((el) => el.id === ob.sessionId);
		const foundPF = foundS.players.find((el) => el.id === ob.FplayerId);
		const foundPS = foundS.players.find((el) => el.id === ob.SplayerId);
		if (foundPF.score > foundPS.score) {
			foundPF.score = foundPF.score + foundPS.score;
			foundPS.status = false;
		} if (foundPF.score < foundPS.score) {
			foundPS.score = foundPF.score + foundPS.score;
			foundPF.status = false;
		}
		clients.set(ws, { session: foundS, player: foundPF });
		[...clients.keys()].forEach((client) => {
		  client.send(JSON.stringify(clients.get(ws)));
		});
    }
    //console.log(clients.get(ws));
  });

  ws.on("close", function () {
    console.log("Browser gone.");
  });
});

router.get("/", (req, res) =>
  res.json(`> API is running on port ${port} 🚀🚀`)
);

router.post("/join", async (req, res, next) => {
  let params = req.body;
  console.log(params);
  if (!params.name || !exist(session, params.name)) {
    res.response = {
      status: 403,
      message: "session not exist",
    };
    next();
  } else {
    const found = session.find((el) => el.sessionName === params.name);
    if (found.sessionPass === md5(params.pass)) {
      const tmp = {
        id: found.players.length + 1,
        name: params.pName,
        position: { y: 500, x: 500 },
        size: { r: 25 },
        status: true,
        score: 500,
        color: getRandomColor(),
      };
      found.players.push(tmp);
      //clients.set(ws, {session: found, player: tmp})
      res.response = {
        status: 200,
        session: found,
      };
      next();
    } else {
      res.response = {
        status: 403,
        message: "Not the good password",
      };
      next();
    }
  }
});

router.post("/create_session", async (req, res, next) => {
  let params = req.body;
  if (!params.name || exist(session, params.name)) {
    res.response = {
      status: 403,
      message: "session name already exist",
    };
    next();
  } else {
    const tmp = {
      id: session.length + 1,
      sessionName: params.name,
      sessionPass: md5(params.pass),
      point: setRandomConsomable(),
      players: [
        {
          id: 1,
          name: params.pName,
          position: { y: 500, x: 500 },
          size: { r: 25 },
          score: 500,
          status: true,
          color: getRandomColor(),
        },
      ],
    };
    session.push(tmp);
    //clients.set(ws, {session: tmp, player: tmp.players[0]})
    res.response = {
      status: 200,
      session: session[session.length - 1],
    };
    next();
  }
});

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(compression());

app.use((req, res, next) => {
  res.header("Access-control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
  app.options("*", (req, res) => {
    res.header(
      "Access-Control-Allow-Methods",
      "GET, PATCH, PUT, POST, DELETE, OPTIONS"
    );
    res.send();
  });
});

app.use(cookieParser());

app.use(router);

app.use(lib.response.handleResponse);

app.use(lib.errorManager.handleError);

app.listen(port, () => {
  console.log(`> API is running on port ${port} 🚀🚀`);
});
