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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var saber_ioc_1 = require("saber-ioc");
var saber_dom_1 = require("saber-dom");
var Application = /** @class */ (function () {
    function Application(Layout, Matrix, TouchFront) {
        this.Layout = Layout;
        this.Matrix = Matrix;
        this.TouchFront = TouchFront;
    }
    Application.prototype.main = function () {
        var _this = this;
        this.Matrix.getInstance()
            .init(4)
            .addRand(2);
        this.Layout.draw(this.Matrix.getInstance().merge('left'));
        this.TouchFront.onLeft(function () {
            return _this.Layout.draw(_this.Matrix.getInstance().merge('left'));
        })
            .onRight(function () { return _this.Layout.draw(_this.Matrix.getInstance().merge('right')); })
            .onUp(function () { return _this.Layout.draw(_this.Matrix.getInstance().merge('up')); })
            .onDown(function () { return _this.Layout.draw(_this.Matrix.getInstance().merge('down')); })
            .onStop(function () { return _this.Matrix.getInstance().addRand(2); })
            .listen(document.body);
    };
    Application = __decorate([
        saber_ioc_1.Bootstrap,
        __param(0, saber_ioc_1.Inject('Layout')),
        __param(1, saber_ioc_1.Inject('Matrix')),
        __param(2, saber_ioc_1.Inject('TouchFront')),
        __metadata("design:paramtypes", [Object, Object, saber_dom_1.TouchFront])
    ], Application);
    return Application;
}());
exports.Application = Application;
