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
var saber_mat_1 = require("saber-mat");
var saber_interval_1 = require("saber-interval");
var Matrix = /** @class */ (function () {
    function Matrix() {
        var _this = this;
        this.mergeLeft = function (arr) {
            var i, nextI, m;
            var len = arr.length;
            for (i = 0; i < len; i++) {
                nextI = -1;
                for (m = i + 1; m < len; m++) {
                    if (arr[m] !== 0) {
                        nextI = m;
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
                        arr[nextI] = 0;
                    }
                }
            }
            return arr;
        };
        this.mergeRight = function (arr) {
            return _this.mergeLeft(arr.slice().reverse()).reverse();
        };
    }
    Matrix_1 = Matrix;
    Matrix.getInstance = function () {
        this.instance = this.instance || new Matrix_1();
        return this.instance;
    };
    Matrix.prototype.init = function (size) {
        this.mat = saber_mat_1.MatFill(0, size);
        return this;
    };
    Matrix.prototype.merge = function (method) {
        var _this = this;
        switch (method) {
            case 'left':
                this.mat = this.mat.map(function (raw) { return _this.mergeLeft(raw); });
                break;
            case 'right':
                this.mat = this.mat.map(function (raw) { return _this.mergeRight(raw); });
                break;
            case 'up':
                this.mat = saber_mat_1.MatTransform(saber_mat_1.MatTransform(this.mat).map(function (raw) { return _this.mergeLeft(raw); }));
                break;
            case 'down':
                this.mat = saber_mat_1.MatTransform(saber_mat_1.MatTransform(this.mat).map(function (raw) { return _this.mergeRight(raw); }));
                break;
        }
        return this.mat;
    };
    Matrix.prototype.addRand = function (times) {
        var _this = this;
        if (times === void 0) { times = 1; }
        var points = [];
        saber_interval_1.call(function () {
            saber_mat_1.Mat_foreach(_this.mat, function (value, raw, col) {
                if (value === 0) {
                    points.push({ x: raw, y: col });
                    _this.hasNext = true;
                }
            });
            if (_this.hasNext) {
                var index = parseInt(String(Math.random() * points.length));
                saber_mat_1.MatSet(_this.mat, 2, {
                    raw: points[index].x,
                    col: points[index].y
                });
            }
        }, times);
        return this.hasNext;
    };
    var Matrix_1;
    Matrix = Matrix_1 = __decorate([
        saber_ioc_1.SingletonLazy,
        saber_ioc_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], Matrix);
    return Matrix;
}());
exports.Matrix = Matrix;
