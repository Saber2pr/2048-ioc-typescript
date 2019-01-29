import { Label, Node } from 'saber-canvas';
import { IBlock } from '../interface/IBlock';
export declare class Block implements IBlock {
    constructor();
    node: Node;
    label: Label;
    set(num: number, x: number, y: number): this;
    create(): Block;
}
