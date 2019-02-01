import { ILayout } from './interface/ILayout'
import { Bootstrap, Inject } from 'saber-ioc'
import { ISMatrix } from './interface/ISMatrix'
import { TouchFront } from 'saber-dom'

@Bootstrap
export class Application {
  constructor(
    @Inject('Layout') private Layout: ILayout,
    @Inject('Matrix') private Matrix: ISMatrix,
    @Inject('TouchFront') private TouchFront: TouchFront
  ) {}
  main() {
    this.Matrix.getInstance()
      .init(4)
      .addRand(2)
    this.Layout.draw(this.Matrix.getInstance().merge('left'))
    this.TouchFront.onLeft(() =>
      this.Layout.draw(this.Matrix.getInstance().merge('left'))
    )
      .onRight(() => this.Layout.draw(this.Matrix.getInstance().merge('right')))
      .onUp(() => this.Layout.draw(this.Matrix.getInstance().merge('up')))
      .onDown(() => this.Layout.draw(this.Matrix.getInstance().merge('down')))
      .onStop(() => this.Matrix.getInstance().addRand(2))
      .listen(document.body)
  }
}
