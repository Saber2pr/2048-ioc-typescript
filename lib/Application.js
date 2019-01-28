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
var Application = /** @class */ (function () {
    function Application(Layout, Data, TouchFront) {
        this.Layout = Layout;
        this.Data = Data;
        this.TouchFront = TouchFront;
    }
    Application.prototype.main = function () {
        var _this = this;
        this.Data.init(4, 2048).addRand(2);
        this.Layout.draw(this.Data.merge('left'), 'left');
        this.TouchFront.subscribe(function () { return _this.Layout.draw(_this.Data.merge('left'), 'left'); }, function () { return _this.Layout.draw(_this.Data.merge('right'), 'right'); }, function () { return _this.Layout.draw(_this.Data.merge('up'), 'up'); }, function () { return _this.Layout.draw(_this.Data.merge('down'), 'down'); })
            .onStop(function () { return _this.Data.addRand(2); })
            .listen();
    };
    Application = __decorate([
        saber_ioc_1.Bootstrap,
        __param(0, saber_ioc_1.Inject('Layout')),
        __param(1, saber_ioc_1.Inject('Data')),
        __param(2, saber_ioc_1.Inject('TouchFront')),
        __metadata("design:paramtypes", [Object, Object, Object])
    ], Application);
    return Application;
}());
exports.Application = Application;
