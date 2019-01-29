import { Node, Label } from 'saber-canvas';
export interface IBlock {
    node: Node;
    label: Label;
    set(num: number, x: number, y: number): this;
    create(): IBlock;
}
