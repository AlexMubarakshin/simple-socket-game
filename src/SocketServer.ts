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
    private socket: socketio.Socket;

    constructor(httpServer: Server) {
        this.socketIOServer = socketio(httpServer);
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
            this.socket = socket;

            listeners[SocketEvents.Connection]({socketEvent: SocketEvents.Connection, socket: this.socket});

            for (let listenerName in listeners) {
                if (listenerName !== SocketEvents.Connection) {
                    this.socket.on(listenerName, (data) => listeners[listenerName]({ socketEvent: listenerName, data, socket }))
                }
            }

        });
    }

    public socketEmit(eventName: string, data: any) {
        this.socket.emit(eventName, data);
    }

    public broadcastEmit(eventName: string, data: any) {
        this.socket.broadcast.emit(eventName, data);
    }

    public ioEmit(eventName: string, data: any) {
        this.socketIOServer.emit(eventName, data);
    }

}