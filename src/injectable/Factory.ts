import { IFactory } from '../interface/IFactory'
import { Injectable, Inject } from 'saber-ioc'
import { Node, Label } from 'saber-canvas'
import { Observable } from 'saber-observable'
import { IBlock } from '../interface/IBlock'

@Injectable()
export class Factory implements IFactory {
  constructor(@Inject('Block') private Block: IBlock) {}
  getNode() {
    return new Node(50, 50)
  }
  getLabel(num: number) {
    return new Label(String(num), 30)
  }
  getBlock(num: number, x: number, y: number) {
    return this.Block.create().set(num, x, y)
  }
  getBlockObservable(num: number, x: number, y: number) {
    return new Observable(this.getBlock(num, x, y))
  }
}
