import { ILayout } from '../interface/ILayout'
import { IFactory } from '../interface/IFactory'
import { Injectable, Inject } from 'saber-ioc'
import { Mat_foreach } from 'saber-mat'
import { ISCanvas } from '../interface/ISCanvas'

@Injectable()
export class Layout implements ILayout {
  constructor(
    @Inject('Factory') private Factory: IFactory,
    @Inject('Canvas') private Canvas: ISCanvas
  ) {}
  private edge = {
    dx: 100,
    dy: 100
  }
  draw(mat: number[][]) {
    this.Canvas.instance.clear()
    Mat_foreach(mat, (value, raw, col) =>
      value
        ? this.Canvas.instance
            .draw(
              this.Factory.getNode().setPosition(
                col * this.edge.dx,
                raw * this.edge.dy
              )
            )
            .draw(
              this.Factory.getLabel(value).setPosition(
                col * this.edge.dx,
                raw * this.edge.dy
              )
            )
        : null
    )
  }
}
