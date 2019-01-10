"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEntity_1 = require("./BaseEntity");
class Star extends BaseEntity_1.BaseEntity {
    constructor() {
        super();
    }
    spawnAtRandomPos() {
        this.x = Math.floor(Math.random() * 700) + 50;
        this.y = Math.floor(Math.random() * 500) + 50;
    }
}
exports.Star = Star;
//# sourceMappingURL=Star.js.map