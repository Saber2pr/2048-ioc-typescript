/*
 * @Author: AK-12
 * @Date: 2018-11-02 17:06:29
 * @Last Modified by: AK-12
 * @Last Modified time: 2019-01-28 18:44:48
 */
interface Point {
  x: number
  y: number
}
/**
 *矩阵行列互换
 *
 * @export
 * @template Type
 * @param {Type[][]} arr
 * @returns {Type[][]}
 */
export function transformArray<Type>(arr: Type[][]): Type[][] {
  let newArray: Array<Array<Type>> = new Array<Array<Type>>()
  let raws = arr.length
  for (let raw = 0; raw < raws; raw++) {
    newArray.push([])
    let cols = arr[raw].length
    for (let col = 0; col < cols; col++) {
      newArray[raw][col] = arr[col][raw]
    }
  }
  return newArray
}
/**
 *遍历二维数组元素
 *
 * @export
 * @template Type
 * @param {Type[][]} arr
 * @param {(raw: number, col: number) => void} callback
 */
export function visitArray<Type>(
  arr: Type[][],
  callback: (raw: number, col: number) => void
) {
  let raws = arr.length
  for (let raw = 0; raw < raws; raw++) {
    let cols = arr[raw].length
    for (let col = 0; col < cols; col++) {
      callback(raw, col)
    }
  }
}
/**
 *多次执行回调函数
 *
 * @export
 * @param {Function} callback
 * @param {number} [times=1] 执行次数
 */
export function moreFunc(callback: Function, times: number = 1): void {
  let count = 0
  let loop = (): void => {
    if (count >= times) {
      return
    }
    count++
    callback()
    loop()
  }
  loop()
}
/**
 *转为整型
 *
 * @export
 * @param {*} value
 * @returns
 */
export function toInt(value) {
  return parseInt(String(value))
}
/**
 *替换二维数组指定位置的值
 *
 * @export
 * @template Type
 * @param {Type[][]} arr
 * @param
 *   { raw: number
 *     col: number
 *   } pos
 * @param {*} value
 */
export function alterArray<Type>(
  arr: Type[][],
  pos: {
    /**
     *替换的元素所在行
     *
     * @type {number}
     */
    raw: number
    /**
     *替换的元素所在列
     *
     * @type {number}
     */
    col: number
    /**
     *替换后的值
     *
     * @type {*}
     */
    value: any
  }
) {
  arr[pos.raw][pos.col] = pos.value
}
/**
 *PointList得到二维坐标容器
 *
 * @export
 * @returns {Array<Point>}
 */
export function PointList(): Array<Point> {
  return new Array<Point>()
}
/**
 *得到填充数组
 *
 * @export
 * @template Type
 * @param {Type} value
 * @param {number} [length=1]
 * @returns {Type[]}
 */
export function fillArray<Type>(value: Type, length: number = 1): Type[] {
  let arr = new Array<Type>()
  for (let i = 0; i < length; i++) {
    arr.push(value)
  }
  return arr
}
/**
 *得到填充二维数组
 *
 * @export
 * @template Type
 * @param {Type} value
 * @param {{ raw: number; col: number }} size
 * @returns {Type[][]}
 */
export function fillArraySuper<Type>(
  value: Type,
  size: { raw: number; col: number }
): Type[][] {
  let arr = new Array<Array<Type>>()
  for (let raw = 0; raw < size.raw; raw++) {
    arr.push([])
    for (let col = 0; col < size.col; col++) {
      arr[raw][col] = value
    }
  }
  return arr
}
/**
 *检测一维数组是否有相邻相同数字
 *
 * @export
 * @param {number[]} arr
 * @returns {boolean} 若存在则返回ture
 */
export function hasTwice(arr: number[]): boolean {
  let len = arr.length
  let result = false
  for (let i = 0; i < len - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      result = true
      break
    }
  }
  return result
}
/**
 *检测二维数组行方向是否有相邻相同数字
 *
 * @export
 * @param {number[][]} map
 * @returns {boolean} 若存在则返回ture
 */
export function testRows(map: number[][]): boolean {
  let result: boolean = false
  for (let raw of map) {
    result = hasTwice(raw)
    if (result) {
      break
    }
  }
  return result
}
/**
 *检测二维数组是否有相邻相同数字
 *
 * @export
 * @param {number[][]} map
 * @returns {boolean} 若存在则返回ture
 */
export function hasTwiceSuper(map: number[][]): boolean {
  let resultRaw: boolean = false
  let resultCol: boolean = false
  resultRaw = testRows(map)
  let mapTurn = transformArray(map)
  resultCol = testRows(mapTurn)
  return resultRaw || resultCol
}
