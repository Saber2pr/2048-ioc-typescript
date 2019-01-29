import { Injectable, Singleton } from 'saber-ioc'
import { MatFill, MatSet, Mat_foreach, MatTransform } from 'saber-mat'
import { call } from 'saber-interval'
import { IMatrix } from '../interface/ISMatrix'

@Singleton
@Injectable()
export class Matrix implements IMatrix {
  private constructor() {}
  static instance: Matrix
  static getInstance(): Matrix {
    this.instance = this.instance || new Matrix()
    return this.instance
  }
  private mat: number[][]
  private hasNext: boolean
  public init(size: number): this {
    this.mat = MatFill(0, size)
    return this
  }
  public merge(method: 'left' | 'right' | 'up' | 'down') {
    switch (method) {
      case 'left':
        this.mat = this.mat.map(raw => this.mergeLeft(raw))
        break
      case 'right':
        this.mat = this.mat.map(raw => this.mergeRight(raw))
        break
      case 'up':
        this.mat = MatTransform(
          MatTransform(this.mat).map(raw => this.mergeLeft(raw))
        )
        break
      case 'down':
        this.mat = MatTransform(
          MatTransform(this.mat).map(raw => this.mergeRight(raw))
        )
        break
    }
    return this.mat
  }
  public addRand(times: number = 1): boolean {
    let points: { x: number; y: number }[] = []
    call(() => {
      Mat_foreach(this.mat, (value, raw, col) => {
        if (value === 0) {
          points.push({ x: raw, y: col })
          this.hasNext = true
        }
      })
      if (this.hasNext) {
        let index = parseInt(String(Math.random() * points.length))
        MatSet(this.mat, 2, {
          raw: points[index].x,
          col: points[index].y
        })
      }
    }, times)
    return this.hasNext
  }
  private mergeLeft = (arr: number[]) => {
    let i, nextI, m
    let len = arr.length
    for (i = 0; i < len; i++) {
      nextI = -1
      for (m = i + 1; m < len; m++) {
        if (arr[m] !== 0) {
          nextI = m
          break
        }
      }
      if (nextI !== -1) {
        if (arr[i] === 0) {
          arr[i] = arr[nextI]
          arr[nextI] = 0
          i -= 1
        } else if (arr[i] === arr[nextI]) {
          arr[i] = arr[i] * 2
          arr[nextI] = 0
        }
      }
    }
    return arr
  }
  private mergeRight = (arr: number[]) => {
    return this.mergeLeft([...arr].reverse()).reverse()
  }
}
