import { Application } from './Application'
import { SaIOC } from 'saber-ioc'
import { Layout } from './injectable/Layout'
import { Factory } from './injectable/Factory'
import { Matrix } from './singletons/Matrix'
import { TouchFront } from './injectable/TouchFront'
import { Canvas } from './singletons/Canvas'
import { Block } from './injectable/Block'

new SaIOC.Container(
  Layout,
  Factory,
  Application,
  Matrix,
  TouchFront,
  Canvas,
  Block
).run()
