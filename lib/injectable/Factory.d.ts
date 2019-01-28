import { IFactory } from '../interface/IFactory';
import { Node, Label } from 'saber-canvas';
import { Observable } from 'saber-observable';
export declare class Factory implements IFactory {
    getNode(): Node;
    getLabel(num: number): Label;
    getNodeObservable(color: string, x: number, y: number): Observable<Node>;
    getLabelObservable(num: number, x: number, y: number): Observable<Label>;
}
