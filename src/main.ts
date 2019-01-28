import { Application } from './Application'
import { SaFactory } from 'saber-ioc'
import { Layout } from './injectable/Layout'
import { Factory } from './injectable/Factory'
import Data from './singletons/Data'
import TouchFront from './injectable/TouchFront'
import { Canvas } from './singletons/Canvas'

new SaFactory.Container(
  Layout,
  Factory,
  Application,
  Data,
  TouchFront,
  Canvas
).run()
