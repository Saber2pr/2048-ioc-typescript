import { IFactory } from '../interface/IFactory';
import { Node, Label } from 'saber-canvas';
import { Observable } from 'saber-observable';
import { IBlock } from '../interface/IBlock';
export declare class Factory implements IFactory {
    private Block;
    constructor(Block: IBlock);
    getNode(): Node;
    getLabel(num: number): Label;
    getBlock(num: number, x: number, y: number): IBlock;
    getBlockObservable(num: number, x: number, y: number): Observable<IBlock>;
}
