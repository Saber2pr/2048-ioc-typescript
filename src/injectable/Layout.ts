import { ILayout } from '../interface/ILayout'
import { IFactory } from '../interface/IFactory'
import { Injectable, Inject } from 'saber-ioc'
import { Node } from 'saber-canvas'
import { tween } from 'popmotion'
import { visitArray } from '../utils/MathVec'
import { Canvas } from '../singletons/Canvas'
import { Observable } from 'saber-observable'

type Front = 'left' | 'right' | 'up' | 'down'

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
  /**
   * @param {number} from
   * @param {number} to
   * @param {{obsNode: Observable<Node> obsLabel: Observable<Label>}} block
   * @memberof Layout
   */
  action<T extends Node>(
    front: Front,
    delta: number,
    block: Observable<T>,
    onStop: () => void
  ) {
    let props = {} as {
      from: number
      to: number
      duration: number
    }
    props.duration = 500
    const origin = block.pull()
    switch (front) {
      case 'left':
        props.from = origin.x
        props.to = origin.x - delta
        break
      case 'right':
        props.from = origin.x
        props.to = origin.x + delta
        break
      case 'up':
        props.from = origin.y
        props.to = origin.y + delta
        break
      case 'down':
        props.from = origin.y
        props.to = origin.y - delta
        break
    }
    console.log(props)
    if (front === 'left' || front === 'right') {
      tween(props).start(v => {
        this.Canvas.clear(origin)
        block.pipe(n => n.setPosition(v, n.y))
      }).stop = onStop
    } else {
      tween(props).start(v => {
        this.Canvas.clear(origin)
        block.pipe(n => n.setPosition(n.y, v))
      }).stop = onStop
    }
  }
  /**
   * @param {{ data: number[][]; delta: number[][] }} value
   * @param {Front} front
   * @memberof Layout
   */
  draw(value: { data: number[][]; delta: number[][] }, front: Front) {
    this.Canvas.clear()
    this.frame(value)
    //  visitArray(value.data, (raw, col)=> {
    //   const delta = value.delta[raw][col] * 100
    //   switch (front) {
    //     case 'left':
    //       this.action('left', delta, obsNode, this.frame)
    //       this.action('left', delta, obsLabel, this.frame)
    //       break
    //     case 'right':
    //       this.action('right', delta, obsNode, this.frame)
    //       this.action('right', delta, obsLabel, this.frame)
    //       break
    //     case 'up':
    //       this.action('up', delta, obsNode, this.frame)
    //       this.action('up', delta, obsLabel, this.frame)
    //       break
    //     case 'down':
    //       this.action('down', delta, obsNode, this.frame)
    //       this.action('down', delta, obsLabel, this.frame)
    //       break
    //   }
    //  })
  }
  frame(value: { data: number[][]; delta: number[][] }) {
    this.Canvas.clear()
    visitArray(value.data, (raw, col) => {
      if (value.data[raw][col] === 0) {
        return
      }
      const obsNode = this.Factory.getNodeObservable(
        'blue',
        col * this.edge.dx,
        raw * this.edge.dy
      )
      obsNode.subscribe(n => this.Canvas.draw(n))
      this.Canvas.draw(obsNode.pull())

      const obsLabel = this.Factory.getLabelObservable(
        value.data[raw][col],
        col * this.edge.dx,
        raw * this.edge.dy
      )
      obsLabel.subscribe(l => this.Canvas.draw(l))
      this.Canvas.draw(obsLabel.pull())
    })
  }
}
