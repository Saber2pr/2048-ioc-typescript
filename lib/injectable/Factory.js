"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var saber_ioc_1 = require("saber-ioc");
var saber_canvas_1 = require("saber-canvas");
var saber_observable_1 = require("saber-observable");
var Factory = /** @class */ (function () {
    function Factory() {
    }
    Factory.prototype.getNode = function () {
        return new saber_canvas_1.Node(50, 50);
    };
    Factory.prototype.getLabel = function (num) {
        return new saber_canvas_1.Label(String(num), 30);
    };
    Factory.prototype.getNodeObservable = function (color, x, y) {
        return new saber_observable_1.Observable(this.getNode()
            .setColor(color)
            .setPosition(x, y));
    };
    Factory.prototype.getLabelObservable = function (num, x, y) {
        return new saber_observable_1.Observable(this.getLabel(num).setPosition(x, y));
    };
    Factory = __decorate([
        saber_ioc_1.Injectable()
    ], Factory);
    return Factory;
}());
exports.Factory = Factory;
