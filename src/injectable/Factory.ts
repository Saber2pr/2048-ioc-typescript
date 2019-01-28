import { IFactory } from '../interface/IFactory'
import { Injectable } from 'saber-ioc'
import { Node, Label } from 'saber-canvas'
import { Observable } from 'saber-observable'

@Injectable()
export class Factory implements IFactory {
  getNode() {
    return new Node(50, 50)
  }
  getLabel(num: number) {
    return new Label(String(num), 30)
  }
  getNodeObservable(color: string, x: number, y: number) {
    return new Observable(
      this.getNode()
        .setColor(color)
        .setPosition(x, y)
    )
  }
  getLabelObservable(num: number, x: number, y: number) {
    return new Observable(this.getLabel(num).setPosition(x, y))
  }
}
