import { ILayout } from './interface/ILayout';
import { ISMatrix } from './interface/ISMatrix';
import { ITouchFront } from './interface/ITouchFront';
export declare class Application {
    private Layout;
    private Matrix;
    private TouchFront;
    constructor(Layout: ILayout, Matrix: ISMatrix, TouchFront: ITouchFront);
    main(): void;
}
