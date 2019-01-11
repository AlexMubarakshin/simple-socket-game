import * as express from "express";
import * as path from "path"

import { Server as HTTPServer } from "http";
import { SocketServer, SocketEvents, SocketListenerCallbackData } from "./SocketServer";
import { GameController } from "./GameController";
import { Team } from "./model/team";


export class Server {
    private expressInstance: express.Application;
    private httpInstance: HTTPServer;
    private socketServer: SocketServer;
    private gameController: GameController;

    constructor(port: string) {
        this.expressInstance = express();
        this.expressInstance.set("port", port);

        this.httpInstance = new HTTPServer(this.expressInstance);

        this.expressInstance.use("/resources", express.static(path.resolve('./client/resources')));

        this.expressInstance.get('/', (req: any, res: any) => {
            res.sendFile(path.resolve('./client/index.html'));
        });

        this.socketServer = new SocketServer(this.httpInstance);

        this.gameController = new GameController();
    }

    public start = (): Server => {
        const server = this.httpInstance.listen(3000, () => {
            this.gameController.restart();

            this.socketServer.subscribeAtAllSocketEvents(this.onSocketEvent);

            console.log('listening on *:3000');
        });

        return this;
    }

    public onSocketEvent = (data: SocketListenerCallbackData): void => {
        const { socketServer, gameController } = this;
        switch (data.socketEvent) {
            case SocketEvents.Connection:
                console.log("New connection", data.socket.id);
                this.gameController.spawnNewPlayer(data.socket.id);

                const players = this.gameController.Players;

                data.socket.emit(SocketEvents.CurrentPlayers, players);
                data.socket.emit(SocketEvents.StarLocation, gameController.StarPosition);
                data.socket.emit(SocketEvents.ScoreUpdate, gameController.Scores);
                data.socket.broadcast.emit(SocketEvents.NewPlayer, players[data.socket.id].Info);

                break;

            case SocketEvents.Disconnect:
                console.log("Player disconected", data.socket.id);
                gameController.removePlayer(data.socket.id);
                socketServer.ioEmit(SocketEvents.Disconnect, data.socket.id);
                break;

            case SocketEvents.Message:
                console.log("New message", data.data);
                socketServer.ioEmit(SocketEvents.Message, data.data);
                break;

            case SocketEvents.PlayerMovement:
                const playerId = data.socket.id;
                this.gameController.updatePlayerPosition(data.socket.id, data.data.x, data.data.y, data.data.rotation);
                // data.socket.broadcast.emit("playerMoved", this.gameController.Players[playerId].Info);
                this.socketServer.broadcastEmit("playerMoved", this.gameController.Players[playerId].Info);
                break;

            case SocketEvents.StarCollected:
                this.gameController.starCollected(data.socket.id);
                this.socketServer.ioEmit(SocketEvents.StarLocation, this.gameController.StarPosition);
                this.socketServer.ioEmit(SocketEvents.ScoreUpdate, this.gameController.Scores);

                break;

            default:
                break;
        }
    }

}