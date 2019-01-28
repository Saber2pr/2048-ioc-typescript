export interface ILayout {
    draw(value: {
        data: number[][];
        delta: number[][];
    }, front: 'left' | 'right' | 'up' | 'down'): any;
}
