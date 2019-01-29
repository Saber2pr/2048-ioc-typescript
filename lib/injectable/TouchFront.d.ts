import ITouchFront from '../interface/ITouchFront';
export declare class TouchFront implements ITouchFront {
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
    constructor(offset?: number, delta?: number);
    subscribe(callbackLeft?: Function, callbackRight?: Function, callbackUp?: Function, callbackDown?: Function): this;
    onStart(callback: Function): this;
    onUpdate(callback: Function): this;
    onStop(callback: Function): this;
    listen(): void;
    private testPos;
}
