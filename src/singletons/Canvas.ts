import { Canvas as SaCanvas } from 'saber-canvas'
import { Injectable, Singleton } from 'saber-ioc'

@Singleton
@Injectable()
export class Canvas extends SaCanvas {
  private constructor() {
    super('canvas', 400, 400)
  }
  static instance = new Canvas()
}
