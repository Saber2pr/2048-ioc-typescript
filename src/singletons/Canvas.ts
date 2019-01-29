import { Canvas as SaCanvas } from 'saber-canvas'
import { Injectable, Singleton } from 'saber-ioc'
import { ICanvas } from '../interface/ISCanvas'

@Singleton
@Injectable()
export class Canvas extends SaCanvas implements ICanvas {
  private constructor() {
    super('canvas', 400, 400)
  }
  static instance = new Canvas()
}
