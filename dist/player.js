"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const team_1 = require("./model/team");
class Player {
    constructor(playerId) {
        this.playerId = playerId;
        this.setTeam();
        this.spawn();
    }
    spawn() {
        this.x = Math.floor(Math.random() * 700) + 50;
        this.y = Math.floor(Math.random() * 500) + 50;
    }
    setTeam() {
        this.team = (Math.floor(Math.random() * 2) === 0) ? team_1.Team.red : team_1.Team.blue;
    }
    updateMovement(x, y, rotation) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
    }
}
exports.Player = Player;
//# sourceMappingURL=player.js.map