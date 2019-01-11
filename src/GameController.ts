import { Player } from "./model/Player";
import { Star } from "./model/Star";
import { Team } from "./model/team";

export class GameController {

    private players: { [key: string]: Player };
    private star: Star;
    private scores: { red: number, blue: number }

    constructor() {
        this.players = {};

        this.star = new Star();
    }

    public restart() {
        this.star.spawnAtRandomPos();
        this.scores = {
            blue: 0,
            red: 0,
        };
    }

    public spawnNewPlayer(playerID: string): Player {
        this.players[playerID] = new Player(playerID);

        return this.players[playerID];
    }

    public removePlayer(playerID: string) {
        delete this.players[playerID];
    }

    public starCollected(playerID: string) {
        if (this.players[playerID].Team === Team.red) {
            this.scores.red += 10;
        } else {
            this.scores.blue += 10;
        }

        this.star.spawnAtRandomPos();
    }

    public updatePlayerPosition(playerID: string, x: number, y: number, rotation: number) {
        if (this.players[playerID]) {

            this.players[playerID].updateMovement(x, y, rotation);
        }
    }

    public get StarPosition() {
        return this.star.Position;
    }

    public get Scores() {
        return this.scores;
    }

    public get Players() {
        return this.players;
    }
}