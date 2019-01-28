interface Point {
    x: number;
    y: number;
}
/**
 *矩阵行列互换
 *
 * @export
 * @template Type
 * @param {Type[][]} arr
 * @returns {Type[][]}
 */
export declare function transformArray<Type>(arr: Type[][]): Type[][];
/**
 *遍历二维数组元素
 *
 * @export
 * @template Type
 * @param {Type[][]} arr
 * @param {(raw: number, col: number) => void} callback
 */
export declare function visitArray<Type>(arr: Type[][], callback: (raw: number, col: number) => void): void;
/**
 *多次执行回调函数
 *
 * @export
 * @param {Function} callback
 * @param {number} [times=1] 执行次数
 */
export declare function moreFunc(callback: Function, times?: number): void;
/**
 *转为整型
 *
 * @export
 * @param {*} value
 * @returns
 */
export declare function toInt(value: any): number;
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
export declare function alterArray<Type>(arr: Type[][], pos: {
    /**
     *替换的元素所在行
     *
     * @type {number}
     */
    raw: number;
    /**
     *替换的元素所在列
     *
     * @type {number}
     */
    col: number;
    /**
     *替换后的值
     *
     * @type {*}
     */
    value: any;
}): void;
/**
 *PointList得到二维坐标容器
 *
 * @export
 * @returns {Array<Point>}
 */
export declare function PointList(): Array<Point>;
/**
 *得到填充数组
 *
 * @export
 * @template Type
 * @param {Type} value
 * @param {number} [length=1]
 * @returns {Type[]}
 */
export declare function fillArray<Type>(value: Type, length?: number): Type[];
/**
 *得到填充二维数组
 *
 * @export
 * @template Type
 * @param {Type} value
 * @param {{ raw: number; col: number }} size
 * @returns {Type[][]}
 */
export declare function fillArraySuper<Type>(value: Type, size: {
    raw: number;
    col: number;
}): Type[][];
/**
 *检测一维数组是否有相邻相同数字
 *
 * @export
 * @param {number[]} arr
 * @returns {boolean} 若存在则返回ture
 */
export declare function hasTwice(arr: number[]): boolean;
/**
 *检测二维数组行方向是否有相邻相同数字
 *
 * @export
 * @param {number[][]} map
 * @returns {boolean} 若存在则返回ture
 */
export declare function testRows(map: number[][]): boolean;
/**
 *检测二维数组是否有相邻相同数字
 *
 * @export
 * @param {number[][]} map
 * @returns {boolean} 若存在则返回ture
 */
export declare function hasTwiceSuper(map: number[][]): boolean;
export {};
