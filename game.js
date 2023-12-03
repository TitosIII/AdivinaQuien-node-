import { Server } from "socket.io";

export const socketGame = (server) => {
  const io = new Server(server);
  let guessingCharacter;

  io.on("connection", (socket) => {
    console.log(`${socket.id} se ha conectado.`);

    socket.broadcast.emit("playerConnected");

    socket.on("disconnect", () => {
      console.log(`${socket.id} se ha desconectado.`);
    });

    socket.on("rivalData", (data) => {
        socket.broadcast.emit("rivalData", data);
    })

    socket.on("setName", (name) => {
        socket.broadcast.emit("setName", name);
    });

    socket.on("setCharacter", () => {
        socket.broadcast.emit("setCharacter");
    });

    socket.on("request", (q) => {
        socket.broadcast.emit("request", q);
    });

    socket.on("response", (q) => {
        socket.broadcast.emit("response", q);
    });

    socket.on("true", (q) => {
        socket.broadcast.emit("true", q);
    });

    socket.on("false", (q) => {
        socket.broadcast.emit("false", q);
    });

    socket.on("other", (q) => {
        socket.broadcast.emit("other", q);
    });

    socket.on("guessing", () => {
        socket.broadcast.emit("guessing");
    })

    socket.on("reqGuess", (name) => {
        guessingCharacter = name.toLowerCase();
        socket.broadcast.emit("reqCharacter");
    });

    socket.on("guessWho", (name) => {
        const trueCharacter = name.toLowerCase();
        if(guessingCharacter == trueCharacter){
            io.emit("gameOver");
            socket.broadcast.emit("Victory", trueCharacter);
        }else{
            io.emit("FailedGuess", guessingCharacter);
            guessingCharacter = "";
        }
    });

  });
};
