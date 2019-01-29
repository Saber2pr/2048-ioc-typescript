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
var saber_mat_1 = require("saber-mat");
var Layout = /** @class */ (function () {
    function Layout(Factory, Canvas) {
        this.Factory = Factory;
        this.Canvas = Canvas;
        this.edge = {
            dx: 100,
            dy: 100
        };
    }
    Layout.prototype.draw = function (mat) {
        var _this = this;
        this.Canvas.instance.clear();
        saber_mat_1.Mat_foreach(mat, function (value, raw, col) {
            return value
                ? _this.Canvas.instance
                    .draw(_this.Factory.getNode().setPosition(col * _this.edge.dx, raw * _this.edge.dy))
                    .draw(_this.Factory.getLabel(value).setPosition(col * _this.edge.dx, raw * _this.edge.dy))
                : null;
        });
    };
    Layout = __decorate([
        saber_ioc_1.Injectable(),
        __param(0, saber_ioc_1.Inject('Factory')),
        __param(1, saber_ioc_1.Inject('Canvas')),
        __metadata("design:paramtypes", [Object, Object])
    ], Layout);
    return Layout;
}());
exports.Layout = Layout;
