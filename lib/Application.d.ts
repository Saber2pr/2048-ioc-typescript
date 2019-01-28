import { ILayout } from './interface/ILayout';
import { IData } from './interface/IData';
import ITouchFront from './interface/ITouchFront';
export declare class Application {
    private Layout;
    private Data;
    private TouchFront;
    constructor(Layout: ILayout, Data: IData, TouchFront: ITouchFront);
    main(): void;
}
