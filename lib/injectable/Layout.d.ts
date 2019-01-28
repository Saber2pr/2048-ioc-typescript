import { ILayout } from '../interface/ILayout';
import { IFactory } from '../interface/IFactory';
import { Node } from 'saber-canvas';
import { Canvas } from '../singletons/Canvas';
import { Observable } from 'saber-observable';
declare type Front = 'left' | 'right' | 'up' | 'down';
export declare class Layout implements ILayout {
    private Factory;
    private Canvas;
    constructor(Factory: IFactory, Canvas: Canvas);
    private edge;
    /**
     * @param {number} from
     * @param {number} to
     * @param {{obsNode: Observable<Node> obsLabel: Observable<Label>}} block
     * @memberof Layout
     */
    action<T extends Node>(front: Front, delta: number, block: Observable<T>, onStop: () => void): void;
    /**
     * @param {{ data: number[][]; delta: number[][] }} value
     * @param {Front} front
     * @memberof Layout
     */
    draw(value: {
        data: number[][];
        delta: number[][];
    }, front: Front): void;
    frame(value: {
        data: number[][];
        delta: number[][];
    }): void;
}
export {};
