"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *矩阵行列互换
 *
 * @export
 * @template Type
 * @param {Type[][]} arr
 * @returns {Type[][]}
 */
function transformArray(arr) {
    var newArray = new Array();
    var raws = arr.length;
    for (var raw = 0; raw < raws; raw++) {
        newArray.push([]);
        var cols = arr[raw].length;
        for (var col = 0; col < cols; col++) {
            newArray[raw][col] = arr[col][raw];
        }
    }
    return newArray;
}
exports.transformArray = transformArray;
/**
 *遍历二维数组元素
 *
 * @export
 * @template Type
 * @param {Type[][]} arr
 * @param {(raw: number, col: number) => void} callback
 */
function visitArray(arr, callback) {
    var raws = arr.length;
    for (var raw = 0; raw < raws; raw++) {
        var cols = arr[raw].length;
        for (var col = 0; col < cols; col++) {
            callback(raw, col);
        }
    }
}
exports.visitArray = visitArray;
/**
 *多次执行回调函数
 *
 * @export
 * @param {Function} callback
 * @param {number} [times=1] 执行次数
 */
function moreFunc(callback, times) {
    if (times === void 0) { times = 1; }
    var count = 0;
    var loop = function () {
        if (count >= times) {
            return;
        }
        count++;
        callback();
        loop();
    };
    loop();
}
exports.moreFunc = moreFunc;
/**
 *转为整型
 *
 * @export
 * @param {*} value
 * @returns
 */
function toInt(value) {
    return parseInt(String(value));
}
exports.toInt = toInt;
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
function alterArray(arr, pos) {
    arr[pos.raw][pos.col] = pos.value;
}
exports.alterArray = alterArray;
/**
 *PointList得到二维坐标容器
 *
 * @export
 * @returns {Array<Point>}
 */
function PointList() {
    return new Array();
}
exports.PointList = PointList;
/**
 *得到填充数组
 *
 * @export
 * @template Type
 * @param {Type} value
 * @param {number} [length=1]
 * @returns {Type[]}
 */
function fillArray(value, length) {
    if (length === void 0) { length = 1; }
    var arr = new Array();
    for (var i = 0; i < length; i++) {
        arr.push(value);
    }
    return arr;
}
exports.fillArray = fillArray;
/**
 *得到填充二维数组
 *
 * @export
 * @template Type
 * @param {Type} value
 * @param {{ raw: number; col: number }} size
 * @returns {Type[][]}
 */
function fillArraySuper(value, size) {
    var arr = new Array();
    for (var raw = 0; raw < size.raw; raw++) {
        arr.push([]);
        for (var col = 0; col < size.col; col++) {
            arr[raw][col] = value;
        }
    }
    return arr;
}
exports.fillArraySuper = fillArraySuper;
/**
 *检测一维数组是否有相邻相同数字
 *
 * @export
 * @param {number[]} arr
 * @returns {boolean} 若存在则返回ture
 */
function hasTwice(arr) {
    var len = arr.length;
    var result = false;
    for (var i = 0; i < len - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            result = true;
            break;
        }
    }
    return result;
}
exports.hasTwice = hasTwice;
/**
 *检测二维数组行方向是否有相邻相同数字
 *
 * @export
 * @param {number[][]} map
 * @returns {boolean} 若存在则返回ture
 */
function testRows(map) {
    var result = false;
    for (var _i = 0, map_1 = map; _i < map_1.length; _i++) {
        var raw = map_1[_i];
        result = hasTwice(raw);
        if (result) {
            break;
        }
    }
    return result;
}
exports.testRows = testRows;
/**
 *检测二维数组是否有相邻相同数字
 *
 * @export
 * @param {number[][]} map
 * @returns {boolean} 若存在则返回ture
 */
function hasTwiceSuper(map) {
    var resultRaw = false;
    var resultCol = false;
    resultRaw = testRows(map);
    var mapTurn = transformArray(map);
    resultCol = testRows(mapTurn);
    return resultRaw || resultCol;
}
exports.hasTwiceSuper = hasTwiceSuper;
