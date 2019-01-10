"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const team_1 = require("./team");
const BaseEntity_1 = require("./BaseEntity");
class Player extends BaseEntity_1.BaseEntity {
    constructor(playerId) {
        super();
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
    get Team() {
        return this.team;
    }
    get Position() {
        return { x: this.x, y: this.y, rotation: this.rotation };
    }
    get Info() {
        return {
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            team: this.team,
            playerId: this.playerId
        };
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map