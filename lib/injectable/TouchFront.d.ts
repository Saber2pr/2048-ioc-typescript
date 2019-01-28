import ITouchFront from '../interface/ITouchFront';
/**
 *触摸方向执行对应回调
 *
 * 接口类
 * @export
 * @class TouchFront
 * @implements {ITouchFront}
 */
export default class TouchFront implements ITouchFront {
    private offset;
    private delta;
    private _lock;
    private callbackLeft;
    private callbackRight;
    private callbackUp;
    private callbackDown;
    private callbackStart;
    private callbackUpdate;
    private callbackStop;
    /**
     *Creates an instance of TouchFront.
     * @param {number} [offset=100] 触摸偏移 ? 100
     * @param {number} [delta=200] 灵敏度 ? 200
     * @memberof TouchFront
     */
    constructor(offset?: number, delta?: number);
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
    subscribe(callbackLeft?: Function, callbackRight?: Function, callbackUp?: Function, callbackDown?: Function): this;
    /**
     * onStart
     * @param {Function} callback
     * @memberof TouchFront
     */
    onStart(callback: Function): this;
    /**
     * onUpdate
     *
     * @param {Function} callback
     * @memberof TouchFront
     */
    onUpdate(callback: Function): this;
    /**
     * onStop
     *
     * @param {Function} callback
     * @memberof TouchFront
     */
    onStop(callback: Function): this;
    /**
     *监听触摸
     *
     * @memberof TouchFront
     */
    listen(): void;
    /**
     *检测偏移执行回调
     *
     * @private
     * @memberof TouchFront
     */
    private testPos;
}
