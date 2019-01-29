import { ILayout } from './interface/ILayout'
import { Bootstrap, Inject } from 'saber-ioc'
import { ISMatrix } from './interface/ISMatrix'
import { ITouchFront } from './interface/ITouchFront'

@Bootstrap
export class Application {
  constructor(
    @Inject('Layout') private Layout: ILayout,
    @Inject('Matrix') private Matrix: ISMatrix,
    @Inject('TouchFront') private TouchFront: ITouchFront
  ) {}
  main() {
    this.Matrix.getInstance()
      .init(4)
      .addRand(2)
    this.Layout.draw(this.Matrix.getInstance().merge('left'))
    this.TouchFront.subscribe(
      () => this.Layout.draw(this.Matrix.getInstance().merge('left')),
      () => this.Layout.draw(this.Matrix.getInstance().merge('right')),
      () => this.Layout.draw(this.Matrix.getInstance().merge('up')),
      () => this.Layout.draw(this.Matrix.getInstance().merge('down'))
    )
      .onStop(() => this.Matrix.getInstance().addRand(2))
      .listen()
  }
}
