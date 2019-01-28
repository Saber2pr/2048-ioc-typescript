export interface IData {
  /**
   *初始化矩阵数据
   *
   * @param {number} size 方阵边长
   * @param {number} [maxValue=2048] 数字最大值
   * @memberof Data
   */
  init(size: number, maxValue?: number): this
  /**
   *当前矩阵
   *
   * @readonly
   * @type {number[][]}
   * @memberof Data
   */
  readonly data: number[][]
  /**
   *得到updateTimes增量
   *
   * @readonly
   * @type {number}
   * @memberof Data
   */
  readonly updateValue: number
  /**
   *分数
   *
   * @readonly
   * @type {number}
   * @memberof Data
   */
  readonly score: number
  /**
   *最大值
   *
   * @readonly
   * @type {number}
   * @memberof Data
   */
  readonly MaxValue: number
  /**
   *检测数据是否变动
   *
   * @readonly
   * @type {boolean}
   * @memberof Data
   */
  readonly isChanged: boolean
  /**
   *获取updateTimes状态
   *
   * @readonly
   * @type {boolean} 数字超过maxValue则返回true
   * @memberof Data
   */
  readonly result: boolean
  /**
   * 合并方向, 返回合并偏差二维数组
   *
   * @param {('left' | 'right' | 'up' | 'down')} method
   * @param {number[][]} [arr]
   * @returns {{data: number[][] delta: number[][]}}
   * @memberof IData
   */
  merge(
    method: 'left' | 'right' | 'up' | 'down',
    arr?: number[][]
  ): {
    data: number[][]
    delta: number[][]
  }
  /**
   *检测矩阵数字是否都不为0, 若都不为0则返回true
   *
   * @readonly
   * @type {boolean}
   * @memberof Data
   */
  readonly isFull: boolean
  /**
   *检测矩阵是否存在相邻相同数字, 若存在则返回ture
   *
   * @readonly
   * @type {boolean}
   * @memberof Data
   */
  readonly hasTwice: boolean
  /**
   *随机位置添加元素
   *
   * @param {number} [times=1]
   * @returns {boolean} 返回true, 若没有空位则返回false
   * @memberof Data
   */
  addRand(times?: number): boolean
}
