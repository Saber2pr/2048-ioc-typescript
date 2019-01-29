import { ILayout } from '../interface/ILayout';
import { IFactory } from '../interface/IFactory';
import { Canvas } from '../singletons/Canvas';
export declare class Layout implements ILayout {
    private Factory;
    private Canvas;
    constructor(Factory: IFactory, Canvas: Canvas);
    private edge;
    draw(mat: number[][]): void;
}
