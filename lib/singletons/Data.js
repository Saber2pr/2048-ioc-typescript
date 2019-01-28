"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: AK-12
 * @Date: 2018-11-02 17:06:17
 * @Last Modified by: AK-12
 * @Last Modified time: 2019-01-28 19:51:21
 */
var MathVec_1 = require("../utils/MathVec");
var saber_ioc_1 = require("saber-ioc");
/**
 *矩阵合并算法
 *
 * 单例类
 * @export
 * @class Data
 */
var Data = /** @class */ (function () {
    function Data() {
        var _this = this;
        /**
         *反转回调处理矩阵
         *
         * @private
         * @memberof Data
         */
        this.mergeSuper = function (arr, callback) {
            var map = new Array();
            var delta = new Array();
            _this.__updateTimes = _this.updateTimes;
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var raw = arr_1[_i];
                var arrAndDelta = callback(raw);
                map.push(arrAndDelta.arr);
                delta.push(arrAndDelta.delta);
            }
            return {
                map: map,
                delta: delta
            };
        };
        /**
         *向左合并
         *
         * @private
         * @memberof Data
         */
        this.mergeLeft = function (arr) {
            var i, nextI, m;
            var len = arr.length;
            var delta = MathVec_1.fillArray(0, arr.length);
            for (i = 0; i < len; i++) {
                nextI = -1;
                for (m = i + 1; m < len; m++) {
                    if (arr[m] !== 0) {
                        nextI = m;
                        if (arr[i] === arr[m]) {
                            delta[m] = m - i;
                        }
                        else {
                            if (arr[i] === 0) {
                                delta[m] = m - i;
                            }
                            else {
                                delta[m] = m - i - 1;
                            }
                        }
                        break;
                    }
                }
                if (nextI !== -1) {
                    if (arr[i] === 0) {
                        arr[i] = arr[nextI];
                        arr[nextI] = 0;
                        i -= 1;
                    }
                    else if (arr[i] === arr[nextI]) {
                        arr[i] = arr[i] * 2;
                        _this.updateTimes =
                            arr[i] < _this.maxValue
                                ? _this.updateTimes + arr[i]
                                : _this.updateTimes + 1;
                        arr[nextI] = 0;
                    }
                }
            }
            return {
                arr: arr,
                delta: delta
            };
        };
        /**
         *向右合并
         *
         * @private
         * @memberof Data
         */
        this.mergeRight = function (arr) {
            var arr_re = arr.slice().reverse();
            var arrAndDelta = _this.mergeLeft(arr_re);
            return {
                arr: arrAndDelta.arr.slice().reverse(),
                delta: arrAndDelta.delta.slice().reverse()
            };
        };
    }
    Data_1 = Data;
    Data.getInstance = function () {
        this.instance = this.instance || new Data_1();
        return this.instance;
    };
    /**
     *初始化矩阵数据
     *
     * @param {number} size 方阵边长
     * @param {number} [maxValue=2048] 数字最大值
     * @memberof Data
     */
    Data.prototype.init = function (size, maxValue) {
        if (maxValue === void 0) { maxValue = 2048; }
        this.updateTimes = 0;
        this.__updateTimes = 0;
        this.maxValue = maxValue;
        this.map = MathVec_1.fillArraySuper(0, {
            raw: size,
            col: size
        });
        this.__map = MathVec_1.fillArraySuper(0, {
            raw: size,
            col: size
        });
        return this;
    };
    Object.defineProperty(Data.prototype, "data", {
        /**
         *当前矩阵
         *
         * @readonly
         * @type {number[][]}
         * @memberof Data
         */
        get: function () {
            return this.map;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Data.prototype, "updateValue", {
        /**
         *得到updateTimes增量
         *
         * @readonly
         * @type {number}
         * @memberof Data
         */
        get: function () {
            return this.updateTimes - this.__updateTimes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Data.prototype, "score", {
        /**
         *分数
         *
         * @readonly
         * @type {number}
         * @memberof Data
         */
        get: function () {
            return this.updateTimes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Data.prototype, "MaxValue", {
        /**
         *最大值
         *
         * @readonly
         * @type {number}
         * @memberof Data
         */
        get: function () {
            return this.maxValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Data.prototype, "isChanged", {
        /**
         *检测数据是否变动
         *
         * @readonly
         * @type {boolean}
         * @memberof Data
         */
        get: function () {
            return this.__map.toString() !== this.map.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Data.prototype, "result", {
        /**
         *获取updateTimes状态
         *
         * @readonly
         * @type {boolean} 数字超过maxValue则返回true
         * @memberof Data
         */
        get: function () {
            return Boolean(Math.abs(this.updateTimes) % 2);
        },
        enumerable: true,
        configurable: true
    });
    /**
     *合并方向, 返回合并偏差二维数组
     *
     * @param {string} method
     * @param {number[][]} [arr=this.map]
     * @returns {Array<Array<number>>}
     * @memberof Data
     */
    Data.prototype.merge = function (method, arr) {
        var _this = this;
        if (arr === void 0) { arr = this.map; }
        MathVec_1.visitArray(this.map, function (raw, col) {
            _this.__map[raw][col] = _this.map[raw][col];
        });
        var delta;
        switch (method) {
            case 'left':
                {
                    var mapAndDelta = this.mergeSuper(arr, this.mergeLeft);
                    this.map = mapAndDelta.map;
                    delta = mapAndDelta.delta;
                }
                break;
            case 'right':
                {
                    var mapAndDelta = this.mergeSuper(arr, this.mergeRight);
                    this.map = mapAndDelta.map;
                    delta = mapAndDelta.delta;
                }
                break;
            case 'up':
                {
                    var mapAndDelta = this.mergeSuper(MathVec_1.transformArray(arr), this.mergeLeft);
                    delta = MathVec_1.transformArray(mapAndDelta.delta);
                    this.map = MathVec_1.transformArray(mapAndDelta.map);
                }
                break;
            case 'down':
                {
                    var mapAndDelta = this.mergeSuper(MathVec_1.transformArray(arr), this.mergeRight);
                    delta = MathVec_1.transformArray(mapAndDelta.delta);
                    this.map = MathVec_1.transformArray(mapAndDelta.map);
                }
                break;
            default:
                throw new Error('Data merge method error');
        }
        return {
            data: this.data,
            delta: delta
        };
    };
    Object.defineProperty(Data.prototype, "isFull", {
        /**
         *检测矩阵数字是否都不为0, 若都不为0则返回true
         *
         * @readonly
         * @type {boolean}
         * @memberof Data
         */
        get: function () {
            var _this = this;
            this.hasNext = false;
            MathVec_1.visitArray(this.map, function (raw, col) {
                if (_this.map[raw][col] === 0) {
                    _this.hasNext = true;
                }
            });
            return !this.hasNext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Data.prototype, "hasTwice", {
        /**
         *检测矩阵是否存在相邻相同数字, 若存在则返回ture
         *
         * @readonly
         * @type {boolean}
         * @memberof Data
         */
        get: function () {
            return MathVec_1.hasTwiceSuper(this.map);
        },
        enumerable: true,
        configurable: true
    });
    /**
     *随机位置添加元素
     *
     * @param {number} [times=1]
     * @returns {boolean} 返回true, 若没有空位则返回false
     * @memberof Data
     */
    Data.prototype.addRand = function (times) {
        var _this = this;
        if (times === void 0) { times = 1; }
        var points = MathVec_1.PointList();
        MathVec_1.moreFunc(function () {
            MathVec_1.visitArray(_this.map, function (raw, col) {
                if (_this.map[raw][col] === 0) {
                    points.push({ x: raw, y: col });
                    _this.hasNext = true;
                }
            });
            if (_this.hasNext) {
                var index = MathVec_1.toInt(Math.random() * points.length);
                MathVec_1.alterArray(_this.map, {
                    raw: points[index].x,
                    col: points[index].y,
                    value: 2
                });
            }
        }, times);
        return this.hasNext;
    };
    var Data_1;
    Data = Data_1 = __decorate([
        saber_ioc_1.SingletonLazy,
        saber_ioc_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], Data);
    return Data;
}());
exports.default = Data;
