"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("./model/Player");
const Star_1 = require("./model/Star");
const team_1 = require("./model/team");
class GameController {
    constructor() {
        this.players = {};
        this.star = new Star_1.Star();
    }
    restart() {
        this.star.spawnAtRandomPos();
        this.scores = {
            blue: 0,
            red: 0,
        };
    }
    spawnNewPlayer(playerID) {
        this.players[playerID] = new Player_1.Player(playerID);
        return this.players[playerID];
    }
    removePlayer(playerID) {
        delete this.players[playerID];
    }
    starCollected(playerID) {
        if (this.players[playerID].Team === team_1.Team.red) {
            this.scores.red += 10;
        }
        else {
            this.scores.blue += 10;
        }
        this.star.spawnAtRandomPos();
    }
    updatePlayerPosition(playerID, x, y, rotation) {
        if (this.players[playerID]) {
            this.players[playerID].updateMovement(x, y, rotation);
        }
    }
    get StarPosition() {
        return this.star.Position;
    }
    get Scores() {
        return this.scores;
    }
    get Players() {
        return this.players;
    }
}
exports.GameController = GameController;
//# sourceMappingURL=GameController.js.map