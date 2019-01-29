import { Canvas as SaCanvas } from 'saber-canvas';
import { ICanvas } from '../interface/ISCanvas';
export declare class Canvas extends SaCanvas implements ICanvas {
    private constructor();
    static instance: Canvas;
}
