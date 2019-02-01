import { ILayout } from './interface/ILayout';
import { ISMatrix } from './interface/ISMatrix';
import { TouchFront } from 'saber-dom';
export declare class Application {
    private Layout;
    private Matrix;
    private TouchFront;
    constructor(Layout: ILayout, Matrix: ISMatrix, TouchFront: TouchFront);
    main(): void;
}
