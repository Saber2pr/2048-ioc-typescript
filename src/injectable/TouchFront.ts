import { ITouchFront } from '../interface/ITouchFront'
import { Injectable } from 'saber-ioc'
interface Point {
  x: number
  y: number
}

@Injectable()
export class TouchFront implements ITouchFront {
  private _lock: number

  private callbackLeft: Function
  private callbackRight: Function
  private callbackUp: Function
  private callbackDown: Function
  private callbackStart: Function
  private callbackUpdate: Function
  private callbackStop: Function

  constructor(private offset = 100, private delta = 200) {
    this._lock = 0
  }

  public subscribe(
    callbackLeft?: Function,
    callbackRight?: Function,
    callbackUp?: Function,
    callbackDown?: Function
  ): this {
    this.callbackLeft = callbackLeft
    this.callbackRight = callbackRight
    this.callbackUp = callbackUp
    this.callbackDown = callbackDown
    return this
  }

  public onStart(callback: Function) {
    this.callbackStart = callback
    return this
  }

  public onUpdate(callback: Function) {
    this.callbackUpdate = callback
    return this
  }

  public onStop(callback: Function) {
    this.callbackStop = callback
    return this
  }

  public listen() {
    let originPos: Point
    document.addEventListener('mousedown', event => {
      originPos = event
      !!this.callbackStart ? this.callbackStart() : null
    })
    document.addEventListener('mousemove', () => {
      this._lock++
      if (originPos) {
        !!this.callbackUpdate ? this.callbackUpdate() : null
      }
    })
    document.addEventListener('mouseup', event => {
      this._lock < this.delta ? this.testPos(originPos, event) : null
      this._lock = 0
      !!this.callbackStop ? this.callbackStop() : null
      originPos = null
    })
  }

  private testPos(originPos: Point, touchPos: Point): void {
    if (
      Math.abs(touchPos.x - originPos.x) < this.offset &&
      Math.abs(touchPos.y - originPos.y) < this.offset
    ) {
      return
    }
    if (
      Math.abs(touchPos.x - originPos.x) > Math.abs(touchPos.y - originPos.y)
    ) {
      if (touchPos.x - originPos.x > this.offset) {
        !!this.callbackRight ? this.callbackRight() : null
      } else if (touchPos.x - originPos.x < -this.offset) {
        !!this.callbackLeft ? this.callbackLeft() : null
      }
    } else {
      if (touchPos.y - originPos.y > this.offset) {
        !!this.callbackDown ? this.callbackDown() : null
      } else if (touchPos.y - originPos.y < -this.offset) {
        !!this.callbackUp ? this.callbackUp() : null
      }
    }
  }
}
