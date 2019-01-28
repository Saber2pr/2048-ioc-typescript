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
var popmotion_1 = require("popmotion");
var MathVec_1 = require("../utils/MathVec");
var Canvas_1 = require("../singletons/Canvas");
var Layout = /** @class */ (function () {
    function Layout(Factory, Canvas) {
        this.Factory = Factory;
        this.Canvas = Canvas;
        this.edge = {
            dx: 100,
            dy: 100
        };
    }
    /**
     * @param {number} from
     * @param {number} to
     * @param {{obsNode: Observable<Node> obsLabel: Observable<Label>}} block
     * @memberof Layout
     */
    Layout.prototype.action = function (front, delta, block, onStop) {
        var _this = this;
        var props = {};
        props.duration = 500;
        var origin = block.pull();
        switch (front) {
            case 'left':
                props.from = origin.x;
                props.to = origin.x - delta;
                break;
            case 'right':
                props.from = origin.x;
                props.to = origin.x + delta;
                break;
            case 'up':
                props.from = origin.y;
                props.to = origin.y + delta;
                break;
            case 'down':
                props.from = origin.y;
                props.to = origin.y - delta;
                break;
        }
        console.log(props);
        if (front === 'left' || front === 'right') {
            popmotion_1.tween(props).start(function (v) {
                _this.Canvas.clear(origin);
                block.pipe(function (n) { return n.setPosition(v, n.y); });
            }).stop = onStop;
        }
        else {
            popmotion_1.tween(props).start(function (v) {
                _this.Canvas.clear(origin);
                block.pipe(function (n) { return n.setPosition(n.y, v); });
            }).stop = onStop;
        }
    };
    /**
     * @param {{ data: number[][]; delta: number[][] }} value
     * @param {Front} front
     * @memberof Layout
     */
    Layout.prototype.draw = function (value, front) {
        this.Canvas.clear();
        this.frame(value);
        //  visitArray(value.data, (raw, col)=> {
        //   const delta = value.delta[raw][col] * 100
        //   switch (front) {
        //     case 'left':
        //       this.action('left', delta, obsNode, this.frame)
        //       this.action('left', delta, obsLabel, this.frame)
        //       break
        //     case 'right':
        //       this.action('right', delta, obsNode, this.frame)
        //       this.action('right', delta, obsLabel, this.frame)
        //       break
        //     case 'up':
        //       this.action('up', delta, obsNode, this.frame)
        //       this.action('up', delta, obsLabel, this.frame)
        //       break
        //     case 'down':
        //       this.action('down', delta, obsNode, this.frame)
        //       this.action('down', delta, obsLabel, this.frame)
        //       break
        //   }
        //  })
    };
    Layout.prototype.frame = function (value) {
        var _this = this;
        this.Canvas.clear();
        MathVec_1.visitArray(value.data, function (raw, col) {
            if (value.data[raw][col] === 0) {
                return;
            }
            var obsNode = _this.Factory.getNodeObservable('blue', col * _this.edge.dx, raw * _this.edge.dy);
            obsNode.subscribe(function (n) { return _this.Canvas.draw(n); });
            _this.Canvas.draw(obsNode.pull());
            var obsLabel = _this.Factory.getLabelObservable(value.data[raw][col], col * _this.edge.dx, raw * _this.edge.dy);
            obsLabel.subscribe(function (l) { return _this.Canvas.draw(l); });
            _this.Canvas.draw(obsLabel.pull());
        });
    };
    Layout = __decorate([
        saber_ioc_1.Injectable(),
        __param(0, saber_ioc_1.Inject('Factory')),
        __param(1, saber_ioc_1.Inject('Canvas')),
        __metadata("design:paramtypes", [Object, Canvas_1.Canvas])
    ], Layout);
    return Layout;
}());
exports.Layout = Layout;
