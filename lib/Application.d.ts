import { ILayout } from './interface/ILayout';
import { IMatrix } from './interface/IMatrix';
import ITouchFront from './interface/ITouchFront';
export declare class Application {
    private Layout;
    private Matrix;
    private TouchFront;
    constructor(Layout: ILayout, Matrix: IMatrix, TouchFront: ITouchFront);
    main(): void;
}
