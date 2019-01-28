import { ILayout } from './interface/ILayout'
import { Bootstrap, Inject } from 'saber-ioc'
import { IData } from './interface/IData'
import ITouchFront from './interface/ITouchFront'

@Bootstrap
export class Application {
  constructor(
    @Inject('Layout') private Layout: ILayout,
    @Inject('Data') private Data: IData,
    @Inject('TouchFront') private TouchFront: ITouchFront
  ) {}
  main() {
    this.Data.init(4, 2048).addRand(2)
    this.Layout.draw(this.Data.merge('left'), 'left')
    this.TouchFront.subscribe(
      () => this.Layout.draw(this.Data.merge('left'), 'left'),
      () => this.Layout.draw(this.Data.merge('right'), 'right'),
      () => this.Layout.draw(this.Data.merge('up'), 'up'),
      () => this.Layout.draw(this.Data.merge('down'), 'down')
    )
      .onStop(() => this.Data.addRand(2))
      .listen()
  }
}
