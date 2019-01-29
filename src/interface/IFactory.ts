import { Observable } from 'saber-observable'
import { Node, Label } from 'saber-canvas'
import { IBlock } from './IBlock'

export interface IFactory {
  getNode(): Node
  getLabel(num: number): Label
  getBlock(num: number, x: number, y: number): IBlock
  getBlockObservable(num: number, x: number, y: number): Observable<IBlock>
}
