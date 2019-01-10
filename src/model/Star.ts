import { BaseEntity } from "./BaseEntity";

export class Star extends BaseEntity {
    constructor() {
        super();
    }

    public spawnAtRandomPos() {
        this.x = Math.floor(Math.random() * 700) + 50;
        this.y = Math.floor(Math.random() * 500) + 50;
    }
}