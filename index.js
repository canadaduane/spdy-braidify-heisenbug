const spdy = require("spdy");
const express = require("express");
const cors = require("cors");
const braidify = require("braidify").http_server;
const join = require("path").join;
const fs = require("fs");

const port = 3000;
const key = join(__dirname, "localhost.key");
const cert = join(__dirname, "localhost.cert");

const app = express()
  .use(cors({ origin: true }))
  .use(braidify);

const subscriptions = [];

let version = 1;

function send(response, json, statusCode = 200) {
  response.statusCode = statusCode;
  response.setHeader("content-type", "application/json");
  response.end(JSON.stringify(json, null, 2));
}

app.get("/", (request, response) => {
  if (request.subscribe) {
    response.startSubscription();
    response.sendVersion({
      version,
      body: "[]",
    });
    subscriptions.push(response);
  } else {
    send(response, "[]");
  }
});

app.put("/", async (request, response) => {
  await request.patches();

  version++;

  // Increment version & send an update to any subscribers
  for (const res of subscriptions) {
    res.sendVersion({
      "content-type": "application/json",
      version,
      body: "[]",
    });
  }

  // Acknowledge post(s) appended
  send(response, { success: true });
});

const server = spdy.createServer(
  {
    spdy: {
      protocols: ["h2"],
      // plain: true,
      // ssl: false,
    },
    key: fs.readFileSync(key),
    cert: fs.readFileSync(cert),
  },
  app
);

server.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`HTTP 2.0 server is listening on ${port} with TLS`);
  }
});
