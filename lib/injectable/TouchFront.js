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
var TouchFront = /** @class */ (function () {
    function TouchFront(offset, delta) {
        if (offset === void 0) { offset = 100; }
        if (delta === void 0) { delta = 200; }
        this.offset = offset;
        this._lock = 0;
        this.delta = delta;
    }
    TouchFront.prototype.subscribe = function (callbackLeft, callbackRight, callbackUp, callbackDown) {
        this.callbackLeft = callbackLeft;
        this.callbackRight = callbackRight;
        this.callbackUp = callbackUp;
        this.callbackDown = callbackDown;
        return this;
    };
    TouchFront.prototype.onStart = function (callback) {
        this.callbackStart = callback;
        return this;
    };
    TouchFront.prototype.onUpdate = function (callback) {
        this.callbackUpdate = callback;
        return this;
    };
    TouchFront.prototype.onStop = function (callback) {
        this.callbackStop = callback;
        return this;
    };
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
exports.TouchFront = TouchFront;
