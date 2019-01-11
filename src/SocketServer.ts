import { Server } from "http";
import * as socketio from "socket.io";

export enum SocketEvents {
    Connection = "connection",
    Disconnect = "disconnect",
    Message = "chat-message",
    CurrentPlayers = "currentPlayers",
    StarLocation = "starLocation",
    ScoreUpdate = "scoreUpdate",
    NewPlayer = "newPlayer",
    PlayerMovement = "playerMovement",
    StarCollected = "starCollected",
}

export interface SocketListenerCallbackData {
    socketEvent: string,
    data: any,
    socket: SocketIO.Socket
}

export class SocketServer {
    private socketIOServer: socketio.Server;
    private playerSockets: { [socketId: string]: socketio.Socket };

    constructor(httpServer: Server) {
        this.socketIOServer = socketio(httpServer);
        this.playerSockets = {};
    }

    public subscribeAtAllSocketEvents(cb: (data: SocketListenerCallbackData) => void) {
        const listeners: { [key: string]: any } = {};

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
                    this.playerSockets[socket.id].on(listenerName, (data) => listeners[listenerName]({ socketEvent: listenerName, data, socket }))
                }
            }

        });
    }


    public broadcastEmit(eventName: string, data: any) {
        for (const key in this.playerSockets) {
            this.playerSockets[key].broadcast.emit(eventName, data);
        }
    }

    public ioEmit(eventName: string, data: any) {
        this.socketIOServer.emit(eventName, data);
    }

}