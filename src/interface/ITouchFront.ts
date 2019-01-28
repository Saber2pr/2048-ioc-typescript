export default interface ITouchFront {
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
  subscribe(
    callbackLeft?: Function,
    callbackRight?: Function,
    callbackUp?: Function,
    callbackDown?: Function
  ): this
  /**
   * onStart
   * @param {Function} callback
   * @memberof TouchFront
   */
  onStart(callback: Function): this
  /**
   * onUpdate
   *
   * @param {Function} callback
   * @memberof TouchFront
   */
  onUpdate(callback: Function): this
  /**
   * onStop
   *
   * @param {Function} callback
   * @memberof TouchFront
   */
  onStop(callback: Function): this
  /**
   *监听触摸
   *
   * @memberof TouchFront
   */
  listen(): void
}
