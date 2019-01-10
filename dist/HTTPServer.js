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
        this.onSocketEvent = (event, data) => {
            console.log("Event", event, data);
            switch (event) {
                case SocketServer_1.SocketEvents.Connection:
                    console.log("New connection", data.id);
                    this.gameController.spawnNewPlayer(data.id);
                    break;
                case SocketServer_1.SocketEvents.Disconnection:
                    break;
                case SocketServer_1.SocketEvents.Message:
                    console.log("New message", data);
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
//# sourceMappingURL=HTTPServer.js.map