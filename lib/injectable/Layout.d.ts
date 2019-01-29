import { ILayout } from '../interface/ILayout';
import { IFactory } from '../interface/IFactory';
import { ISCanvas } from '../interface/ISCanvas';
export declare class Layout implements ILayout {
    private Factory;
    private Canvas;
    constructor(Factory: IFactory, Canvas: ISCanvas);
    private edge;
    draw(mat: number[][]): void;
}
