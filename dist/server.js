"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const http_1 = require("http");
const SocketServer_1 = require("./SocketServer");
const GameController_1 = require("./GameController");
class Server {
    constructor(port) {
        this.start = () => {
            const server = this.httpInstance.listen(3000, () => {
                this.gameController.restart();
                this.socketServer.subscribeAtAllSocketEvents(this.onSocketEvent);
                console.log('listening on *:3000');
            });
            return this;
        };
        this.onSocketEvent = (data) => {
            const { socketServer, gameController } = this;
            switch (data.socketEvent) {
                case SocketServer_1.SocketEvents.Connection:
                    console.log("New connection", data.socket.id);
                    this.gameController.spawnNewPlayer(data.socket.id);
                    const players = this.gameController.Players;
                    data.socket.emit(SocketServer_1.SocketEvents.CurrentPlayers, players);
                    data.socket.emit(SocketServer_1.SocketEvents.StarLocation, gameController.StarPosition);
                    data.socket.emit(SocketServer_1.SocketEvents.ScoreUpdate, gameController.Scores);
                    data.socket.broadcast.emit(SocketServer_1.SocketEvents.NewPlayer, players[data.socket.id].Info);
                    break;
                case SocketServer_1.SocketEvents.Disconnect:
                    console.log("Player disconected", data.socket.id);
                    gameController.removePlayer(data.socket.id);
                    socketServer.ioEmit(SocketServer_1.SocketEvents.Disconnect, data.socket.id);
                    break;
                case SocketServer_1.SocketEvents.Message:
                    console.log("New message", data.data);
                    socketServer.ioEmit(SocketServer_1.SocketEvents.Message, data.data);
                    break;
                case SocketServer_1.SocketEvents.PlayerMovement:
                    const playerId = data.socket.id;
                    this.gameController.updatePlayerPosition(data.socket.id, data.data.x, data.data.y, data.data.rotation);
                    // data.socket.broadcast.emit("playerMoved", this.gameController.Players[playerId].Info);
                    this.socketServer.broadcastEmit("playerMoved", this.gameController.Players[playerId].Info);
                    break;
                case SocketServer_1.SocketEvents.StarCollected:
                    this.gameController.starCollected(data.socket.id);
                    this.socketServer.ioEmit(SocketServer_1.SocketEvents.StarLocation, this.gameController.StarPosition);
                    this.socketServer.ioEmit(SocketServer_1.SocketEvents.ScoreUpdate, this.gameController.Scores);
                    break;
                default:
                    break;
            }
        };
        this.expressInstance = express();
        this.expressInstance.set("port", port);
        this.httpInstance = new http_1.Server(this.expressInstance);
        this.expressInstance.use("/resources", express.static(path.resolve('./client/resources')));
        this.expressInstance.get('/', (req, res) => {
            res.sendFile(path.resolve('./client/index.html'));
        });
        this.socketServer = new SocketServer_1.SocketServer(this.httpInstance);
        this.gameController = new GameController_1.GameController();
    }
}
exports.Server = Server;
//# sourceMappingURL=Server.js.map