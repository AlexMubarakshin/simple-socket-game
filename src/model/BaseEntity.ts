export abstract class BaseEntity {
    protected x: number;
    protected y: number;

    public get Position() {
        return { x: this.x, y: this.y }
    }
}