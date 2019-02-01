import { Application } from './Application'
import { SaIOC, Injectable } from 'saber-ioc'
import { Layout } from './injectable/Layout'
import { Factory } from './injectable/Factory'
import { Matrix } from './singletons/Matrix'
import { TouchFront } from 'saber-dom'
import { Canvas } from './singletons/Canvas'
import { Block } from './injectable/Block'

Injectable()(TouchFront)

new SaIOC.Container(
  Layout,
  Factory,
  Application,
  Matrix,
  TouchFront,
  Canvas,
  Block
).run()
