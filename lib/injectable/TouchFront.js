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
var saber_ioc_1 = require("saber-ioc");
/**
 *触摸方向执行对应回调
 *
 * 接口类
 * @export
 * @class TouchFront
 * @implements {ITouchFront}
 */
var TouchFront = /** @class */ (function () {
    /**
     *Creates an instance of TouchFront.
     * @param {number} [offset=100] 触摸偏移 ? 100
     * @param {number} [delta=200] 灵敏度 ? 200
     * @memberof TouchFront
     */
    function TouchFront(offset, delta) {
        if (offset === void 0) { offset = 100; }
        if (delta === void 0) { delta = 200; }
        this.offset = offset;
        this._lock = 0;
        this.delta = delta;
    }
    /**
     * subscribe
     *
     * @param {Function} [callbackLeft]
     * @param {Function} [callbackRight]
     * @param {Function} [callbackUp]
     * @param {Function} [callbackDown]
     * @returns {TouchFront}
     * @memberof TouchFront
     */
    TouchFront.prototype.subscribe = function (callbackLeft, callbackRight, callbackUp, callbackDown) {
        this.callbackLeft = callbackLeft;
        this.callbackRight = callbackRight;
        this.callbackUp = callbackUp;
        this.callbackDown = callbackDown;
        return this;
    };
    /**
     * onStart
     * @param {Function} callback
     * @memberof TouchFront
     */
    TouchFront.prototype.onStart = function (callback) {
        this.callbackStart = callback;
        return this;
    };
    /**
     * onUpdate
     *
     * @param {Function} callback
     * @memberof TouchFront
     */
    TouchFront.prototype.onUpdate = function (callback) {
        this.callbackUpdate = callback;
        return this;
    };
    /**
     * onStop
     *
     * @param {Function} callback
     * @memberof TouchFront
     */
    TouchFront.prototype.onStop = function (callback) {
        this.callbackStop = callback;
        return this;
    };
    /**
     *监听触摸
     *
     * @memberof TouchFront
     */
    TouchFront.prototype.listen = function () {
        var _this = this;
        var originPos;
        document.addEventListener('mousedown', function (event) {
            originPos = event;
            !!_this.callbackStart ? _this.callbackStart() : null;
        });
        document.addEventListener('mousemove', function () {
            _this._lock++;
            if (originPos) {
                !!_this.callbackUpdate ? _this.callbackUpdate() : null;
            }
        });
        document.addEventListener('mouseup', function (event) {
            _this._lock < _this.delta ? _this.testPos(originPos, event) : null;
            _this._lock = 0;
            !!_this.callbackStop ? _this.callbackStop() : null;
            originPos = null;
        });
    };
    /**
     *检测偏移执行回调
     *
     * @private
     * @memberof TouchFront
     */
    TouchFront.prototype.testPos = function (originPos, touchPos) {
        if (Math.abs(touchPos.x - originPos.x) < this.offset &&
            Math.abs(touchPos.y - originPos.y) < this.offset) {
            return;
        }
        if (Math.abs(touchPos.x - originPos.x) > Math.abs(touchPos.y - originPos.y)) {
            if (touchPos.x - originPos.x > this.offset) {
                !!this.callbackRight ? this.callbackRight() : null;
            }
            else if (touchPos.x - originPos.x < -this.offset) {
                !!this.callbackLeft ? this.callbackLeft() : null;
            }
        }
        else {
            if (touchPos.y - originPos.y > this.offset) {
                !!this.callbackDown ? this.callbackDown() : null;
            }
            else if (touchPos.y - originPos.y < -this.offset) {
                !!this.callbackUp ? this.callbackUp() : null;
            }
        }
    };
    TouchFront = __decorate([
        saber_ioc_1.Injectable(),
        __metadata("design:paramtypes", [Number, Number])
    ], TouchFront);
    return TouchFront;
}());
exports.default = TouchFront;
