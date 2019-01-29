import { ILayout } from '../interface/ILayout'
import { IFactory } from '../interface/IFactory'
import { Injectable, Inject } from 'saber-ioc'
import { Canvas } from '../singletons/Canvas'
import { Mat_foreach } from 'saber-mat'

@Injectable()
export class Layout implements ILayout {
  constructor(
    @Inject('Factory') private Factory: IFactory,
    @Inject('Canvas') private Canvas: Canvas
  ) {}
  private edge = {
    dx: 100,
    dy: 100
  }
  draw(mat: number[][]) {
    this.Canvas.clear()
    Mat_foreach(mat, (value, raw, col) =>
      value
        ? this.Canvas.draw(
            this.Factory.getNode().setPosition(
              col * this.edge.dx,
              raw * this.edge.dy
            )
          ).draw(
            this.Factory.getLabel(value).setPosition(
              col * this.edge.dx,
              raw * this.edge.dy
            )
          )
        : null
    )
  }
}
