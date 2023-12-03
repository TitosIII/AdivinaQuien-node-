import express from "express";
import bodyParser from "body-parser";
import http from "http";
import { socketGame } from "./game.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile("index.html");
})

const server = http.Server(app);
socketGame(server);

server.listen(PORT,() => {
    console.log(`Escuchando en el puerto ${PORT}.`);
})