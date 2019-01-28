/*
 * @Author: AK-12
 * @Date: 2019-01-28 19:27:28
 * @Last Modified by: AK-12
 * @Last Modified time: 2019-01-28 19:45:52
 */
import ITouchFront from '../interface/ITouchFront'
import { Injectable } from 'saber-ioc'
interface Point {
  x: number
  y: number
}
/**
 *触摸方向执行对应回调
 *
 * 接口类
 * @export
 * @class TouchFront
 * @implements {ITouchFront}
 */
@Injectable()
export default class TouchFront implements ITouchFront {
  private offset: number
  private delta: number
  private _lock: number

  private callbackLeft: Function
  private callbackRight: Function
  private callbackUp: Function
  private callbackDown: Function
  private callbackStart: Function
  private callbackUpdate: Function
  private callbackStop: Function

  /**
   *Creates an instance of TouchFront.
   * @param {number} [offset=100] 触摸偏移 ? 100
   * @param {number} [delta=200] 灵敏度 ? 200
   * @memberof TouchFront
   */
  constructor(offset: number = 100, delta: number = 200) {
    this.offset = offset
    this._lock = 0
    this.delta = delta
  }
  /**
   * subscribe
   *
   * @param {Function} [callbackLeft]
   * @param {Function} [callbackRight]
   * @param {Function} [callbackUp]
   * @param {Function} [callbackDown]
   * @returns {TouchFront}
   * @memberof TouchFront
   */
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
  /**
   * onStart
   * @param {Function} callback
   * @memberof TouchFront
   */
  public onStart(callback: Function) {
    this.callbackStart = callback
    return this
  }
  /**
   * onUpdate
   *
   * @param {Function} callback
   * @memberof TouchFront
   */
  public onUpdate(callback: Function) {
    this.callbackUpdate = callback
    return this
  }
  /**
   * onStop
   *
   * @param {Function} callback
   * @memberof TouchFront
   */
  public onStop(callback: Function) {
    this.callbackStop = callback
    return this
  }
  /**
   *监听触摸
   *
   * @memberof TouchFront
   */
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
  /**
   *检测偏移执行回调
   *
   * @private
   * @memberof TouchFront
   */
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
