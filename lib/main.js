"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Application_1 = require("./Application");
var saber_ioc_1 = require("saber-ioc");
var Layout_1 = require("./injectable/Layout");
var Factory_1 = require("./injectable/Factory");
var Data_1 = __importDefault(require("./singletons/Data"));
var TouchFront_1 = __importDefault(require("./injectable/TouchFront"));
var Canvas_1 = require("./singletons/Canvas");
new saber_ioc_1.SaFactory.Container(Layout_1.Layout, Factory_1.Factory, Application_1.Application, Data_1.default, TouchFront_1.default, Canvas_1.Canvas).run();
