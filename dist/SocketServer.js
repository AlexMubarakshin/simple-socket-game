"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketio = require("socket.io");
var SocketEvents;
(function (SocketEvents) {
    SocketEvents["Connection"] = "connection";
    SocketEvents["Disconnect"] = "disconnect";
    SocketEvents["Message"] = "chat-message";
    SocketEvents["CurrentPlayers"] = "currentPlayers";
    SocketEvents["StarLocation"] = "starLocation";
    SocketEvents["ScoreUpdate"] = "scoreUpdate";
    SocketEvents["NewPlayer"] = "newPlayer";
    SocketEvents["PlayerMovement"] = "playerMovement";
    SocketEvents["StarCollected"] = "starCollected";
})(SocketEvents = exports.SocketEvents || (exports.SocketEvents = {}));
class SocketServer {
    constructor(httpServer) {
        this.socketIOServer = socketio(httpServer);
        this.playerSockets = {};
    }
    subscribeAtAllSocketEvents(cb) {
        const listeners = {};
        for (let event in SocketEvents) {
            if (isNaN(Number(event))) {
                const eventName = SocketEvents[event];
                listeners[eventName] = cb;
            }
        }
        this.socketIOServer.on(SocketEvents.Connection, (socket) => {
            this.playerSockets[socket.id] = socket;
            listeners[SocketEvents.Connection]({ socketEvent: SocketEvents.Connection, socket: this.playerSockets[socket.id] });
            for (let listenerName in listeners) {
                if (listenerName !== SocketEvents.Connection) {
                    this.playerSockets[socket.id].on(listenerName, (data) => listeners[listenerName]({ socketEvent: listenerName, data, socket }));
                }
            }
        });
    }
    broadcastEmit(eventName, data) {
        for (const key in this.playerSockets) {
            this.playerSockets[key].broadcast.emit(eventName, data);
        }
    }
    ioEmit(eventName, data) {
        this.socketIOServer.emit(eventName, data);
    }
}
exports.SocketServer = SocketServer;
//# sourceMappingURL=SocketServer.js.map