import { Label, Node } from 'saber-canvas'
import { Injectable } from 'saber-ioc'
import { IBlock } from '../interface/IBlock'

@Injectable()
export class Block implements IBlock {
  constructor() {
    this.node = new Node(0, 0)
    this.label = new Label('2', 30)
  }
  public node: Node
  public label: Label
  set(num: number, x: number, y: number) {
    this.label.setText(String(num)).setPosition(x, y)
    this.node.setPosition(x, y)
    return this
  }
  create() {
    return new Block()
  }
}
