import { Observable } from 'saber-observable';
import { Node, Label } from 'saber-canvas';
export interface IFactory {
    getNode(): Node;
    getNodeObservable(color: string, x: number, y: number): Observable<Node>;
    getLabelObservable(num: number, x: number, y: number): Observable<Label>;
}
