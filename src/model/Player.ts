import { Team } from "./team";
import { BaseEntity } from "./BaseEntity";

export class Player extends BaseEntity {
    private rotation: number;
    private playerId: string;
    private team: Team;

    constructor(playerId: string) {
        super();

        this.playerId = playerId;

        this.setTeam();
        this.spawn();
    }

    private spawn(): void {
        this.x = Math.floor(Math.random() * 700) + 50;
        this.y = Math.floor(Math.random() * 500) + 50;
    }

    private setTeam(): void {
        this.team = (Math.floor(Math.random() * 2) === 0) ? Team.red : Team.blue;
    }

    public updateMovement(x: number, y: number, rotation: number) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
    }

    public get Team() {
        return this.team;
    }

    public get Position() {
        return { x: this.x, y: this.y, rotation: this.rotation };
    }

    public get Info() {
        return {
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            team: this.team,
            playerId: this.playerId
        }
    }
}