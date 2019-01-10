"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketio = require("socket.io");
var SocketEvents;
(function (SocketEvents) {
    SocketEvents["Connection"] = "connection";
    SocketEvents["Disconnection"] = "disconnect";
    SocketEvents["Message"] = "message";
})(SocketEvents = exports.SocketEvents || (exports.SocketEvents = {}));
class SocketServer {
    constructor(httpServer) {
        this.socketIOInstance = socketio(httpServer);
    }
    start() {
        this.socketIOInstance.on(SocketEvents.Connection, function (socket) {
            console.log('a user connected');
            socket.on(SocketEvents.Message, function (message) {
                console.log(message);
                socket.emit(SocketEvents.Message, message);
            });
        });
    }
}
exports.SocketServer = SocketServer;
//# sourceMappingURL=socket.js.map