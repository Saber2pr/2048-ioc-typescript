import { ILayout } from './interface/ILayout'
import { Bootstrap, Inject } from 'saber-ioc'
import { IMatrix } from './interface/IMatrix'
import ITouchFront from './interface/ITouchFront'

@Bootstrap
export class Application {
  constructor(
    @Inject('Layout') private Layout: ILayout,
    @Inject('Matrix') private Matrix: IMatrix,
    @Inject('TouchFront') private TouchFront: ITouchFront
  ) {}
  main() {
    this.Matrix.init(4).addRand(2)
    this.Layout.draw(this.Matrix.merge('left'))
    this.TouchFront.subscribe(
      () => this.Layout.draw(this.Matrix.merge('left')),
      () => this.Layout.draw(this.Matrix.merge('right')),
      () => this.Layout.draw(this.Matrix.merge('up')),
      () => this.Layout.draw(this.Matrix.merge('down'))
    )
      .onStop(() => this.Matrix.addRand(2))
      .listen()
  }
}
